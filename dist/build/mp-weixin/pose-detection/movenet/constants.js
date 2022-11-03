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
 */const e=["SinglePose.Lightning","SinglePose.Thunder"],t={modelType:"SinglePose.Lightning",enableSmoothing:!0};exports.CROP_FILTER_ALPHA=.9,exports.KEYPOINT_FILTER_CONFIG={frequency:30,minCutOff:6.36,beta:636.61,derivateCutOff:4.77,thresholdCutOff:.5,thresholdBeta:5},exports.MIN_CROP_KEYPOINT_SCORE=.2,exports.MOVENET_CONFIG=t,exports.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION=192,exports.MOVENET_SINGLEPOSE_LIGHTNING_URL="https://cdn.static.oppenlab.com/weblf/test/movenet-singlepose-lightning",exports.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION=256,exports.MOVENET_SINGLEPOSE_THUNDER_URL="https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/3",exports.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG={maxPoses:1},exports.SINGLEPOSE_LIGHTNING="SinglePose.Lightning",exports.SINGLEPOSE_THUNDER="SinglePose.Thunder",exports.VALID_MODELS=e;
