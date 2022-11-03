"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const poseDetection_shared_calculators_constants = require("../calculators/constants.js");
const poseDetection_shared_filters_low_pass_filter = require("./low_pass_filter.js");
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
class OneEuroFilter {
  constructor(config) {
    __publicField(this, "minCutOff");
    __publicField(this, "beta");
    __publicField(this, "derivateCutOff");
    __publicField(this, "x");
    __publicField(this, "dx");
    __publicField(this, "thresholdCutOff");
    __publicField(this, "thresholdBeta");
    __publicField(this, "frequency");
    __publicField(this, "lastTimestamp");
    this.frequency = config.frequency;
    this.minCutOff = config.minCutOff;
    this.beta = config.beta;
    this.thresholdCutOff = config.thresholdCutOff;
    this.thresholdBeta = config.thresholdBeta;
    this.derivateCutOff = config.derivateCutOff;
    this.x = new poseDetection_shared_filters_low_pass_filter.LowPassFilter(this.getAlpha(this.minCutOff));
    this.dx = new poseDetection_shared_filters_low_pass_filter.LowPassFilter(this.getAlpha(this.derivateCutOff));
    this.lastTimestamp = 0;
  }
  apply(value, microSeconds, valueScale) {
    if (value == null) {
      return value;
    }
    const $microSeconds = Math.trunc(microSeconds);
    if (this.lastTimestamp >= $microSeconds) {
      return value;
    }
    if (this.lastTimestamp !== 0 && $microSeconds !== 0) {
      this.frequency = 1 / (($microSeconds - this.lastTimestamp) * poseDetection_shared_calculators_constants.MICRO_SECONDS_TO_SECOND);
    }
    this.lastTimestamp = $microSeconds;
    const dValue = this.x.hasLastRawValue() ? (value - this.x.lastRawValue()) * valueScale * this.frequency : 0;
    const edValue = this.dx.applyWithAlpha(dValue, this.getAlpha(this.derivateCutOff));
    const cutOff = this.minCutOff + this.beta * Math.abs(edValue);
    const threshold = this.thresholdCutOff != null ? this.thresholdCutOff + this.thresholdBeta * Math.abs(edValue) : null;
    return this.x.applyWithAlpha(value, this.getAlpha(cutOff), threshold);
  }
  getAlpha(cutoff) {
    return 1 / (1 + this.frequency / (2 * Math.PI * cutoff));
  }
}
exports.OneEuroFilter = OneEuroFilter;
