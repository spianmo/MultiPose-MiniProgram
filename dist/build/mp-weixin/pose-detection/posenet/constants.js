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
 */exports.K_LOCAL_MAXIMUM_RADIUS=1,exports.MOBILENET_V1_CONFIG={architecture:"MobileNetV1",outputStride:16,multiplier:.75,inputResolution:{height:257,width:257}},exports.MULTI_PERSON_ESTIMATION_CONFIG={maxPoses:5,flipHorizontal:!1,scoreThreshold:.5,nmsRadius:20},exports.NUM_KEYPOINTS=17,exports.POSE_CHAIN=[["nose","left_eye"],["left_eye","left_ear"],["nose","right_eye"],["right_eye","right_ear"],["nose","left_shoulder"],["left_shoulder","left_elbow"],["left_elbow","left_wrist"],["left_shoulder","left_hip"],["left_hip","left_knee"],["left_knee","left_ankle"],["nose","right_shoulder"],["right_shoulder","right_elbow"],["right_elbow","right_wrist"],["right_shoulder","right_hip"],["right_hip","right_knee"],["right_knee","right_ankle"]],exports.RESNET_MEAN=[-123.15,-115.9,-103.06],exports.SINGLE_PERSON_ESTIMATION_CONFIG={maxPoses:1,flipHorizontal:!1},exports.VALID_ARCHITECTURE=["MobileNetV1","ResNet50"],exports.VALID_MULTIPLIER={MobileNetV1:[.5,.75,1],ResNet50:[1]},exports.VALID_OUTPUT_STRIDES=[8,16,32],exports.VALID_QUANT_BYTES=[1,2,4],exports.VALID_STRIDE={MobileNetV1:[8,16],ResNet50:[16]};
