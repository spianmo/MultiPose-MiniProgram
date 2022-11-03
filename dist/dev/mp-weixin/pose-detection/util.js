"use strict";
const poseDetection_constants = require("./constants.js");
const poseDetection_types = require("./types.js");
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
function getKeypointIndexBySide(model) {
  switch (model) {
    case poseDetection_types.SupportedModels.BlazePose:
      return poseDetection_constants.BLAZEPOSE_KEYPOINTS_BY_SIDE;
    case poseDetection_types.SupportedModels.PoseNet:
    case poseDetection_types.SupportedModels.MoveNet:
      return poseDetection_constants.COCO_KEYPOINTS_BY_SIDE;
    default:
      throw new Error(`Model ${model} is not supported.`);
  }
}
function getAdjacentPairs(model) {
  switch (model) {
    case poseDetection_types.SupportedModels.BlazePose:
      return poseDetection_constants.BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS;
    case poseDetection_types.SupportedModels.PoseNet:
    case poseDetection_types.SupportedModels.MoveNet:
      return poseDetection_constants.COCO_CONNECTED_KEYPOINTS_PAIRS;
    default:
      throw new Error(`Model ${model} is not supported.`);
  }
}
function getKeypointIndexByName(model) {
  switch (model) {
    case poseDetection_types.SupportedModels.BlazePose:
      return poseDetection_constants.BLAZEPOSE_KEYPOINTS.reduce((map, name, i) => {
        map[name] = i;
        return map;
      }, {});
    case poseDetection_types.SupportedModels.PoseNet:
    case poseDetection_types.SupportedModels.MoveNet:
      return poseDetection_constants.COCO_KEYPOINTS.reduce((map, name, i) => {
        map[name] = i;
        return map;
      }, {});
    default:
      throw new Error(`Model ${model} is not supported.`);
  }
}
exports.getAdjacentPairs = getAdjacentPairs;
exports.getKeypointIndexByName = getKeypointIndexByName;
exports.getKeypointIndexBySide = getKeypointIndexBySide;
