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
const MULTIPOSE_LIGHTNING = "MultiPose.Lightning";
const VALID_MODELS = [SINGLEPOSE_LIGHTNING, SINGLEPOSE_THUNDER, MULTIPOSE_LIGHTNING];
const MOVENET_SINGLEPOSE_LIGHTNING_URL = "http://oss.cache.ren/img/movenet/singlepose/lightning/4";
const MOVENET_SINGLEPOSE_THUNDER_URL = "http://oss.cache.ren/img/movenet/singlepose/thunder/4";
const MOVENET_MULTIPOSE_LIGHTNING_URL = "http://oss.cache.ren/img/movenet/multipose/lightning/1";
const MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION = 192;
const MOVENET_SINGLEPOSE_THUNDER_RESOLUTION = 256;
const MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION = 256;
const MOVENET_CONFIG = {
  modelType: SINGLEPOSE_LIGHTNING,
  enableSmoothing: true
};
const MOVENET_ESTIMATION_CONFIG = {};
const KEYPOINT_FILTER_CONFIG = {
  frequency: 30,
  minCutOff: 2.5,
  beta: 300,
  derivateCutOff: 2.5,
  thresholdCutOff: 0.5,
  thresholdBeta: 5,
  disableValueScaling: true
};
const CROP_FILTER_ALPHA = 0.9;
const MIN_CROP_KEYPOINT_SCORE = 0.2;
const DEFAULT_MIN_POSE_SCORE = 0.25;
const NUM_KEYPOINTS = 17;
const NUM_KEYPOINT_VALUES = 3;
const MULTIPOSE_BOX_SIZE = 5;
const MULTIPOSE_BOX_IDX = NUM_KEYPOINTS * NUM_KEYPOINT_VALUES;
const MULTIPOSE_BOX_SCORE_IDX = MULTIPOSE_BOX_IDX + 4;
const MULTIPOSE_INSTANCE_SIZE = NUM_KEYPOINTS * NUM_KEYPOINT_VALUES + MULTIPOSE_BOX_SIZE;
const DEFAULT_KEYPOINT_TRACKER_CONFIG = {
  maxTracks: 18,
  maxAge: 1e3,
  minSimilarity: 0.2,
  keypointTrackerParams: {
    keypointConfidenceThreshold: 0.3,
    keypointFalloff: [
      0.026,
      0.025,
      0.025,
      0.035,
      0.035,
      0.079,
      0.079,
      0.072,
      0.072,
      0.062,
      0.062,
      0.107,
      0.107,
      0.087,
      0.087,
      0.089,
      0.089
    ],
    minNumberOfKeypoints: 4
  }
};
const DEFAULT_BOUNDING_BOX_TRACKER_CONFIG = {
  maxTracks: 18,
  maxAge: 1e3,
  minSimilarity: 0.15,
  trackerParams: {}
};
exports.CROP_FILTER_ALPHA = CROP_FILTER_ALPHA;
exports.DEFAULT_BOUNDING_BOX_TRACKER_CONFIG = DEFAULT_BOUNDING_BOX_TRACKER_CONFIG;
exports.DEFAULT_KEYPOINT_TRACKER_CONFIG = DEFAULT_KEYPOINT_TRACKER_CONFIG;
exports.DEFAULT_MIN_POSE_SCORE = DEFAULT_MIN_POSE_SCORE;
exports.KEYPOINT_FILTER_CONFIG = KEYPOINT_FILTER_CONFIG;
exports.MIN_CROP_KEYPOINT_SCORE = MIN_CROP_KEYPOINT_SCORE;
exports.MOVENET_CONFIG = MOVENET_CONFIG;
exports.MOVENET_ESTIMATION_CONFIG = MOVENET_ESTIMATION_CONFIG;
exports.MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION = MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION;
exports.MOVENET_MULTIPOSE_LIGHTNING_URL = MOVENET_MULTIPOSE_LIGHTNING_URL;
exports.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION = MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
exports.MOVENET_SINGLEPOSE_LIGHTNING_URL = MOVENET_SINGLEPOSE_LIGHTNING_URL;
exports.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION = MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
exports.MOVENET_SINGLEPOSE_THUNDER_URL = MOVENET_SINGLEPOSE_THUNDER_URL;
exports.MULTIPOSE_BOX_IDX = MULTIPOSE_BOX_IDX;
exports.MULTIPOSE_BOX_SCORE_IDX = MULTIPOSE_BOX_SCORE_IDX;
exports.MULTIPOSE_INSTANCE_SIZE = MULTIPOSE_INSTANCE_SIZE;
exports.MULTIPOSE_LIGHTNING = MULTIPOSE_LIGHTNING;
exports.NUM_KEYPOINTS = NUM_KEYPOINTS;
exports.NUM_KEYPOINT_VALUES = NUM_KEYPOINT_VALUES;
exports.SINGLEPOSE_LIGHTNING = SINGLEPOSE_LIGHTNING;
exports.SINGLEPOSE_THUNDER = SINGLEPOSE_THUNDER;
exports.VALID_MODELS = VALID_MODELS;
