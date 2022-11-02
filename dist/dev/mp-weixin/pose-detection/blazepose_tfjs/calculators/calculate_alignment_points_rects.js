"use strict";
const poseDetection_blazepose_tfjs_calculators_detection_to_rect = require("./detection_to_rect.js");
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
function calculateAlignmentPointsRects(detection, imageSize, config) {
  const startKeypoint = config.rotationVectorStartKeypointIndex;
  const endKeypoint = config.rotationVectorEndKeypointIndex;
  const locationData = detection.locationData;
  const xCenter = locationData.relativeKeypoints[startKeypoint].x * imageSize.width;
  const yCenter = locationData.relativeKeypoints[startKeypoint].y * imageSize.height;
  const xScale = locationData.relativeKeypoints[endKeypoint].x * imageSize.width;
  const yScale = locationData.relativeKeypoints[endKeypoint].y * imageSize.height;
  const boxSize = Math.sqrt(
    (xScale - xCenter) * (xScale - xCenter) + (yScale - yCenter) * (yScale - yCenter)
  ) * 2;
  const rotation = poseDetection_blazepose_tfjs_calculators_detection_to_rect.computeRotation(detection, imageSize, config);
  return {
    xCenter: xCenter / imageSize.width,
    yCenter: yCenter / imageSize.height,
    width: boxSize / imageSize.width,
    height: boxSize / imageSize.height,
    rotation
  };
}
exports.calculateAlignmentPointsRects = calculateAlignmentPointsRects;
