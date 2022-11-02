"use strict";
const common_vendor = require("../../../common/vendor.js");
const poseDetection_constants = require("../../constants.js");
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function mod(a, b) {
  return common_vendor.tidy(() => {
    const floored = common_vendor.div(a, common_vendor.scalar(b, "int32"));
    return common_vendor.sub(a, common_vendor.mul(floored, common_vendor.scalar(b, "int32")));
  });
}
function argmax2d(inputs) {
  const [height, width, depth] = inputs.shape;
  return common_vendor.tidy(() => {
    const reshaped = common_vendor.reshape(inputs, [height * width, depth]);
    const coords = common_vendor.argMax(reshaped, 0);
    const yCoords = common_vendor.expandDims(common_vendor.div(coords, common_vendor.scalar(width, "int32")), 1);
    const xCoords = common_vendor.expandDims(mod(coords, width), 1);
    return common_vendor.concat([yCoords, xCoords], 1);
  });
}
function getPointsConfidence(heatmapScores, heatMapCoords) {
  const numKeypoints = heatMapCoords.shape[0];
  const result = new Float32Array(numKeypoints);
  for (let keypoint = 0; keypoint < numKeypoints; keypoint++) {
    const y = heatMapCoords.get(keypoint, 0);
    const x = heatMapCoords.get(keypoint, 1);
    result[keypoint] = heatmapScores.get(y, x, keypoint);
  }
  return result;
}
function getOffsetPoints(heatMapCoordsBuffer, outputStride, offsetsBuffer) {
  return common_vendor.tidy(() => {
    const offsetVectors = getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer);
    return common_vendor.add(
      common_vendor.cast(
        common_vendor.mul(
          heatMapCoordsBuffer.toTensor(),
          common_vendor.scalar(outputStride, "int32")
        ),
        "float32"
      ),
      offsetVectors
    );
  });
}
function getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer) {
  const result = [];
  for (let keypoint = 0; keypoint < poseDetection_constants.COCO_KEYPOINTS.length; keypoint++) {
    const heatmapY = heatMapCoordsBuffer.get(keypoint, 0).valueOf();
    const heatmapX = heatMapCoordsBuffer.get(keypoint, 1).valueOf();
    const { x, y } = getOffsetPoint(heatmapY, heatmapX, keypoint, offsetsBuffer);
    result.push(y);
    result.push(x);
  }
  return common_vendor.tensor2d(result, [poseDetection_constants.COCO_KEYPOINTS.length, 2]);
}
function getOffsetPoint(y, x, keypoint, offsetsBuffer) {
  return {
    y: offsetsBuffer.get(y, x, keypoint),
    x: offsetsBuffer.get(y, x, keypoint + poseDetection_constants.COCO_KEYPOINTS.length)
  };
}
exports.argmax2d = argmax2d;
exports.getOffsetPoints = getOffsetPoints;
exports.getPointsConfidence = getPointsConfidence;
