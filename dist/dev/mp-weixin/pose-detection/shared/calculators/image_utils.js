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
function getImageSize(input) {
  if (input instanceof common_vendor.Tensor) {
    return { height: input.shape[0], width: input.shape[1] };
  } else {
    return { height: input.height, width: input.width };
  }
}
function normalizeRadians(angle) {
  return angle - 2 * Math.PI * Math.floor((angle + Math.PI) / (2 * Math.PI));
}
function transformValueRange(fromMin, fromMax, toMin, toMax) {
  const fromRange = fromMax - fromMin;
  const toRange = toMax - toMin;
  if (fromRange === 0) {
    throw new Error(
      `Original min and max are both ${fromMin}, range cannot be 0.`
    );
  }
  const scale = toRange / fromRange;
  const offset = toMin - fromMin * scale;
  return { scale, offset };
}
function toImageTensor(input) {
  return input instanceof common_vendor.Tensor ? input : common_vendor.fromPixels(input);
}
function padRoi(roi, targetSize, keepAspectRatio = false) {
  if (!keepAspectRatio) {
    return { top: 0, left: 0, right: 0, bottom: 0 };
  }
  const targetH = targetSize.height;
  const targetW = targetSize.width;
  validateSize(targetSize, "targetSize");
  validateSize(roi, "roi");
  const tensorAspectRatio = targetH / targetW;
  const roiAspectRatio = roi.height / roi.width;
  let newWidth;
  let newHeight;
  let horizontalPadding = 0;
  let verticalPadding = 0;
  if (tensorAspectRatio > roiAspectRatio) {
    newWidth = roi.width;
    newHeight = roi.width * tensorAspectRatio;
    verticalPadding = (1 - roiAspectRatio / tensorAspectRatio) / 2;
  } else {
    newWidth = roi.height / tensorAspectRatio;
    newHeight = roi.height;
    horizontalPadding = (1 - tensorAspectRatio / roiAspectRatio) / 2;
  }
  roi.width = newWidth;
  roi.height = newHeight;
  return {
    top: verticalPadding,
    left: horizontalPadding,
    right: horizontalPadding,
    bottom: verticalPadding
  };
}
function getRoi(imageSize, normRect) {
  if (normRect) {
    return {
      xCenter: normRect.xCenter * imageSize.width,
      yCenter: normRect.yCenter * imageSize.height,
      width: normRect.width * imageSize.width,
      height: normRect.height * imageSize.height,
      rotation: normRect.rotation
    };
  } else {
    return {
      xCenter: 0.5 * imageSize.width,
      yCenter: 0.5 * imageSize.height,
      width: imageSize.width,
      height: imageSize.height,
      rotation: 0
    };
  }
}
function getProjectiveTransformMatrix(matrix, imageSize, inputResolution) {
  validateSize(inputResolution, "inputResolution");
  const a0 = 1 / inputResolution.width * matrix[0][0] * imageSize.width;
  const a1 = 1 / inputResolution.height * matrix[0][1] * imageSize.width;
  const a2 = matrix[0][3] * imageSize.width;
  const b0 = 1 / inputResolution.width * matrix[1][0] * imageSize.height;
  const b1 = 1 / inputResolution.height * matrix[1][1] * imageSize.height;
  const b2 = matrix[1][3] * imageSize.height;
  return [a0, a1, a2, b0, b1, b2, 0, 0];
}
function validateSize(size, name) {
  common_vendor.assert(size.width !== 0, () => `${name} width cannot be 0.`);
  common_vendor.assert(size.height !== 0, () => `${name} height cannot be 0.`);
}
exports.getImageSize = getImageSize;
exports.getProjectiveTransformMatrix = getProjectiveTransformMatrix;
exports.getRoi = getRoi;
exports.normalizeRadians = normalizeRadians;
exports.padRoi = padRoi;
exports.toImageTensor = toImageTensor;
exports.transformValueRange = transformValueRange;
