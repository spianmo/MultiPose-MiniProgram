"use strict";
const poseDetection_calculators_image_utils = require("../../calculators/image_utils.js");
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
function transformNormalizedRect(rect, imageSize, config) {
  let width = rect.width;
  let height = rect.height;
  let rotation = rect.rotation;
  if (config.rotation != null || config.rotationDegree != null) {
    rotation = computeNewRotation(rotation, config);
  }
  if (rotation === 0) {
    rect.xCenter = rect.xCenter + width * config.shiftX;
    rect.yCenter = rect.yCenter + height * config.shiftY;
  } else {
    const xShift = (imageSize.width * width * config.shiftX * Math.cos(rotation) - imageSize.height * height * config.shiftY * Math.sin(rotation)) / imageSize.width;
    const yShift = (imageSize.width * width * config.shiftX * Math.sin(rotation) + imageSize.height * height * config.shiftY * Math.cos(rotation)) / imageSize.height;
    rect.xCenter = rect.xCenter + xShift;
    rect.yCenter = rect.yCenter + yShift;
  }
  if (config.squareLong) {
    const longSide = Math.max(width * imageSize.width, height * imageSize.height);
    width = longSide / imageSize.width;
    height = longSide / imageSize.height;
  } else if (config.squareShort) {
    const shortSide = Math.min(width * imageSize.width, height * imageSize.height);
    width = shortSide / imageSize.width;
    height = shortSide / imageSize.height;
  }
  rect.width = width * config.scaleX;
  rect.height = height * config.scaleY;
  return rect;
}
function computeNewRotation(rotation, config) {
  if (config.rotation != null) {
    rotation += config.rotation;
  } else if (config.rotationDegree != null) {
    rotation += Math.PI * config.rotationDegree / 180;
  }
  return poseDetection_calculators_image_utils.normalizeRadians(rotation);
}
exports.transformNormalizedRect = transformNormalizedRect;
