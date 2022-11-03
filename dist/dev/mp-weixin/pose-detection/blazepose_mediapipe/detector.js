"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../../common/vendor.js");
const poseDetection_constants = require("../constants.js");
const poseDetection_shared_calculators_mask_util = require("../shared/calculators/mask_util.js");
const poseDetection_blazepose_mediapipe_detector_utils = require("./detector_utils.js");
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
class BlazePoseMediaPipeMask {
  constructor(mask) {
    this.mask = mask;
  }
  async toCanvasImageSource() {
    return this.mask;
  }
  async toImageData() {
    return poseDetection_shared_calculators_mask_util.toImageDataLossy(this.mask);
  }
  async toTensor() {
    return poseDetection_shared_calculators_mask_util.toTensorLossy(this.mask);
  }
  getUnderlyingType() {
    return "canvasimagesource";
  }
}
function maskValueToLabel(maskValue) {
  poseDetection_shared_calculators_mask_util.assertMaskValue(maskValue);
  return "person";
}
class BlazePoseMediaPipeDetector {
  constructor(config) {
    __publicField(this, "poseSolution");
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
    __publicField(this, "poses");
    __publicField(this, "selfieMode", false);
    this.poseSolution = new common_vendor.pose.Pose({
      locateFile: (path, base) => {
        if (config.solutionPath) {
          const solutionPath = config.solutionPath.replace(/\/+$/, "");
          return `${solutionPath}/${path}`;
        }
        return `${base}/${path}`;
      }
    });
    let modelComplexity;
    switch (config.modelType) {
      case "lite":
        modelComplexity = 0;
        break;
      case "heavy":
        modelComplexity = 2;
        break;
      case "full":
      default:
        modelComplexity = 1;
        break;
    }
    this.poseSolution.setOptions({
      modelComplexity,
      smoothLandmarks: config.enableSmoothing,
      enableSegmentation: config.enableSegmentation,
      smoothSegmentation: config.smoothSegmentation,
      selfieMode: this.selfieMode
    });
    this.poseSolution.onResults((results) => {
      this.height = results.image.height;
      this.width = results.image.width;
      if (results.poseLandmarks == null) {
        this.poses = [];
      } else {
        const pose2 = this.translateOutput(
          results.poseLandmarks,
          results.poseWorldLandmarks
        );
        if (results.segmentationMask) {
          pose2.segmentation = {
            maskValueToLabel,
            mask: new BlazePoseMediaPipeMask(results.segmentationMask)
          };
        }
        this.poses = [pose2];
      }
    });
  }
  translateOutput(pose2, pose3D) {
    const output = {
      keypoints: pose2.map((landmark, i) => ({
        x: landmark.x * this.width,
        y: landmark.y * this.height,
        z: landmark.z,
        score: landmark.visibility,
        name: poseDetection_constants.BLAZEPOSE_KEYPOINTS[i]
      }))
    };
    if (pose3D != null) {
      output.keypoints3D = pose3D.map((landmark, i) => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        score: landmark.visibility,
        name: poseDetection_constants.BLAZEPOSE_KEYPOINTS[i]
      }));
    }
    return output;
  }
  async estimatePoses(image, estimationConfig, timestamp) {
    if (estimationConfig && estimationConfig.flipHorizontal && estimationConfig.flipHorizontal !== this.selfieMode) {
      this.selfieMode = estimationConfig.flipHorizontal;
      this.poseSolution.setOptions({
        selfieMode: this.selfieMode
      });
    }
    image = image instanceof common_vendor.Tensor ? new ImageData(
      await common_vendor.toPixels(image),
      image.shape[1],
      image.shape[0]
    ) : image;
    await this.poseSolution.send({ image }, timestamp);
    return this.poses;
  }
  dispose() {
    this.poseSolution.close();
  }
  reset() {
    this.poseSolution.reset();
  }
  initialize() {
    return this.poseSolution.initialize();
  }
}
async function load(modelConfig) {
  const config = poseDetection_blazepose_mediapipe_detector_utils.validateModelConfig(modelConfig);
  const result = new BlazePoseMediaPipeDetector(config);
  await result.initialize();
  return result;
}
exports.load = load;
