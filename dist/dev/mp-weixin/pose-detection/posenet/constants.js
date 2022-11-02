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
const MOBILENET_V1_CONFIG = {
  architecture: "MobileNetV1",
  outputStride: 16,
  multiplier: 0.75,
  inputResolution: { height: 257, width: 257 }
};
const VALID_ARCHITECTURE = ["MobileNetV1", "ResNet50"];
const VALID_STRIDE = {
  "MobileNetV1": [8, 16],
  "ResNet50": [16]
};
const VALID_OUTPUT_STRIDES = [8, 16, 32];
const VALID_MULTIPLIER = {
  "MobileNetV1": [0.5, 0.75, 1],
  "ResNet50": [1]
};
const VALID_QUANT_BYTES = [1, 2, 4];
const SINGLE_PERSON_ESTIMATION_CONFIG = {
  maxPoses: 1,
  flipHorizontal: false
};
const MULTI_PERSON_ESTIMATION_CONFIG = {
  maxPoses: 5,
  flipHorizontal: false,
  scoreThreshold: 0.5,
  nmsRadius: 20
};
const RESNET_MEAN = [-123.15, -115.9, -103.06];
const K_LOCAL_MAXIMUM_RADIUS = 1;
const NUM_KEYPOINTS = 17;
const POSE_CHAIN = [
  ["nose", "left_eye"],
  ["left_eye", "left_ear"],
  ["nose", "right_eye"],
  ["right_eye", "right_ear"],
  ["nose", "left_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["left_shoulder", "left_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["nose", "right_shoulder"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["right_shoulder", "right_hip"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"]
];
exports.K_LOCAL_MAXIMUM_RADIUS = K_LOCAL_MAXIMUM_RADIUS;
exports.MOBILENET_V1_CONFIG = MOBILENET_V1_CONFIG;
exports.MULTI_PERSON_ESTIMATION_CONFIG = MULTI_PERSON_ESTIMATION_CONFIG;
exports.NUM_KEYPOINTS = NUM_KEYPOINTS;
exports.POSE_CHAIN = POSE_CHAIN;
exports.RESNET_MEAN = RESNET_MEAN;
exports.SINGLE_PERSON_ESTIMATION_CONFIG = SINGLE_PERSON_ESTIMATION_CONFIG;
exports.VALID_ARCHITECTURE = VALID_ARCHITECTURE;
exports.VALID_MULTIPLIER = VALID_MULTIPLIER;
exports.VALID_OUTPUT_STRIDES = VALID_OUTPUT_STRIDES;
exports.VALID_QUANT_BYTES = VALID_QUANT_BYTES;
exports.VALID_STRIDE = VALID_STRIDE;
