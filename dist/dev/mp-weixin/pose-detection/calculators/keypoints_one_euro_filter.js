"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const poseDetection_calculators_one_euro_filter = require("./one_euro_filter.js");
const poseDetection_calculators_velocity_filter_utils = require("./velocity_filter_utils.js");
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
class KeypointsOneEuroFilter {
  constructor(config) {
    __publicField(this, "xFilters");
    __publicField(this, "yFilters");
    __publicField(this, "zFilters");
    this.config = config;
  }
  apply(keypoints, microSeconds) {
    if (keypoints == null) {
      this.reset();
      return null;
    }
    this.initializeFiltersIfEmpty(keypoints);
    let valueScale = 1;
    if (this.config.minAllowedObjectScale != null) {
      const objectScale = poseDetection_calculators_velocity_filter_utils.getObjectScale(keypoints);
      if (objectScale < this.config.minAllowedObjectScale) {
        return [...keypoints];
      }
      valueScale = 1 / objectScale;
    }
    return keypoints.map((keypoint, i) => {
      const outKeypoint = {
        ...keypoint,
        x: this.xFilters[i].apply(keypoint.x, microSeconds, valueScale),
        y: this.yFilters[i].apply(keypoint.y, microSeconds, valueScale)
      };
      if (keypoint.z != null) {
        outKeypoint.z = this.zFilters[i].apply(keypoint.z, microSeconds, valueScale);
      }
      return outKeypoint;
    });
  }
  reset() {
    this.xFilters = null;
    this.yFilters = null;
    this.zFilters = null;
  }
  initializeFiltersIfEmpty(keypoints) {
    if (this.xFilters == null || this.xFilters.length !== keypoints.length) {
      this.xFilters = keypoints.map((_) => new poseDetection_calculators_one_euro_filter.OneEuroFilter(this.config));
      this.yFilters = keypoints.map((_) => new poseDetection_calculators_one_euro_filter.OneEuroFilter(this.config));
      this.zFilters = keypoints.map((_) => new poseDetection_calculators_one_euro_filter.OneEuroFilter(this.config));
    }
  }
}
exports.KeypointsOneEuroFilter = KeypointsOneEuroFilter;
