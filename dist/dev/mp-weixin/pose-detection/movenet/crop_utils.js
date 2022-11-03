"use strict";
const poseDetection_constants = require("../constants.js");
const poseDetection_movenet_constants = require("./constants.js");
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
function torsoVisible(keypoints, keypointIndexByName) {
  return (keypoints[keypointIndexByName["left_hip"]].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE || keypoints[keypointIndexByName["right_hip"]].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE) && (keypoints[keypointIndexByName["left_shoulder"]].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE || keypoints[keypointIndexByName["right_shoulder"]].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE);
}
function determineTorsoAndBodyRange(keypoints, keypointIndexByName, targetKeypoints, centerY, centerX) {
  const torsoJoints = ["left_shoulder", "right_shoulder", "left_hip", "right_hip"];
  let maxTorsoYrange = 0;
  let maxTorsoXrange = 0;
  for (let i = 0; i < torsoJoints.length; i++) {
    const distY = Math.abs(centerY - targetKeypoints[torsoJoints[i]][0]);
    const distX = Math.abs(centerX - targetKeypoints[torsoJoints[i]][1]);
    if (distY > maxTorsoYrange) {
      maxTorsoYrange = distY;
    }
    if (distX > maxTorsoXrange) {
      maxTorsoXrange = distX;
    }
  }
  let maxBodyYrange = 0;
  let maxBodyXrange = 0;
  for (const key of Object.keys(targetKeypoints)) {
    if (keypoints[keypointIndexByName[key]].score < poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE) {
      continue;
    }
    const distY = Math.abs(centerY - targetKeypoints[key][0]);
    const distX = Math.abs(centerX - targetKeypoints[key][1]);
    if (distY > maxBodyYrange) {
      maxBodyYrange = distY;
    }
    if (distX > maxBodyXrange) {
      maxBodyXrange = distX;
    }
  }
  return [maxTorsoYrange, maxTorsoXrange, maxBodyYrange, maxBodyXrange];
}
function determineNextCropRegion(currentCropRegion, keypoints, keypointIndexByName, imageSize) {
  const targetKeypoints = {};
  for (const key of poseDetection_constants.COCO_KEYPOINTS) {
    targetKeypoints[key] = [
      keypoints[keypointIndexByName[key]].y * imageSize.height,
      keypoints[keypointIndexByName[key]].x * imageSize.width
    ];
  }
  if (torsoVisible(keypoints, keypointIndexByName)) {
    const centerY = (targetKeypoints["left_hip"][0] + targetKeypoints["right_hip"][0]) / 2;
    const centerX = (targetKeypoints["left_hip"][1] + targetKeypoints["right_hip"][1]) / 2;
    const [maxTorsoYrange, maxTorsoXrange, maxBodyYrange, maxBodyXrange] = determineTorsoAndBodyRange(
      keypoints,
      keypointIndexByName,
      targetKeypoints,
      centerY,
      centerX
    );
    let cropLengthHalf = Math.max(
      maxTorsoXrange * 1.9,
      maxTorsoYrange * 1.9,
      maxBodyYrange * 1.2,
      maxBodyXrange * 1.2
    );
    cropLengthHalf = Math.min(
      cropLengthHalf,
      Math.max(
        centerX,
        imageSize.width - centerX,
        centerY,
        imageSize.height - centerY
      )
    );
    const cropCorner = [centerY - cropLengthHalf, centerX - cropLengthHalf];
    if (cropLengthHalf > Math.max(imageSize.width, imageSize.height) / 2) {
      return initCropRegion(currentCropRegion == null, imageSize);
    } else {
      const cropLength = cropLengthHalf * 2;
      return {
        yMin: cropCorner[0] / imageSize.height,
        xMin: cropCorner[1] / imageSize.width,
        yMax: (cropCorner[0] + cropLength) / imageSize.height,
        xMax: (cropCorner[1] + cropLength) / imageSize.width,
        height: (cropCorner[0] + cropLength) / imageSize.height - cropCorner[0] / imageSize.height,
        width: (cropCorner[1] + cropLength) / imageSize.width - cropCorner[1] / imageSize.width
      };
    }
  } else {
    return initCropRegion(currentCropRegion == null, imageSize);
  }
}
function initCropRegion(firstFrame, imageSize) {
  let boxHeight, boxWidth, yMin, xMin;
  if (firstFrame) {
    if (imageSize.width > imageSize.height) {
      boxHeight = 1;
      boxWidth = imageSize.height / imageSize.width;
      yMin = 0;
      xMin = (imageSize.width / 2 - imageSize.height / 2) / imageSize.width;
    } else {
      boxHeight = imageSize.width / imageSize.height;
      boxWidth = 1;
      yMin = (imageSize.height / 2 - imageSize.width / 2) / imageSize.height;
      xMin = 0;
    }
  } else {
    if (imageSize.width > imageSize.height) {
      boxHeight = imageSize.width / imageSize.height;
      boxWidth = 1;
      yMin = (imageSize.height / 2 - imageSize.width / 2) / imageSize.height;
      xMin = 0;
    } else {
      boxHeight = 1;
      boxWidth = imageSize.height / imageSize.width;
      yMin = 0;
      xMin = (imageSize.width / 2 - imageSize.height / 2) / imageSize.width;
    }
  }
  return {
    yMin,
    xMin,
    yMax: yMin + boxHeight,
    xMax: xMin + boxWidth,
    height: boxHeight,
    width: boxWidth
  };
}
exports.determineNextCropRegion = determineNextCropRegion;
exports.initCropRegion = initCropRegion;
