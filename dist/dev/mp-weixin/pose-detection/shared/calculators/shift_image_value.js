"use strict";
const common_vendor = require("../../../common/vendor.js");
const poseDetection_shared_calculators_image_utils = require("./image_utils.js");
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
function shiftImageValue(image, outputFloatRange) {
  const valueRange = poseDetection_shared_calculators_image_utils.transformValueRange(
    0,
    255,
    outputFloatRange[0],
    outputFloatRange[1]
  );
  return common_vendor.tidy(
    () => common_vendor.add(common_vendor.mul(image, valueRange.scale), valueRange.offset)
  );
}
exports.shiftImageValue = shiftImageValue;
