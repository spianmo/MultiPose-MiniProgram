"use strict";
const poseDetection_blazepose_mediapipe_detector = require("./blazepose_mediapipe/detector.js");
const poseDetection_blazepose_tfjs_detector = require("./blazepose_tfjs/detector.js");
const poseDetection_movenet_detector = require("./movenet/detector.js");
const poseDetection_posenet_detector = require("./posenet/detector.js");
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
async function createDetector(model, modelConfig) {
  switch (model) {
    case poseDetection_types.SupportedModels.PoseNet:
      return poseDetection_posenet_detector.load(modelConfig);
    case poseDetection_types.SupportedModels.BlazePose:
      const config = modelConfig;
      let runtime;
      if (config != null) {
        if (config.runtime === "tfjs") {
          return poseDetection_blazepose_tfjs_detector.load(
            modelConfig
          );
        }
        if (config.runtime === "mediapipe") {
          return poseDetection_blazepose_mediapipe_detector.load(
            modelConfig
          );
        }
        runtime = config.runtime;
      }
      throw new Error(
        `Expect modelConfig.runtime to be either 'tfjs' or 'mediapipe', but got ${runtime}`
      );
    case poseDetection_types.SupportedModels.MoveNet:
      return poseDetection_movenet_detector.load(modelConfig);
    default:
      throw new Error(`${model} is not a supported model name.`);
  }
}
exports.createDetector = createDetector;
