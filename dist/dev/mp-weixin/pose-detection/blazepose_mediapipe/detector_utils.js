"use strict";
const poseDetection_blazepose_mediapipe_constants = require("./constants.js");
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
  if (modelConfig == null) {
    return { ...poseDetection_blazepose_mediapipe_constants.DEFAULT_BLAZEPOSE_MODEL_CONFIG };
  }
  const config = { ...modelConfig };
  config.runtime = "mediapipe";
  if (config.enableSegmentation == null) {
    config.enableSegmentation = poseDetection_blazepose_mediapipe_constants.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSegmentation;
  }
  if (config.enableSmoothing == null) {
    config.enableSmoothing = poseDetection_blazepose_mediapipe_constants.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSmoothing;
  }
  if (config.smoothSegmentation == null) {
    config.smoothSegmentation = poseDetection_blazepose_mediapipe_constants.DEFAULT_BLAZEPOSE_MODEL_CONFIG.smoothSegmentation;
  }
  if (config.modelType == null) {
    config.modelType = poseDetection_blazepose_mediapipe_constants.DEFAULT_BLAZEPOSE_MODEL_CONFIG.modelType;
  }
  return config;
}
exports.validateModelConfig = validateModelConfig;
