"use strict";
const poseDetection_calculators_types = require("../calculators/types.js");
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
  if (config.modelType == null) {
    config.modelType = "SinglePose.Lightning";
  } else if (poseDetection_movenet_constants.VALID_MODELS.indexOf(config.modelType) < 0) {
    throw new Error(
      `Invalid architecture ${config.modelType}. Should be one of ${poseDetection_movenet_constants.VALID_MODELS}`
    );
  }
  if (config.enableSmoothing == null) {
    config.enableSmoothing = true;
  }
  if (config.minPoseScore != null && (config.minPoseScore < 0 || config.minPoseScore > 1)) {
    throw new Error(`minPoseScore should be between 0.0 and 1.0`);
  }
  if (config.multiPoseMaxDimension != null && (config.multiPoseMaxDimension % 32 !== 0 || config.multiPoseMaxDimension < 32)) {
    throw new Error(
      `multiPoseMaxDimension must be a multiple of 32 and higher than 0`
    );
  }
  if (config.modelType === poseDetection_movenet_constants.MULTIPOSE_LIGHTNING && config.enableTracking == null) {
    config.enableTracking = true;
  }
  if (config.modelType === poseDetection_movenet_constants.MULTIPOSE_LIGHTNING && config.enableTracking === true) {
    if (config.trackerType == null) {
      config.trackerType = poseDetection_calculators_types.TrackerType.BoundingBox;
    }
    if (config.trackerType === poseDetection_calculators_types.TrackerType.Keypoint) {
      if (config.trackerConfig != null) {
        config.trackerConfig = mergeKeypointTrackerConfig(config.trackerConfig);
      } else {
        config.trackerConfig = poseDetection_movenet_constants.DEFAULT_KEYPOINT_TRACKER_CONFIG;
      }
    } else if (config.trackerType === poseDetection_calculators_types.TrackerType.BoundingBox) {
      if (config.trackerConfig != null) {
        config.trackerConfig = mergeBoundingBoxTrackerConfig(config.trackerConfig);
      } else {
        config.trackerConfig = poseDetection_movenet_constants.DEFAULT_BOUNDING_BOX_TRACKER_CONFIG;
      }
    } else {
      throw new Error("Tracker type not supported by MoveNet");
    }
  }
  return config;
}
function validateEstimationConfig(estimationConfig) {
  const config = estimationConfig == null ? poseDetection_movenet_constants.MOVENET_ESTIMATION_CONFIG : { ...estimationConfig };
  return config;
}
function mergeBaseTrackerConfig(defaultConfig, userConfig) {
  const mergedConfig = {
    maxTracks: defaultConfig.maxTracks,
    maxAge: defaultConfig.maxAge,
    minSimilarity: defaultConfig.minSimilarity
  };
  if (userConfig.maxTracks != null) {
    mergedConfig.maxTracks = userConfig.maxTracks;
  }
  if (userConfig.maxAge != null) {
    mergedConfig.maxAge = userConfig.maxAge;
  }
  if (userConfig.minSimilarity != null) {
    mergedConfig.minSimilarity = userConfig.minSimilarity;
  }
  return mergedConfig;
}
function mergeKeypointTrackerConfig(userConfig) {
  const mergedConfig = mergeBaseTrackerConfig(poseDetection_movenet_constants.DEFAULT_KEYPOINT_TRACKER_CONFIG, userConfig);
  mergedConfig.keypointTrackerParams = {
    ...poseDetection_movenet_constants.DEFAULT_KEYPOINT_TRACKER_CONFIG.keypointTrackerParams
  };
  if (userConfig.keypointTrackerParams != null) {
    if (userConfig.keypointTrackerParams.keypointConfidenceThreshold != null) {
      mergedConfig.keypointTrackerParams.keypointConfidenceThreshold = userConfig.keypointTrackerParams.keypointConfidenceThreshold;
    }
    if (userConfig.keypointTrackerParams.keypointFalloff != null) {
      mergedConfig.keypointTrackerParams.keypointFalloff = userConfig.keypointTrackerParams.keypointFalloff;
    }
    if (userConfig.keypointTrackerParams.minNumberOfKeypoints != null) {
      mergedConfig.keypointTrackerParams.minNumberOfKeypoints = userConfig.keypointTrackerParams.minNumberOfKeypoints;
    }
  }
  return mergedConfig;
}
function mergeBoundingBoxTrackerConfig(userConfig) {
  const mergedConfig = mergeBaseTrackerConfig(poseDetection_movenet_constants.DEFAULT_BOUNDING_BOX_TRACKER_CONFIG, userConfig);
  return mergedConfig;
}
exports.validateEstimationConfig = validateEstimationConfig;
exports.validateModelConfig = validateModelConfig;
