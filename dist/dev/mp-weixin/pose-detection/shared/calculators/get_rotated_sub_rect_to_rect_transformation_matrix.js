"use strict";
const poseDetection_shared_calculators_calculate_inverse_matrix = require("./calculate_inverse_matrix.js");
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
function getRotatedSubRectToRectTransformMatrix(subRect, rectWidth, rectHeight, flipHorizontally) {
  const a = subRect.width;
  const b = subRect.height;
  const flip = flipHorizontally ? -1 : 1;
  const c = Math.cos(subRect.rotation);
  const d = Math.sin(subRect.rotation);
  const e = subRect.xCenter;
  const f = subRect.yCenter;
  const g = 1 / rectWidth;
  const h = 1 / rectHeight;
  const matrix = new Array(16);
  matrix[0] = a * c * flip * g;
  matrix[1] = -b * d * g;
  matrix[2] = 0;
  matrix[3] = (-0.5 * a * c * flip + 0.5 * b * d + e) * g;
  matrix[4] = a * d * flip * h;
  matrix[5] = b * c * h;
  matrix[6] = 0;
  matrix[7] = (-0.5 * b * c - 0.5 * a * d * flip + f) * h;
  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = a * g;
  matrix[11] = 0;
  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = 0;
  matrix[15] = 1;
  return poseDetection_shared_calculators_calculate_inverse_matrix.arrayToMatrix4x4(matrix);
}
exports.getRotatedSubRectToRectTransformMatrix = getRotatedSubRectToRectTransformMatrix;
