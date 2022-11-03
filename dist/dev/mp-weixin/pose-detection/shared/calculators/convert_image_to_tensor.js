"use strict";
const common_vendor = require("../../../common/vendor.js");
const poseDetection_shared_calculators_get_rotated_sub_rect_to_rect_transformation_matrix = require("./get_rotated_sub_rect_to_rect_transformation_matrix.js");
const poseDetection_shared_calculators_image_utils = require("./image_utils.js");
const poseDetection_shared_calculators_shift_image_value = require("./shift_image_value.js");
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
  const {
    outputTensorSize,
    keepAspectRatio,
    borderMode,
    outputTensorFloatRange
  } = config;
  const imageSize = poseDetection_shared_calculators_image_utils.getImageSize(image);
  const roi = poseDetection_shared_calculators_image_utils.getRoi(imageSize, normRect);
  const padding = poseDetection_shared_calculators_image_utils.padRoi(roi, outputTensorSize, keepAspectRatio);
  const transformationMatrix = poseDetection_shared_calculators_get_rotated_sub_rect_to_rect_transformation_matrix.getRotatedSubRectToRectTransformMatrix(
    roi,
    imageSize.width,
    imageSize.height,
    false
  );
  const imageTensor = common_vendor.tidy(() => {
    const $image = poseDetection_shared_calculators_image_utils.toImageTensor(image);
    const transformMatrix = common_vendor.tensor2d(
      poseDetection_shared_calculators_image_utils.getProjectiveTransformMatrix(
        transformationMatrix,
        imageSize,
        outputTensorSize
      ),
      [1, 8]
    );
    const fillMode = borderMode === "zero" ? "constant" : "nearest";
    const imageTransformed = common_vendor.image.transform(
      common_vendor.expandDims(common_vendor.cast($image, "float32")),
      transformMatrix,
      "bilinear",
      fillMode,
      0,
      [outputTensorSize.height, outputTensorSize.width]
    );
    const imageShifted = outputTensorFloatRange != null ? poseDetection_shared_calculators_shift_image_value.shiftImageValue(imageTransformed, outputTensorFloatRange) : imageTransformed;
    return imageShifted;
  });
  return { imageTensor, padding, transformationMatrix };
}
exports.convertImageToTensor = convertImageToTensor;
