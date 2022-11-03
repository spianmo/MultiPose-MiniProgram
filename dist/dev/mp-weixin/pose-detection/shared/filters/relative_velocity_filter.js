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
class RelativeVelocityFilter {
  constructor(config) {
    __publicField(this, "window", []);
    __publicField(this, "lowPassFilter", new poseDetection_shared_filters_low_pass_filter.LowPassFilter(1));
    __publicField(this, "lastValue", 0);
    __publicField(this, "lastValueScale", 1);
    __publicField(this, "lastTimestamp", -1);
    this.config = config;
  }
  apply(value, microSeconds, valueScale) {
    if (value == null) {
      return value;
    }
    const $microSeconds = Math.trunc(microSeconds);
    if (this.lastTimestamp >= $microSeconds) {
      return value;
    }
    let alpha;
    if (this.lastTimestamp === -1) {
      alpha = 1;
    } else {
      const distance = value * valueScale - this.lastValue * this.lastValueScale;
      const duration = $microSeconds - this.lastTimestamp;
      let cumulativeDistance = distance;
      let cumulativeDuration = duration;
      const assumedMaxDuration = poseDetection_shared_calculators_constants.SECOND_TO_MICRO_SECONDS / 30;
      const maxCumulativeDuration = (1 + this.window.length) * assumedMaxDuration;
      for (const el of this.window) {
        if (cumulativeDuration + el.duration > maxCumulativeDuration) {
          break;
        }
        cumulativeDistance += el.distance;
        cumulativeDuration += el.duration;
      }
      const velocity = cumulativeDistance / (cumulativeDuration * poseDetection_shared_calculators_constants.MICRO_SECONDS_TO_SECOND);
      alpha = 1 - 1 / (1 + this.config.velocityScale * Math.abs(velocity));
      this.window.unshift({ distance, duration });
      if (this.window.length > this.config.windowSize) {
        this.window.pop();
      }
    }
    this.lastValue = value;
    this.lastValueScale = valueScale;
    this.lastTimestamp = $microSeconds;
    return this.lowPassFilter.applyWithAlpha(value, alpha);
  }
}
exports.RelativeVelocityFilter = RelativeVelocityFilter;
