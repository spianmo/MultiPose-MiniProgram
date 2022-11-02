"use strict";
const common_vendor = require("../../../common/vendor.js");
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function tensorsToDetections(detectionTensors, anchor, config) {
  const rawScoreTensor = detectionTensors[0];
  const rawBoxTensor = detectionTensors[1];
  const boxes = decodeBoxes(rawBoxTensor, anchor, config);
  const normalizedScore = common_vendor.tidy(() => {
    let normalizedScore2 = rawScoreTensor;
    if (config.sigmoidScore) {
      if (config.scoreClippingThresh != null) {
        normalizedScore2 = common_vendor.clipByValue(
          rawScoreTensor,
          -config.scoreClippingThresh,
          config.scoreClippingThresh
        );
      }
      normalizedScore2 = common_vendor.sigmoid(normalizedScore2);
      return normalizedScore2;
    }
    return normalizedScore2;
  });
  const outputDetections = convertToDetections(boxes, normalizedScore, config);
  common_vendor.dispose([boxes, normalizedScore]);
  return outputDetections;
}
function convertToDetections(detectionBoxes, detectionScore, config) {
  const outputDetections = [];
  const detectionBoxesData = detectionBoxes.dataSync();
  const detectionScoresData = detectionScore.dataSync();
  for (let i = 0; i < config.numBoxes; ++i) {
    if (config.minScoreThresh != null && detectionScoresData[i] < config.minScoreThresh) {
      continue;
    }
    const boxOffset = i * config.numCoords;
    const detection = convertToDetection(
      detectionBoxesData[boxOffset + 0],
      detectionBoxesData[boxOffset + 1],
      detectionBoxesData[boxOffset + 2],
      detectionBoxesData[boxOffset + 3],
      detectionScoresData[i],
      config.flipVertically,
      i
    );
    const bbox = detection.locationData.relativeBoundingBox;
    if (bbox.width < 0 || bbox.height < 0) {
      continue;
    }
    if (config.numKeypoints > 0) {
      const locationData = detection.locationData;
      locationData.relativeKeypoints = [];
      const totalIdx = config.numKeypoints * config.numValuesPerKeypoint;
      for (let kpId = 0; kpId < totalIdx; kpId += config.numValuesPerKeypoint) {
        const keypointIndex = boxOffset + config.keypointCoordOffset + kpId;
        const keypoint = {
          x: detectionBoxesData[keypointIndex + 0],
          y: config.flipVertically ? 1 - detectionBoxesData[keypointIndex + 1] : detectionBoxesData[keypointIndex + 1]
        };
        locationData.relativeKeypoints.push(keypoint);
      }
    }
    outputDetections.push(detection);
  }
  return outputDetections;
}
function convertToDetection(boxYMin, boxXMin, boxYMax, boxXMax, score, flipVertically, i) {
  return {
    score: [score],
    ind: i,
    locationData: {
      relativeBoundingBox: {
        xMin: boxXMin,
        yMin: flipVertically ? 1 - boxYMax : boxYMin,
        xMax: boxXMax,
        yMax: flipVertically ? 1 - boxYMin : boxYMax,
        width: boxXMax - boxXMin,
        height: boxYMax - boxYMin
      }
    }
  };
}
function decodeBoxes(rawBoxes, anchor, config) {
  return common_vendor.tidy(() => {
    let yCenter;
    let xCenter;
    let h;
    let w;
    if (config.reverseOutputOrder) {
      xCenter = common_vendor.squeeze(
        common_vendor.slice(rawBoxes, [0, config.boxCoordOffset + 0], [-1, 1])
      );
      yCenter = common_vendor.squeeze(
        common_vendor.slice(rawBoxes, [0, config.boxCoordOffset + 1], [-1, 1])
      );
      w = common_vendor.squeeze(
        common_vendor.slice(rawBoxes, [0, config.boxCoordOffset + 2], [-1, 1])
      );
      h = common_vendor.squeeze(
        common_vendor.slice(rawBoxes, [0, config.boxCoordOffset + 3], [-1, 1])
      );
    } else {
      yCenter = common_vendor.squeeze(
        common_vendor.slice(rawBoxes, [0, config.boxCoordOffset + 0], [-1, 1])
      );
      xCenter = common_vendor.squeeze(
        common_vendor.slice(rawBoxes, [0, config.boxCoordOffset + 1], [-1, 1])
      );
      h = common_vendor.squeeze(
        common_vendor.slice(rawBoxes, [0, config.boxCoordOffset + 2], [-1, 1])
      );
      w = common_vendor.squeeze(
        common_vendor.slice(rawBoxes, [0, config.boxCoordOffset + 3], [-1, 1])
      );
    }
    xCenter = common_vendor.add(common_vendor.mul(common_vendor.div(xCenter, config.xScale), anchor.w), anchor.x);
    yCenter = common_vendor.add(common_vendor.mul(common_vendor.div(yCenter, config.yScale), anchor.h), anchor.y);
    if (config.applyExponentialOnBoxSize) {
      h = common_vendor.mul(common_vendor.exp(common_vendor.div(h, config.hScale)), anchor.h);
      w = common_vendor.mul(common_vendor.exp(common_vendor.div(w, config.wScale)), anchor.w);
    } else {
      h = common_vendor.mul(common_vendor.div(h, config.hScale), anchor.h);
      w = common_vendor.mul(common_vendor.div(w, config.wScale), anchor.h);
    }
    const yMin = common_vendor.sub(yCenter, common_vendor.div(h, 2));
    const xMin = common_vendor.sub(xCenter, common_vendor.div(w, 2));
    const yMax = common_vendor.add(yCenter, common_vendor.div(h, 2));
    const xMax = common_vendor.add(xCenter, common_vendor.div(w, 2));
    let boxes = common_vendor.concat(
      [
        common_vendor.reshape(yMin, [config.numBoxes, 1]),
        common_vendor.reshape(xMin, [config.numBoxes, 1]),
        common_vendor.reshape(yMax, [config.numBoxes, 1]),
        common_vendor.reshape(xMax, [config.numBoxes, 1])
      ],
      1
    );
    if (config.numKeypoints) {
      for (let k = 0; k < config.numKeypoints; ++k) {
        const keypointOffset = config.keypointCoordOffset + k * config.numValuesPerKeypoint;
        let keypointX;
        let keypointY;
        if (config.reverseOutputOrder) {
          keypointX = common_vendor.squeeze(common_vendor.slice(rawBoxes, [0, keypointOffset], [-1, 1]));
          keypointY = common_vendor.squeeze(common_vendor.slice(rawBoxes, [0, keypointOffset + 1], [-1, 1]));
        } else {
          keypointY = common_vendor.squeeze(common_vendor.slice(rawBoxes, [0, keypointOffset], [-1, 1]));
          keypointX = common_vendor.squeeze(common_vendor.slice(rawBoxes, [0, keypointOffset + 1], [-1, 1]));
        }
        const keypointXNormalized = common_vendor.add(
          common_vendor.mul(common_vendor.div(keypointX, config.xScale), anchor.w),
          anchor.x
        );
        const keypointYNormalized = common_vendor.add(
          common_vendor.mul(common_vendor.div(keypointY, config.yScale), anchor.h),
          anchor.y
        );
        boxes = common_vendor.concat(
          [
            boxes,
            common_vendor.reshape(keypointXNormalized, [config.numBoxes, 1]),
            common_vendor.reshape(keypointYNormalized, [config.numBoxes, 1])
          ],
          1
        );
      }
    }
    return boxes;
  });
}
exports.tensorsToDetections = tensorsToDetections;
