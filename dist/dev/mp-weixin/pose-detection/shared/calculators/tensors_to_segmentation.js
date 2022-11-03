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
function tensorsToSegmentation(segmentationTensor, config, outputSize) {
  return common_vendor.tidy(() => {
    const $segmentationTensor = common_vendor.squeeze(segmentationTensor, [0]);
    const tensorChannels = $segmentationTensor.shape[2];
    if (tensorChannels === 1) {
      let smallMaskMat = $segmentationTensor;
      switch (config.activation) {
        case "none":
          break;
        case "sigmoid":
          smallMaskMat = common_vendor.sigmoid(smallMaskMat);
          break;
        case "softmax":
          throw new Error("Softmax activation requires two channels.");
        default:
          throw new Error(`Activation not supported (${config.activation})`);
      }
      const outputMat = outputSize ? common_vendor.image.resizeBilinear(
        smallMaskMat,
        [outputSize.height, outputSize.width]
      ) : smallMaskMat;
      return common_vendor.squeeze(outputMat, [2]);
    } else {
      throw new Error(
        `Unsupported number of tensor channels ${tensorChannels}`
      );
    }
  });
}
exports.tensorsToSegmentation = tensorsToSegmentation;
