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
function toNumber(value) {
  return value instanceof SVGAnimatedLength ? value.baseVal.value : value;
}
async function toHTMLCanvasElementLossy(image) {
  const canvas = document.createElement("canvas");
  if (image instanceof common_vendor.Tensor) {
    await common_vendor.toPixels(image, canvas);
  } else {
    canvas.width = toNumber(image.width);
    canvas.height = toNumber(image.height);
    const ctx = canvas.getContext("2d");
    if (image instanceof ImageData) {
      ctx.putImageData(image, 0, 0);
    } else {
      ctx.drawImage(image, 0, 0);
    }
  }
  return canvas;
}
async function toImageDataLossy(image) {
  if (image instanceof common_vendor.Tensor) {
    const [height, width] = image.shape.slice(0, 2);
    return new ImageData(await common_vendor.toPixels(image), width, height);
  } else {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = toNumber(image.width);
    canvas.height = toNumber(image.height);
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}
async function toTensorLossy(image) {
  const pixelsInput = image instanceof SVGImageElement || image instanceof OffscreenCanvas ? await toHTMLCanvasElementLossy(image) : image;
  return common_vendor.fromPixels(pixelsInput, 4);
}
function assertMaskValue(maskValue) {
  if (maskValue < 0 || maskValue >= 256) {
    throw new Error(
      `Mask value must be in range [0, 255] but got ${maskValue}`
    );
  }
  if (!Number.isInteger(maskValue)) {
    throw new Error(`Mask value must be an integer but got ${maskValue}`);
  }
}
exports.assertMaskValue = assertMaskValue;
exports.toHTMLCanvasElementLossy = toHTMLCanvasElementLossy;
exports.toImageDataLossy = toImageDataLossy;
exports.toTensorLossy = toTensorLossy;
