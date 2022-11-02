"use strict";
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
function validateModelConfig(modelConfig) {
  const config = modelConfig == null ? poseDetection_movenet_constants.MOVENET_CONFIG : { ...modelConfig };
  if (!modelConfig.modelType) {
    modelConfig.modelType = "SinglePose.Lightning";
  } else if (poseDetection_movenet_constants.VALID_MODELS.indexOf(config.modelType) < 0) {
    throw new Error(
      `Invalid architecture ${config.modelType}. Should be one of ${poseDetection_movenet_constants.VALID_MODELS}`
    );
  }
  if (config.enableSmoothing == null) {
    config.enableSmoothing = true;
  }
  return config;
}
function validateEstimationConfig(estimationConfig) {
  const config = estimationConfig == null ? poseDetection_movenet_constants.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG : { ...estimationConfig };
  if (!config.maxPoses) {
    config.maxPoses = 1;
  }
  if (config.maxPoses <= 0 || config.maxPoses > 1) {
    throw new Error(`Invalid maxPoses ${config.maxPoses}. Should be 1.`);
  }
  return config;
}
exports.validateEstimationConfig = validateEstimationConfig;
exports.validateModelConfig = validateModelConfig;
