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
const DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL = "http://oss.cache.ren/img/blazepose/detector/f16/model.json";
const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL = "http://oss.cache.ren/img/blazepose/landmark/full-f16/model.json";
const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE = "http://oss.cache.ren/img/blazepose/landmark/lite-f16/model.json";
const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY = "http://oss.cache.ren/img/blazepose/landmark/heavy-f16/model.json";
const BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION = {
  reduceBoxesInLowestlayer: false,
  interpolatedScaleAspectRatio: 1,
  featureMapHeight: [],
  featureMapWidth: [],
  numLayers: 5,
  minScale: 0.1484375,
  maxScale: 0.75,
  inputSizeHeight: 224,
  inputSizeWidth: 224,
  anchorOffsetX: 0.5,
  anchorOffsetY: 0.5,
  strides: [8, 16, 32, 32, 32],
  aspectRatios: [1],
  fixedAnchorSize: true
};
const DEFAULT_BLAZEPOSE_MODEL_CONFIG = {
  runtime: "tfjs",
  modelType: "full",
  enableSmoothing: true,
  detectorModelUrl: DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL,
  landmarkModelUrl: DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL
};
const DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG = {
  maxPoses: 1,
  flipHorizontal: false
};
const BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION = {
  applyExponentialOnBoxSize: false,
  flipVertically: false,
  ignoreClasses: [],
  numClasses: 1,
  numBoxes: 2254,
  numCoords: 12,
  boxCoordOffset: 0,
  keypointCoordOffset: 4,
  numKeypoints: 4,
  numValuesPerKeypoint: 2,
  sigmoidScore: true,
  scoreClippingThresh: 100,
  reverseOutputOrder: true,
  xScale: 224,
  yScale: 224,
  hScale: 224,
  wScale: 224,
  minScoreThresh: 0.5
};
const BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION = {
  minScoreThreshold: -1,
  minSuppressionThreshold: 0.3
};
const BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG = {
  shiftX: 0,
  shiftY: 0,
  scaleX: 1.25,
  scaleY: 1.25,
  squareLong: true
};
const BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG = {
  inputResolution: { width: 224, height: 224 },
  keepAspectRatio: true
};
const BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG = {
  inputResolution: { width: 256, height: 256 },
  keepAspectRatio: true
};
const BLAZEPOSE_POSE_PRESENCE_SCORE = 0.5;
const BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG = {
  numLandmarks: 39,
  inputImageWidth: 256,
  inputImageHeight: 256
};
const BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG = {
  kernelSize: 7,
  minConfidenceToRefine: 0.5
};
const BLAZEPOSE_NUM_KEYPOINTS = 33;
const BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS = 35;
const BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG = {
  alpha: 0.1
};
const BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL = {
  oneEuroFilter: {
    frequency: 30,
    minCutOff: 0.1,
    beta: 40,
    derivateCutOff: 1,
    minAllowedObjectScale: 1e-6
  }
};
const BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY = {
  oneEuroFilter: {
    frequency: 30,
    minCutOff: 0.01,
    beta: 1,
    derivateCutOff: 1,
    minAllowedObjectScale: 1e-6
  }
};
exports.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION = BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION;
exports.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG = BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG;
exports.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION = BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION;
exports.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG = BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG;
exports.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL = BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL;
exports.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY = BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY;
exports.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG = BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG;
exports.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS = BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS;
exports.BLAZEPOSE_NUM_KEYPOINTS = BLAZEPOSE_NUM_KEYPOINTS;
exports.BLAZEPOSE_POSE_PRESENCE_SCORE = BLAZEPOSE_POSE_PRESENCE_SCORE;
exports.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG = BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG;
exports.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION = BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION;
exports.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG = BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG;
exports.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG = BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG;
exports.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG = DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG;
exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL = DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL;
exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY = DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY;
exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE = DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE;
exports.DEFAULT_BLAZEPOSE_MODEL_CONFIG = DEFAULT_BLAZEPOSE_MODEL_CONFIG;
