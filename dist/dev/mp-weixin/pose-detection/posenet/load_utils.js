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
const MOBILENET_BASE_URL = "https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/";
const RESNET50_BASE_URL = "https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";
function resNet50Checkpoint(stride, quantBytes) {
  const graphJson = `model-stride${stride}.json`;
  if (quantBytes === 4) {
    return RESNET50_BASE_URL + `float/` + graphJson;
  } else {
    return RESNET50_BASE_URL + `quant${quantBytes}/` + graphJson;
  }
}
function mobileNetCheckpoint(stride, multiplier, quantBytes) {
  const toStr = { 1: "100", 0.75: "075", 0.5: "050" };
  const graphJson = `model-stride${stride}.json`;
  if (quantBytes === 4) {
    return MOBILENET_BASE_URL + `float/${toStr[multiplier]}/` + graphJson;
  } else {
    return MOBILENET_BASE_URL + `quant${quantBytes}/${toStr[multiplier]}/` + graphJson;
  }
}
function getValidInputResolutionDimensions(inputResolution, outputStride) {
  return {
    height: toValidInputResolution(inputResolution.height, outputStride),
    width: toValidInputResolution(inputResolution.width, outputStride)
  };
}
function toValidInputResolution(inputResolution, outputStride) {
  if (isValidInputResolution(inputResolution, outputStride)) {
    return inputResolution;
  }
  return Math.floor(inputResolution / outputStride) * outputStride + 1;
}
function isValidInputResolution(resolution, outputStride) {
  return (resolution - 1) % outputStride === 0;
}
exports.getValidInputResolutionDimensions = getValidInputResolutionDimensions;
exports.mobileNetCheckpoint = mobileNetCheckpoint;
exports.resNet50Checkpoint = resNet50Checkpoint;
