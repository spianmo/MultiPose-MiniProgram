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
function refineLandmarksFromHeatmap(landmarks, heatmapTensor, config) {
  const $heatmapTensor = common_vendor.squeeze(heatmapTensor, [0]);
  const [hmHeight, hmWidth, hmChannels] = $heatmapTensor.shape;
  if (landmarks.length !== hmChannels) {
    throw new Error(
      "Expected heatmap to have same number of channels as the number of landmarks."
    );
  }
  const outLandmarks = [];
  const heatmapBuf = $heatmapTensor.bufferSync();
  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
    const outLandmark = { ...landmark };
    outLandmarks.push(outLandmark);
    const centerCol = Math.trunc(outLandmark.x * hmWidth);
    const centerRow = Math.trunc(outLandmark.y * hmHeight);
    if (centerCol < 0 || centerCol >= hmWidth || centerRow < 0 || centerCol >= hmHeight) {
      continue;
    }
    const offset = Math.trunc((config.kernelSize - 1) / 2);
    const beginCol = Math.max(0, centerCol - offset);
    const endCol = Math.min(hmWidth, centerCol + offset + 1);
    const beginRow = Math.max(0, centerRow - offset);
    const endRow = Math.min(hmHeight, centerRow + offset + 1);
    let sum = 0;
    let weightedCol = 0;
    let weightedRow = 0;
    let maxValue = 0;
    for (let row = beginRow; row < endRow; ++row) {
      for (let col = beginCol; col < endCol; ++col) {
        const confidence = heatmapBuf.get(row, col, i);
        sum += confidence;
        maxValue = Math.max(maxValue, confidence);
        weightedCol += col * confidence;
        weightedRow += row * confidence;
      }
    }
    if (maxValue >= config.minConfidenceToRefine && sum > 0) {
      outLandmark.x = weightedCol / hmWidth / sum;
      outLandmark.y = weightedRow / hmHeight / sum;
    }
  }
  $heatmapTensor.dispose();
  return outLandmarks;
}
exports.refineLandmarksFromHeatmap = refineLandmarksFromHeatmap;
