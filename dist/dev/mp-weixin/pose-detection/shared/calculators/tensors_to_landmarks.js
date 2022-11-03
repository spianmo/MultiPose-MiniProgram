"use strict";
const poseDetection_shared_calculators_sigmoid = require("./sigmoid.js");
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
function applyActivation(activation, value) {
  return activation === "none" ? value : poseDetection_shared_calculators_sigmoid.sigmoid(value);
}
async function tensorsToLandmarks(landmarkTensor, config, flipHorizontally, flipVertically) {
  flipHorizontally = flipHorizontally || config.flipHorizontally || false;
  flipVertically = flipVertically || config.flipVertically || false;
  const numValues = landmarkTensor.size;
  const numDimensions = numValues / config.numLandmarks;
  const rawLandmarks = await landmarkTensor.data();
  const outputLandmarks = [];
  for (let ld = 0; ld < config.numLandmarks; ++ld) {
    const offset = ld * numDimensions;
    const landmark = { x: 0, y: 0 };
    if (flipHorizontally) {
      landmark.x = config.inputImageWidth - rawLandmarks[offset];
    } else {
      landmark.x = rawLandmarks[offset];
    }
    if (numDimensions > 1) {
      if (flipVertically) {
        landmark.y = config.inputImageHeight - rawLandmarks[offset + 1];
      } else {
        landmark.y = rawLandmarks[offset + 1];
      }
    }
    if (numDimensions > 2) {
      landmark.z = rawLandmarks[offset + 2];
    }
    if (numDimensions > 3) {
      landmark.score = applyActivation(
        config.visibilityActivation,
        rawLandmarks[offset + 3]
      );
    }
    outputLandmarks.push(landmark);
  }
  for (let i = 0; i < outputLandmarks.length; ++i) {
    const landmark = outputLandmarks[i];
    landmark.x = landmark.x / config.inputImageWidth;
    landmark.y = landmark.y / config.inputImageHeight;
    landmark.z = landmark.z / config.inputImageWidth / (config.normalizeZ || 1);
  }
  return outputLandmarks;
}
exports.tensorsToLandmarks = tensorsToLandmarks;
