"use strict";
const common_vendor = require("../../../common/vendor.js");
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
async function nonMaxSuppression(detections, maxDetections, iouThreshold, overlapType) {
  detections.sort(
    (detectionA, detectionB) => Math.max(...detectionB.score) - Math.max(...detectionA.score)
  );
  const detectionsTensor = common_vendor.tensor2d(detections.map(
    (d) => [
      d.locationData.relativeBoundingBox.yMin,
      d.locationData.relativeBoundingBox.xMin,
      d.locationData.relativeBoundingBox.yMax,
      d.locationData.relativeBoundingBox.xMax
    ]
  ));
  const scoresTensor = common_vendor.tensor1d(detections.map((d) => d.score[0]));
  const selectedIdsTensor = await common_vendor.image.nonMaxSuppressionAsync(
    detectionsTensor,
    scoresTensor,
    maxDetections,
    iouThreshold
  );
  const selectedIds = await selectedIdsTensor.array();
  const selectedDetections = detections.filter((_, i) => selectedIds.indexOf(i) > -1);
  common_vendor.dispose([detectionsTensor, scoresTensor, selectedIdsTensor]);
  return selectedDetections;
}
exports.nonMaxSuppression = nonMaxSuppression;
