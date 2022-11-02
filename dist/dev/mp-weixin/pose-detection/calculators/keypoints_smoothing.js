"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const poseDetection_calculators_keypoints_one_euro_filter = require("./keypoints_one_euro_filter.js");
const poseDetection_calculators_keypoints_to_normalized_keypoints = require("./keypoints_to_normalized_keypoints.js");
const poseDetection_calculators_keypoints_velocity_filter = require("./keypoints_velocity_filter.js");
const poseDetection_calculators_normalized_keypoints_to_keypoints = require("./normalized_keypoints_to_keypoints.js");
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
class KeypointsSmoothingFilter {
  constructor(config) {
    __publicField(this, "keypointsFilter");
    if (config.velocityFilter != null) {
      this.keypointsFilter = new poseDetection_calculators_keypoints_velocity_filter.KeypointsVelocityFilter(config.velocityFilter);
    } else if (config.oneEuroFilter != null) {
      this.keypointsFilter = new poseDetection_calculators_keypoints_one_euro_filter.KeypointsOneEuroFilter(config.oneEuroFilter);
    } else {
      throw new Error(
        `Either configure velocityFilter or oneEuroFilter, but got ${config}.`
      );
    }
  }
  apply(keypoints, timestamp, imageSize, normalized = false) {
    if (keypoints == null) {
      this.keypointsFilter.reset();
      return null;
    }
    const scaledKeypoints = normalized ? poseDetection_calculators_normalized_keypoints_to_keypoints.normalizedKeypointsToKeypoints(keypoints, imageSize) : keypoints;
    const scaledKeypointsFiltered = this.keypointsFilter.apply(scaledKeypoints, timestamp);
    return normalized ? poseDetection_calculators_keypoints_to_normalized_keypoints.keypointsToNormalizedKeypoints(scaledKeypointsFiltered, imageSize) : scaledKeypointsFiltered;
  }
}
exports.KeypointsSmoothingFilter = KeypointsSmoothingFilter;
