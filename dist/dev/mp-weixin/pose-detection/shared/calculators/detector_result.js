"use strict";
const common_vendor = require("../../../common/vendor.js");
const poseDetection_shared_calculators_split_detection_result = require("./split_detection_result.js");
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
function detectorResult(detectionResult) {
  return common_vendor.tidy(() => {
    const [logits, rawBoxes] = poseDetection_shared_calculators_split_detection_result.splitDetectionResult(detectionResult);
    const rawBoxes2d = common_vendor.squeeze(rawBoxes);
    const logits1d = common_vendor.squeeze(logits);
    return { boxes: rawBoxes2d, logits: logits1d };
  });
}
exports.detectorResult = detectorResult;
