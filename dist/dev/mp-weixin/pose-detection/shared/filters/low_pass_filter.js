"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
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
class LowPassFilter {
  constructor(alpha) {
    __publicField(this, "initialized", false);
    __publicField(this, "rawValue");
    __publicField(this, "storedValue");
    this.alpha = alpha;
  }
  apply(value, threshold) {
    let result;
    if (this.initialized) {
      if (threshold == null) {
        result = this.storedValue + this.alpha * (value - this.storedValue);
      } else {
        result = this.storedValue + this.alpha * threshold * Math.asinh((value - this.storedValue) / threshold);
      }
    } else {
      result = value;
      this.initialized = true;
    }
    this.rawValue = value;
    this.storedValue = result;
    return result;
  }
  applyWithAlpha(value, alpha, threshold) {
    this.alpha = alpha;
    return this.apply(value, threshold);
  }
  hasLastRawValue() {
    return this.initialized;
  }
  lastRawValue() {
    return this.rawValue;
  }
  reset() {
    this.initialized = false;
  }
}
exports.LowPassFilter = LowPassFilter;
