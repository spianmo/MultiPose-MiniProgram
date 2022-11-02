"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const poseDetection_calculators_low_pass_filter = require("../../calculators/low_pass_filter.js");
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
class LowPassVisibilityFilter {
  constructor(config) {
    __publicField(this, "alpha");
    __publicField(this, "visibilityFilters");
    this.alpha = config.alpha;
  }
  apply(landmarks) {
    if (landmarks == null) {
      this.visibilityFilters = null;
      return null;
    }
    if (this.visibilityFilters == null || this.visibilityFilters.length !== landmarks.length) {
      this.visibilityFilters = landmarks.map((_) => new poseDetection_calculators_low_pass_filter.LowPassFilter(this.alpha));
    }
    const outLandmarks = [];
    for (let i = 0; i < landmarks.length; ++i) {
      const landmark = landmarks[i];
      const outLandmark = { ...landmark };
      outLandmark.score = this.visibilityFilters[i].apply(landmark.score);
      outLandmarks.push(outLandmark);
    }
    return outLandmarks;
  }
}
exports.LowPassVisibilityFilter = LowPassVisibilityFilter;
