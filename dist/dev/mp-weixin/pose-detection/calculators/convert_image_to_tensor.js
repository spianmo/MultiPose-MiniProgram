"use strict";
const common_vendor = require("../../common/vendor.js");
const poseDetection_calculators_image_utils = require("./image_utils.js");
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
function convertImageToTensor(image, config, normRect) {
  const { inputResolution, keepAspectRatio } = config;
  const imageSize = poseDetection_calculators_image_utils.getImageSize(image);
  const roi = poseDetection_calculators_image_utils.getRoi(imageSize, normRect);
  const padding = poseDetection_calculators_image_utils.padRoi(roi, inputResolution, keepAspectRatio);
  const imageTensor = common_vendor.tidy(() => {
    const $image = poseDetection_calculators_image_utils.toImageTensor(image);
    const transformMatrix = common_vendor.tensor2d(
      poseDetection_calculators_image_utils.getProjectiveTransformMatrix(roi, imageSize, false, inputResolution),
      [1, 8]
    );
    const imageTransformed = common_vendor.image.transform(
      common_vendor.expandDims(common_vendor.cast($image, "float32")),
      transformMatrix,
      "bilinear",
      "nearest",
      0,
      [inputResolution.height, inputResolution.width]
    );
    return imageTransformed;
  });
  return { imageTensor, padding };
}
exports.convertImageToTensor = convertImageToTensor;
