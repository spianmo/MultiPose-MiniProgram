"use strict";
require("../common/vendor.js");
const poseDetection_movenet_constants = require("./movenet/constants.js");
require("./posenet/calculators/decode_multiple_poses_util.js");
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
const movenet = {
  modelType: {
    "SINGLEPOSE_LIGHTNING": poseDetection_movenet_constants.SINGLEPOSE_LIGHTNING,
    "SINGLEPOSE_THUNDER": poseDetection_movenet_constants.SINGLEPOSE_THUNDER,
    "MULTIPOSE_LIGHTNING": poseDetection_movenet_constants.MULTIPOSE_LIGHTNING
  }
};
exports.movenet = movenet;
