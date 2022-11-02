"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../../common/vendor.js");
const poseDetection_calculators_constants = require("../calculators/constants.js");
const poseDetection_calculators_image_utils = require("../calculators/image_utils.js");
const poseDetection_calculators_is_video = require("../calculators/is_video.js");
const poseDetection_calculators_keypoints_one_euro_filter = require("../calculators/keypoints_one_euro_filter.js");
const poseDetection_calculators_low_pass_filter = require("../calculators/low_pass_filter.js");
const poseDetection_constants = require("../constants.js");
const poseDetection_types = require("../types.js");
const poseDetection_util = require("../util.js");
const poseDetection_movenet_constants = require("./constants.js");
const poseDetection_movenet_detector_utils = require("./detector_utils.js");
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
class MoveNetDetector {
  constructor(moveNetModel, config) {
    __publicField(this, "modelInputResolution", { height: 0, width: 0 });
    __publicField(this, "keypointIndexByName", poseDetection_util.getKeypointIndexByName(poseDetection_types.SupportedModels.MoveNet));
    __publicField(this, "enableSmoothing");
    __publicField(this, "keypointsFilter", new poseDetection_calculators_keypoints_one_euro_filter.KeypointsOneEuroFilter(poseDetection_movenet_constants.KEYPOINT_FILTER_CONFIG));
    __publicField(this, "cropRegion");
    __publicField(this, "cropRegionFilterYMin", new poseDetection_calculators_low_pass_filter.LowPassFilter(poseDetection_movenet_constants.CROP_FILTER_ALPHA));
    __publicField(this, "cropRegionFilterXMin", new poseDetection_calculators_low_pass_filter.LowPassFilter(poseDetection_movenet_constants.CROP_FILTER_ALPHA));
    __publicField(this, "cropRegionFilterYMax", new poseDetection_calculators_low_pass_filter.LowPassFilter(poseDetection_movenet_constants.CROP_FILTER_ALPHA));
    __publicField(this, "cropRegionFilterXMax", new poseDetection_calculators_low_pass_filter.LowPassFilter(poseDetection_movenet_constants.CROP_FILTER_ALPHA));
    this.moveNetModel = moveNetModel;
    if (config.modelType === poseDetection_movenet_constants.SINGLEPOSE_LIGHTNING) {
      this.modelInputResolution.width = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
      this.modelInputResolution.height = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
    } else if (config.modelType === poseDetection_movenet_constants.SINGLEPOSE_THUNDER) {
      this.modelInputResolution.width = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
      this.modelInputResolution.height = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
    }
    this.enableSmoothing = config.enableSmoothing;
  }
  detectKeypoints(inputImage, executeSync = true) {
    if (!this.moveNetModel) {
      return null;
    }
    const numKeypoints = 17;
    let outputTensor;
    if (executeSync) {
      outputTensor = this.moveNetModel.execute(inputImage);
    } else {
      outputTensor = this.moveNetModel.execute(inputImage);
    }
    if (!outputTensor || outputTensor.shape.length !== 4 || outputTensor.shape[0] !== 1 || outputTensor.shape[1] !== 1 || outputTensor.shape[2] !== numKeypoints || outputTensor.shape[3] !== 3) {
      outputTensor.dispose();
      return null;
    }
    let inferenceResult;
    if (common_vendor.getBackend() !== "webgpu") {
      inferenceResult = outputTensor.dataSync();
    } else {
      inferenceResult = outputTensor.dataSync();
    }
    outputTensor.dispose();
    const keypoints = [];
    for (let i = 0; i < numKeypoints; ++i) {
      keypoints[i] = {
        y: inferenceResult[i * 3],
        x: inferenceResult[i * 3 + 1],
        score: inferenceResult[i * 3 + 2]
      };
    }
    return keypoints;
  }
  estimatePoses(image, estimationConfig = poseDetection_movenet_constants.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG, timestamp) {
    estimationConfig = poseDetection_movenet_detector_utils.validateEstimationConfig(estimationConfig);
    if (image == null) {
      this.reset();
      return [];
    }
    if (timestamp == null) {
      if (poseDetection_calculators_is_video.isVideo(image)) {
        timestamp = image.currentTime * poseDetection_calculators_constants.SECOND_TO_MICRO_SECONDS;
      }
    } else {
      timestamp = timestamp * poseDetection_calculators_constants.MILLISECOND_TO_MICRO_SECONDS;
    }
    const imageTensor3D = poseDetection_calculators_image_utils.toImageTensor(image);
    const imageSize = poseDetection_calculators_image_utils.getImageSize(imageTensor3D);
    const imageTensor4D = common_vendor.expandDims(imageTensor3D, 0);
    if (!(image instanceof common_vendor.Tensor)) {
      imageTensor3D.dispose();
    }
    if (!this.cropRegion) {
      this.cropRegion = this.initCropRegion(imageSize.width, imageSize.height);
    }
    const croppedImage = common_vendor.tidy(() => {
      const cropRegionTensor = common_vendor.tensor2d([[
        this.cropRegion.yMin,
        this.cropRegion.xMin,
        this.cropRegion.yMax,
        this.cropRegion.xMax
      ]]);
      const boxInd = common_vendor.zeros([1], "int32");
      const cropSize = [this.modelInputResolution.height, this.modelInputResolution.width];
      return common_vendor.cast(
        common_vendor.image.cropAndResize(
          imageTensor4D,
          cropRegionTensor,
          boxInd,
          cropSize,
          "bilinear",
          0
        ),
        "int32"
      );
    });
    imageTensor4D.dispose();
    let keypoints = this.detectKeypoints(croppedImage);
    croppedImage.dispose();
    if (keypoints == null) {
      this.reset();
      return [];
    }
    for (let i = 0; i < keypoints.length; ++i) {
      keypoints[i].y = this.cropRegion.yMin + keypoints[i].y * this.cropRegion.height;
      keypoints[i].x = this.cropRegion.xMin + keypoints[i].x * this.cropRegion.width;
    }
    if (timestamp != null && this.enableSmoothing) {
      keypoints = this.keypointsFilter.apply(keypoints, timestamp);
    }
    const newCropRegion = this.determineCropRegion(keypoints, imageSize.height, imageSize.width);
    this.cropRegion = this.filterCropRegion(newCropRegion);
    let numValidKeypoints = 0;
    let poseScore = 0;
    for (let i = 0; i < keypoints.length; ++i) {
      keypoints[i].name = poseDetection_constants.COCO_KEYPOINTS[i];
      keypoints[i].y *= imageSize.height;
      keypoints[i].x *= imageSize.width;
      if (keypoints[i].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE) {
        ++numValidKeypoints;
        poseScore += keypoints[i].score;
      }
    }
    if (numValidKeypoints > 0) {
      poseScore /= numValidKeypoints;
    } else {
      this.resetFilters();
    }
    const pose = { score: poseScore, keypoints };
    return [pose];
  }
  filterCropRegion(newCropRegion) {
    if (!newCropRegion) {
      this.cropRegionFilterYMin.reset();
      this.cropRegionFilterXMin.reset();
      this.cropRegionFilterYMax.reset();
      this.cropRegionFilterXMax.reset();
      return null;
    } else {
      const filteredYMin = this.cropRegionFilterYMin.apply(newCropRegion.yMin);
      const filteredXMin = this.cropRegionFilterXMin.apply(newCropRegion.xMin);
      const filteredYMax = this.cropRegionFilterYMax.apply(newCropRegion.yMax);
      const filteredXMax = this.cropRegionFilterXMax.apply(newCropRegion.xMax);
      return {
        yMin: filteredYMin,
        xMin: filteredXMin,
        yMax: filteredYMax,
        xMax: filteredXMax,
        height: filteredYMax - filteredYMin,
        width: filteredXMax - filteredXMin
      };
    }
  }
  dispose() {
    this.moveNetModel.dispose();
  }
  reset() {
    this.cropRegion = null;
    this.resetFilters();
  }
  resetFilters() {
    this.keypointsFilter.reset();
    this.cropRegionFilterYMin.reset();
    this.cropRegionFilterXMin.reset();
    this.cropRegionFilterYMax.reset();
    this.cropRegionFilterXMax.reset();
  }
  torsoVisible(keypoints) {
    return (keypoints[this.keypointIndexByName["left_hip"]].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE || keypoints[this.keypointIndexByName["right_hip"]].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE) && (keypoints[this.keypointIndexByName["left_shoulder"]].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE || keypoints[this.keypointIndexByName["right_shoulder"]].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE);
  }
  determineTorsoAndBodyRange(keypoints, targetKeypoints, centerY, centerX) {
    const torsoJoints = ["left_shoulder", "right_shoulder", "left_hip", "right_hip"];
    let maxTorsoYrange = 0;
    let maxTorsoXrange = 0;
    for (let i = 0; i < torsoJoints.length; i++) {
      const distY = Math.abs(centerY - targetKeypoints[torsoJoints[i]][0]);
      const distX = Math.abs(centerX - targetKeypoints[torsoJoints[i]][1]);
      if (distY > maxTorsoYrange) {
        maxTorsoYrange = distY;
      }
      if (distX > maxTorsoXrange) {
        maxTorsoXrange = distX;
      }
    }
    let maxBodyYrange = 0;
    let maxBodyXrange = 0;
    for (const key of Object.keys(targetKeypoints)) {
      if (keypoints[this.keypointIndexByName[key]].score < poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE) {
        continue;
      }
      const distY = Math.abs(centerY - targetKeypoints[key][0]);
      const distX = Math.abs(centerX - targetKeypoints[key][1]);
      if (distY > maxBodyYrange) {
        maxBodyYrange = distY;
      }
      if (distX > maxBodyXrange) {
        maxBodyXrange = distX;
      }
    }
    return [maxTorsoYrange, maxTorsoXrange, maxBodyYrange, maxBodyXrange];
  }
  determineCropRegion(keypoints, imageHeight, imageWidth) {
    const targetKeypoints = {};
    for (const key of poseDetection_constants.COCO_KEYPOINTS) {
      targetKeypoints[key] = [
        keypoints[this.keypointIndexByName[key]].y * imageHeight,
        keypoints[this.keypointIndexByName[key]].x * imageWidth
      ];
    }
    if (this.torsoVisible(keypoints)) {
      const centerY = (targetKeypoints["left_hip"][0] + targetKeypoints["right_hip"][0]) / 2;
      const centerX = (targetKeypoints["left_hip"][1] + targetKeypoints["right_hip"][1]) / 2;
      const [maxTorsoYrange, maxTorsoXrange, maxBodyYrange, maxBodyXrange] = this.determineTorsoAndBodyRange(
        keypoints,
        targetKeypoints,
        centerY,
        centerX
      );
      let cropLengthHalf = Math.max(
        maxTorsoXrange * 1.9,
        maxTorsoYrange * 1.9,
        maxBodyYrange * 1.2,
        maxBodyXrange * 1.2
      );
      cropLengthHalf = Math.min(
        cropLengthHalf,
        Math.max(
          centerX,
          imageWidth - centerX,
          centerY,
          imageHeight - centerY
        )
      );
      const cropCorner = [centerY - cropLengthHalf, centerX - cropLengthHalf];
      if (cropLengthHalf > Math.max(imageWidth, imageHeight) / 2) {
        return this.initCropRegion(imageHeight, imageWidth);
      } else {
        const cropLength = cropLengthHalf * 2;
        return {
          yMin: cropCorner[0] / imageHeight,
          xMin: cropCorner[1] / imageWidth,
          yMax: (cropCorner[0] + cropLength) / imageHeight,
          xMax: (cropCorner[1] + cropLength) / imageWidth,
          height: (cropCorner[0] + cropLength) / imageHeight - cropCorner[0] / imageHeight,
          width: (cropCorner[1] + cropLength) / imageWidth - cropCorner[1] / imageWidth
        };
      }
    } else {
      return this.initCropRegion(imageHeight, imageWidth);
    }
  }
  initCropRegion(imageHeight, imageWidth) {
    let boxHeight, boxWidth, yMin, xMin;
    if (!this.cropRegion) {
      if (imageWidth > imageHeight) {
        boxHeight = 1;
        boxWidth = imageHeight / imageWidth;
        yMin = 0;
        xMin = (imageWidth / 2 - imageHeight / 2) / imageWidth;
      } else {
        boxHeight = imageWidth / imageHeight;
        boxWidth = 1;
        yMin = (imageHeight / 2 - imageWidth / 2) / imageHeight;
        xMin = 0;
      }
    } else {
      if (imageWidth > imageHeight) {
        boxHeight = imageWidth / imageHeight;
        boxWidth = 1;
        yMin = (imageHeight / 2 - imageWidth / 2) / imageHeight;
        xMin = 0;
      } else {
        boxHeight = 1;
        boxWidth = imageHeight / imageWidth;
        yMin = 0;
        xMin = (imageWidth / 2 - imageHeight / 2) / imageWidth;
      }
    }
    return {
      yMin,
      xMin,
      yMax: yMin + boxHeight,
      xMax: xMin + boxWidth,
      height: boxHeight,
      width: boxWidth
    };
  }
}
async function load(modelConfig = poseDetection_movenet_constants.MOVENET_CONFIG) {
  const config = poseDetection_movenet_detector_utils.validateModelConfig(modelConfig);
  let model;
  if (config.modelUrl) {
    model = await common_vendor.loadGraphModel(config.modelUrl);
  } else {
    let modelUrl;
    if (config.modelType === poseDetection_movenet_constants.SINGLEPOSE_LIGHTNING) {
      modelUrl = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_LIGHTNING_URL;
    } else if (config.modelType === poseDetection_movenet_constants.SINGLEPOSE_THUNDER) {
      modelUrl = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_THUNDER_URL;
    }
    model = await common_vendor.loadGraphModel(modelUrl, { fromTFHub: true });
  }
  return new MoveNetDetector(model, config);
}
exports.load = load;
