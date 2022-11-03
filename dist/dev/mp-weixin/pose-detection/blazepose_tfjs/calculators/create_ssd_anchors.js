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
function createSsdAnchors(config) {
  const anchors = [];
  let layerId = 0;
  while (layerId < config.numLayers) {
    const anchorHeight = [];
    const anchorWidth = [];
    const aspectRatios = [];
    const scales = [];
    let lastSameStrideLayer = layerId;
    while (lastSameStrideLayer < config.strides.length && config.strides[lastSameStrideLayer] === config.strides[layerId]) {
      const scale = calculateScale(
        config.minScale,
        config.maxScale,
        lastSameStrideLayer,
        config.strides.length
      );
      if (lastSameStrideLayer === 0 && config.reduceBoxesInLowestLayer) {
        aspectRatios.push(1);
        aspectRatios.push(2);
        aspectRatios.push(0.5);
        scales.push(0.1);
        scales.push(scale);
        scales.push(scale);
      } else {
        for (let aspectRatioId = 0; aspectRatioId < config.aspectRatios.length; ++aspectRatioId) {
          aspectRatios.push(config.aspectRatios[aspectRatioId]);
          scales.push(scale);
        }
        if (config.interpolatedScaleAspectRatio > 0) {
          const scaleNext = lastSameStrideLayer === config.strides.length - 1 ? 1 : calculateScale(
            config.minScale,
            config.maxScale,
            lastSameStrideLayer + 1,
            config.strides.length
          );
          scales.push(Math.sqrt(scale * scaleNext));
          aspectRatios.push(config.interpolatedScaleAspectRatio);
        }
      }
      lastSameStrideLayer++;
    }
    for (let i = 0; i < aspectRatios.length; ++i) {
      const ratioSqrts = Math.sqrt(aspectRatios[i]);
      anchorHeight.push(scales[i] / ratioSqrts);
      anchorWidth.push(scales[i] * ratioSqrts);
    }
    let featureMapHeight = 0;
    let featureMapWidth = 0;
    if (config.featureMapHeight.length > 0) {
      featureMapHeight = config.featureMapHeight[layerId];
      featureMapWidth = config.featureMapWidth[layerId];
    } else {
      const stride = config.strides[layerId];
      featureMapHeight = Math.ceil(config.inputSizeHeight / stride);
      featureMapWidth = Math.ceil(config.inputSizeWidth / stride);
    }
    for (let y = 0; y < featureMapHeight; ++y) {
      for (let x = 0; x < featureMapWidth; ++x) {
        for (let anchorId = 0; anchorId < anchorHeight.length; ++anchorId) {
          const xCenter = (x + config.anchorOffsetX) / featureMapWidth;
          const yCenter = (y + config.anchorOffsetY) / featureMapHeight;
          const newAnchor = { xCenter, yCenter, width: 0, height: 0 };
          if (config.fixedAnchorSize) {
            newAnchor.width = 1;
            newAnchor.height = 1;
          } else {
            newAnchor.width = anchorWidth[anchorId];
            newAnchor.height = anchorHeight[anchorId];
          }
          anchors.push(newAnchor);
        }
      }
    }
    layerId = lastSameStrideLayer;
  }
  return anchors;
}
function calculateScale(minScale, maxScale, strideIndex, numStrides) {
  if (numStrides === 1) {
    return (minScale + maxScale) * 0.5;
  } else {
    return minScale + (maxScale - minScale) * strideIndex / (numStrides - 1);
  }
}
exports.createSsdAnchors = createSsdAnchors;
