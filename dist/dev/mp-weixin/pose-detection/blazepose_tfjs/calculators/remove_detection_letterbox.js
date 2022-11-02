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
function removeDetectionLetterbox(detections = [], letterboxPadding) {
  const left = letterboxPadding.left;
  const top = letterboxPadding.top;
  const leftAndRight = letterboxPadding.left + letterboxPadding.right;
  const topAndBottom = letterboxPadding.top + letterboxPadding.bottom;
  for (let i = 0; i < detections.length; i++) {
    const detection = detections[i];
    const relativeBoundingBox = detection.locationData.relativeBoundingBox;
    const xMin = (relativeBoundingBox.xMin - left) / (1 - leftAndRight);
    const yMin = (relativeBoundingBox.yMin - top) / (1 - topAndBottom);
    const width = relativeBoundingBox.width / (1 - leftAndRight);
    const height = relativeBoundingBox.height / (1 - topAndBottom);
    relativeBoundingBox.xMin = xMin;
    relativeBoundingBox.yMin = yMin;
    relativeBoundingBox.width = width;
    relativeBoundingBox.height = height;
    for (let i2 = 0; i2 < detection.locationData.relativeKeypoints.length; ++i2) {
      const keypoint = detection.locationData.relativeKeypoints[i2];
      const newX = (keypoint.x - left) / (1 - leftAndRight);
      const newY = (keypoint.y - top) / (1 - topAndBottom);
      keypoint.x = newX;
      keypoint.y = newY;
    }
  }
  return detections;
}
exports.removeDetectionLetterbox = removeDetectionLetterbox;
