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
function landmarksToDetection(landmarks) {
  const detection = { locationData: { relativeKeypoints: [] } };
  let xMin = Number.MAX_SAFE_INTEGER;
  let xMax = Number.MIN_SAFE_INTEGER;
  let yMin = Number.MAX_SAFE_INTEGER;
  let yMax = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < landmarks.length; ++i) {
    const landmark = landmarks[i];
    xMin = Math.min(xMin, landmark.x);
    xMax = Math.max(xMax, landmark.x);
    yMin = Math.min(yMin, landmark.y);
    yMax = Math.max(yMax, landmark.y);
    detection.locationData.relativeKeypoints.push(
      { x: landmark.x, y: landmark.y }
    );
  }
  detection.locationData.relativeBoundingBox = { xMin, yMin, xMax, yMax, width: xMax - xMin, height: yMax - yMin };
  return detection;
}
exports.landmarksToDetection = landmarksToDetection;
