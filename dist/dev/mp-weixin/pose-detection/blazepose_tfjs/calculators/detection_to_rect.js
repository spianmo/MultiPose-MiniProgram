"use strict";
const poseDetection_calculators_image_utils = require("../../calculators/image_utils.js");
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
function computeRotation(detection, imageSize, config) {
  const locationData = detection.locationData;
  const startKeypoint = config.rotationVectorStartKeypointIndex;
  const endKeypoint = config.rotationVectorEndKeypointIndex;
  let targetAngle;
  if (config.rotationVectorTargetAngle) {
    targetAngle = config.rotationVectorTargetAngle;
  } else {
    targetAngle = Math.PI * config.rotationVectorTargetAngleDegree / 180;
  }
  const x0 = locationData.relativeKeypoints[startKeypoint].x * imageSize.width;
  const y0 = locationData.relativeKeypoints[startKeypoint].y * imageSize.height;
  const x1 = locationData.relativeKeypoints[endKeypoint].x * imageSize.width;
  const y1 = locationData.relativeKeypoints[endKeypoint].y * imageSize.height;
  const rotation = poseDetection_calculators_image_utils.normalizeRadians(targetAngle - Math.atan2(-(y1 - y0), x1 - x0));
  return rotation;
}
exports.computeRotation = computeRotation;
