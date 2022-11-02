"use strict";
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
const SINGLEPOSE_LIGHTNING = "SinglePose.Lightning";
const SINGLEPOSE_THUNDER = "SinglePose.Thunder";
const VALID_MODELS = [SINGLEPOSE_LIGHTNING, SINGLEPOSE_THUNDER];
const MOVENET_SINGLEPOSE_LIGHTNING_URL = "https://cdn.static.oppenlab.com/weblf/test/movenet-singlepose-lightning";
const MOVENET_SINGLEPOSE_THUNDER_URL = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/3";
const MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION = 192;
const MOVENET_SINGLEPOSE_THUNDER_RESOLUTION = 256;
const MOVENET_CONFIG = {
  modelType: SINGLEPOSE_LIGHTNING,
  enableSmoothing: true
};
const MOVENET_SINGLE_POSE_ESTIMATION_CONFIG = {
  maxPoses: 1
};
const KEYPOINT_FILTER_CONFIG = {
  frequency: 30,
  minCutOff: 6.36,
  beta: 636.61,
  derivateCutOff: 4.77,
  thresholdCutOff: 0.5,
  thresholdBeta: 5
};
const CROP_FILTER_ALPHA = 0.9;
const MIN_CROP_KEYPOINT_SCORE = 0.2;
exports.CROP_FILTER_ALPHA = CROP_FILTER_ALPHA;
exports.KEYPOINT_FILTER_CONFIG = KEYPOINT_FILTER_CONFIG;
exports.MIN_CROP_KEYPOINT_SCORE = MIN_CROP_KEYPOINT_SCORE;
exports.MOVENET_CONFIG = MOVENET_CONFIG;
exports.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION = MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
exports.MOVENET_SINGLEPOSE_LIGHTNING_URL = MOVENET_SINGLEPOSE_LIGHTNING_URL;
exports.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION = MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
exports.MOVENET_SINGLEPOSE_THUNDER_URL = MOVENET_SINGLEPOSE_THUNDER_URL;
exports.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG = MOVENET_SINGLE_POSE_ESTIMATION_CONFIG;
exports.SINGLEPOSE_LIGHTNING = SINGLEPOSE_LIGHTNING;
exports.SINGLEPOSE_THUNDER = SINGLEPOSE_THUNDER;
exports.VALID_MODELS = VALID_MODELS;
