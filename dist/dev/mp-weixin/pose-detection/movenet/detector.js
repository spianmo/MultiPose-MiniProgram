"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../../common/vendor.js");
const poseDetection_calculators_bounding_box_tracker = require("../calculators/bounding_box_tracker.js");
const poseDetection_calculators_keypoint_tracker = require("../calculators/keypoint_tracker.js");
const poseDetection_calculators_types = require("../calculators/types.js");
const poseDetection_constants = require("../constants.js");
const poseDetection_shared_calculators_constants = require("../shared/calculators/constants.js");
const poseDetection_shared_calculators_image_utils = require("../shared/calculators/image_utils.js");
const poseDetection_shared_calculators_is_video = require("../shared/calculators/is_video.js");
const poseDetection_shared_filters_keypoints_one_euro_filter = require("../shared/filters/keypoints_one_euro_filter.js");
const poseDetection_shared_filters_low_pass_filter = require("../shared/filters/low_pass_filter.js");
const poseDetection_types = require("../types.js");
const poseDetection_util = require("../util.js");
const poseDetection_movenet_constants = require("./constants.js");
const poseDetection_movenet_crop_utils = require("./crop_utils.js");
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
    __publicField(this, "multiPoseModel");
    __publicField(this, "enableSmoothing");
    __publicField(this, "minPoseScore");
    __publicField(this, "keypointFilter");
    __publicField(this, "cropRegionFilterYMin");
    __publicField(this, "cropRegionFilterXMin");
    __publicField(this, "cropRegionFilterYMax");
    __publicField(this, "cropRegionFilterXMax");
    __publicField(this, "cropRegion");
    __publicField(this, "multiPoseMaxDimension");
    __publicField(this, "enableTracking");
    __publicField(this, "tracker");
    __publicField(this, "keypointFilterMap");
    this.moveNetModel = moveNetModel;
    if (config.modelType === poseDetection_movenet_constants.SINGLEPOSE_LIGHTNING) {
      this.modelInputResolution.width = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
      this.modelInputResolution.height = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
    } else if (config.modelType === poseDetection_movenet_constants.SINGLEPOSE_THUNDER) {
      this.modelInputResolution.width = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
      this.modelInputResolution.height = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
    }
    this.multiPoseModel = config.modelType === poseDetection_movenet_constants.MULTIPOSE_LIGHTNING;
    if (!this.multiPoseModel) {
      this.keypointFilter = new poseDetection_shared_filters_keypoints_one_euro_filter.KeypointsOneEuroFilter(poseDetection_movenet_constants.KEYPOINT_FILTER_CONFIG);
      this.cropRegionFilterYMin = new poseDetection_shared_filters_low_pass_filter.LowPassFilter(poseDetection_movenet_constants.CROP_FILTER_ALPHA);
      this.cropRegionFilterXMin = new poseDetection_shared_filters_low_pass_filter.LowPassFilter(poseDetection_movenet_constants.CROP_FILTER_ALPHA);
      this.cropRegionFilterYMax = new poseDetection_shared_filters_low_pass_filter.LowPassFilter(poseDetection_movenet_constants.CROP_FILTER_ALPHA);
      this.cropRegionFilterXMax = new poseDetection_shared_filters_low_pass_filter.LowPassFilter(poseDetection_movenet_constants.CROP_FILTER_ALPHA);
    }
    this.enableSmoothing = config.enableSmoothing;
    if (config.minPoseScore) {
      this.minPoseScore = config.minPoseScore;
    } else {
      this.minPoseScore = poseDetection_movenet_constants.DEFAULT_MIN_POSE_SCORE;
    }
    if (config.multiPoseMaxDimension) {
      this.multiPoseMaxDimension = config.multiPoseMaxDimension;
    } else {
      this.multiPoseMaxDimension = poseDetection_movenet_constants.MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION;
    }
    this.enableTracking = config.enableTracking;
    if (this.multiPoseModel && this.enableTracking) {
      if (config.trackerType === poseDetection_calculators_types.TrackerType.Keypoint) {
        this.tracker = new poseDetection_calculators_keypoint_tracker.KeypointTracker(config.trackerConfig);
      } else if (config.trackerType === poseDetection_calculators_types.TrackerType.BoundingBox) {
        this.tracker = new poseDetection_calculators_bounding_box_tracker.BoundingBoxTracker(config.trackerConfig);
      }
      if (this.enableSmoothing) {
        this.keypointFilterMap = /* @__PURE__ */ new Map();
      }
    }
  }
  async runSinglePersonPoseModel(inputImage) {
    const outputTensor = this.moveNetModel.execute(inputImage);
    if (outputTensor.shape.length !== 4 || outputTensor.shape[0] !== 1 || outputTensor.shape[1] !== 1 || outputTensor.shape[2] !== poseDetection_movenet_constants.NUM_KEYPOINTS || outputTensor.shape[3] !== poseDetection_movenet_constants.NUM_KEYPOINT_VALUES) {
      outputTensor.dispose();
      throw new Error(
        `Unexpected output shape from model: [${outputTensor.shape}]`
      );
    }
    let inferenceResult;
    if (common_vendor.getBackend() !== "webgpu") {
      inferenceResult = outputTensor.dataSync();
    } else {
      inferenceResult = await outputTensor.data();
    }
    outputTensor.dispose();
    const pose = { keypoints: [], score: 0 };
    let numValidKeypoints = 0;
    for (let i = 0; i < poseDetection_movenet_constants.NUM_KEYPOINTS; ++i) {
      pose.keypoints[i] = {
        y: inferenceResult[i * poseDetection_movenet_constants.NUM_KEYPOINT_VALUES],
        x: inferenceResult[i * poseDetection_movenet_constants.NUM_KEYPOINT_VALUES + 1],
        score: inferenceResult[i * poseDetection_movenet_constants.NUM_KEYPOINT_VALUES + 2]
      };
      if (pose.keypoints[i].score > poseDetection_movenet_constants.MIN_CROP_KEYPOINT_SCORE) {
        ++numValidKeypoints;
        pose.score += pose.keypoints[i].score;
      }
    }
    if (numValidKeypoints > 0) {
      pose.score /= numValidKeypoints;
    }
    return pose;
  }
  async runMultiPersonPoseModel(inputImage) {
    const outputTensor = this.moveNetModel.execute(inputImage);
    if (outputTensor.shape.length !== 3 || outputTensor.shape[0] !== 1 || outputTensor.shape[2] !== poseDetection_movenet_constants.MULTIPOSE_INSTANCE_SIZE) {
      outputTensor.dispose();
      throw new Error(
        `Unexpected output shape from model: [${outputTensor.shape}]`
      );
    }
    let inferenceResult;
    if (common_vendor.getBackend() !== "webgpu") {
      inferenceResult = outputTensor.dataSync();
    } else {
      inferenceResult = await outputTensor.data();
    }
    outputTensor.dispose();
    const poses = [];
    const numInstances = inferenceResult.length / poseDetection_movenet_constants.MULTIPOSE_INSTANCE_SIZE;
    for (let i = 0; i < numInstances; ++i) {
      poses[i] = { keypoints: [] };
      const boxIndex = i * poseDetection_movenet_constants.MULTIPOSE_INSTANCE_SIZE + poseDetection_movenet_constants.MULTIPOSE_BOX_IDX;
      poses[i].box = {
        yMin: inferenceResult[boxIndex],
        xMin: inferenceResult[boxIndex + 1],
        yMax: inferenceResult[boxIndex + 2],
        xMax: inferenceResult[boxIndex + 3],
        width: inferenceResult[boxIndex + 3] - inferenceResult[boxIndex + 1],
        height: inferenceResult[boxIndex + 2] - inferenceResult[boxIndex]
      };
      const scoreIndex = i * poseDetection_movenet_constants.MULTIPOSE_INSTANCE_SIZE + poseDetection_movenet_constants.MULTIPOSE_BOX_SCORE_IDX;
      poses[i].score = inferenceResult[scoreIndex];
      poses[i].keypoints = [];
      for (let j = 0; j < poseDetection_movenet_constants.NUM_KEYPOINTS; ++j) {
        poses[i].keypoints[j] = {
          y: inferenceResult[i * poseDetection_movenet_constants.MULTIPOSE_INSTANCE_SIZE + j * poseDetection_movenet_constants.NUM_KEYPOINT_VALUES],
          x: inferenceResult[i * poseDetection_movenet_constants.MULTIPOSE_INSTANCE_SIZE + j * poseDetection_movenet_constants.NUM_KEYPOINT_VALUES + 1],
          score: inferenceResult[i * poseDetection_movenet_constants.MULTIPOSE_INSTANCE_SIZE + j * poseDetection_movenet_constants.NUM_KEYPOINT_VALUES + 2]
        };
      }
    }
    return poses;
  }
  async estimatePoses(image, estimationConfig = poseDetection_movenet_constants.MOVENET_ESTIMATION_CONFIG, timestamp) {
    estimationConfig = poseDetection_movenet_detector_utils.validateEstimationConfig(estimationConfig);
    if (image == null) {
      this.reset();
      return [];
    }
    if (timestamp == null) {
      if (poseDetection_shared_calculators_is_video.isVideo(image)) {
        timestamp = image.currentTime * poseDetection_shared_calculators_constants.SECOND_TO_MICRO_SECONDS;
      }
    } else {
      timestamp = timestamp * poseDetection_shared_calculators_constants.MILLISECOND_TO_MICRO_SECONDS;
    }
    const imageTensor3D = poseDetection_shared_calculators_image_utils.toImageTensor(image);
    const imageSize = poseDetection_shared_calculators_image_utils.getImageSize(imageTensor3D);
    const imageTensor4D = common_vendor.expandDims(imageTensor3D, 0);
    if (!(image instanceof common_vendor.Tensor)) {
      imageTensor3D.dispose();
    }
    let poses = [];
    if (!this.multiPoseModel) {
      poses = await this.estimateSinglePose(imageTensor4D, imageSize, timestamp);
    } else {
      poses = await this.estimateMultiplePoses(imageTensor4D, imageSize, timestamp);
    }
    for (let poseIdx = 0; poseIdx < poses.length; ++poseIdx) {
      for (let keypointIdx = 0; keypointIdx < poses[poseIdx].keypoints.length; ++keypointIdx) {
        poses[poseIdx].keypoints[keypointIdx].name = poseDetection_constants.COCO_KEYPOINTS[keypointIdx];
        poses[poseIdx].keypoints[keypointIdx].y *= imageSize.height;
        poses[poseIdx].keypoints[keypointIdx].x *= imageSize.width;
      }
    }
    return poses;
  }
  async estimateSinglePose(imageTensor4D, imageSize, timestamp) {
    if (!this.cropRegion) {
      this.cropRegion = poseDetection_movenet_crop_utils.initCropRegion(this.cropRegion == null, imageSize);
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
    const pose = await this.runSinglePersonPoseModel(croppedImage);
    croppedImage.dispose();
    if (pose.score < this.minPoseScore) {
      this.reset();
      return [];
    }
    for (let i = 0; i < pose.keypoints.length; ++i) {
      pose.keypoints[i].y = this.cropRegion.yMin + pose.keypoints[i].y * this.cropRegion.height;
      pose.keypoints[i].x = this.cropRegion.xMin + pose.keypoints[i].x * this.cropRegion.width;
    }
    if (timestamp != null && this.enableSmoothing) {
      pose.keypoints = this.keypointFilter.apply(
        pose.keypoints,
        timestamp,
        1
      );
    }
    const nextCropRegion = poseDetection_movenet_crop_utils.determineNextCropRegion(
      this.cropRegion,
      pose.keypoints,
      this.keypointIndexByName,
      imageSize
    );
    this.cropRegion = this.filterCropRegion(nextCropRegion);
    return [pose];
  }
  async estimateMultiplePoses(imageTensor4D, imageSize, timestamp) {
    let resizedImage;
    let resizedWidth;
    let resizedHeight;
    let paddedImage;
    let paddedWidth;
    let paddedHeight;
    const dimensionDivisor = 32;
    if (imageSize.width > imageSize.height) {
      resizedWidth = this.multiPoseMaxDimension;
      resizedHeight = Math.round(
        this.multiPoseMaxDimension * imageSize.height / imageSize.width
      );
      resizedImage = common_vendor.image.resizeBilinear(imageTensor4D, [resizedHeight, resizedWidth]);
      paddedWidth = resizedWidth;
      paddedHeight = Math.ceil(resizedHeight / dimensionDivisor) * dimensionDivisor;
      paddedImage = common_vendor.pad(
        resizedImage,
        [[0, 0], [0, paddedHeight - resizedHeight], [0, 0], [0, 0]]
      );
    } else {
      resizedWidth = Math.round(
        this.multiPoseMaxDimension * imageSize.width / imageSize.height
      );
      resizedHeight = this.multiPoseMaxDimension;
      resizedImage = common_vendor.image.resizeBilinear(imageTensor4D, [resizedHeight, resizedWidth]);
      paddedWidth = Math.ceil(resizedWidth / dimensionDivisor) * dimensionDivisor;
      paddedHeight = resizedHeight;
      paddedImage = common_vendor.pad(
        resizedImage,
        [[0, 0], [0, 0], [0, paddedWidth - resizedWidth], [0, 0]]
      );
    }
    resizedImage.dispose();
    imageTensor4D.dispose();
    const paddedImageInt32 = common_vendor.cast(paddedImage, "int32");
    paddedImage.dispose();
    let poses = await this.runMultiPersonPoseModel(paddedImageInt32);
    paddedImageInt32.dispose();
    poses = poses.filter((pose) => pose.score >= this.minPoseScore);
    for (let i = 0; i < poses.length; ++i) {
      for (let j = 0; j < poses[i].keypoints.length; ++j) {
        poses[i].keypoints[j].y *= paddedHeight / resizedHeight;
        poses[i].keypoints[j].x *= paddedWidth / resizedWidth;
      }
    }
    if (this.enableTracking) {
      this.tracker.apply(poses, timestamp);
      if (this.enableSmoothing) {
        for (let i = 0; i < poses.length; ++i) {
          if (!this.keypointFilterMap.has(poses[i].id)) {
            this.keypointFilterMap.set(
              poses[i].id,
              new poseDetection_shared_filters_keypoints_one_euro_filter.KeypointsOneEuroFilter(poseDetection_movenet_constants.KEYPOINT_FILTER_CONFIG)
            );
          }
          poses[i].keypoints = this.keypointFilterMap.get(poses[i].id).apply(poses[i].keypoints, timestamp, 1);
        }
        const trackIDs = this.tracker.getTrackIDs();
        this.keypointFilterMap.forEach((_, trackID) => {
          if (!trackIDs.has(trackID)) {
            this.keypointFilterMap.delete(trackID);
          }
        });
      }
    }
    return poses;
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
    this.keypointFilter.reset();
    this.cropRegionFilterYMin.reset();
    this.cropRegionFilterXMin.reset();
    this.cropRegionFilterYMax.reset();
    this.cropRegionFilterXMax.reset();
  }
}
async function load(modelConfig = poseDetection_movenet_constants.MOVENET_CONFIG) {
  const config = poseDetection_movenet_detector_utils.validateModelConfig(modelConfig);
  let model;
  let fromTFHub = true;
  if (!!config.modelUrl) {
    fromTFHub = typeof config.modelUrl === "string" && config.modelUrl.indexOf("https://tfhub.dev") > -1;
    model = await common_vendor.loadGraphModel(config.modelUrl, { fromTFHub });
  } else {
    let modelUrl;
    if (config.modelType === poseDetection_movenet_constants.SINGLEPOSE_LIGHTNING) {
      modelUrl = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_LIGHTNING_URL;
    } else if (config.modelType === poseDetection_movenet_constants.SINGLEPOSE_THUNDER) {
      modelUrl = poseDetection_movenet_constants.MOVENET_SINGLEPOSE_THUNDER_URL;
    } else if (config.modelType === poseDetection_movenet_constants.MULTIPOSE_LIGHTNING) {
      modelUrl = poseDetection_movenet_constants.MOVENET_MULTIPOSE_LIGHTNING_URL;
    }
    model = await common_vendor.loadGraphModel(modelUrl, { fromTFHub });
  }
  if (common_vendor.getBackend() === "webgl") {
    common_vendor.env().set("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD", 0);
  }
  return new MoveNetDetector(model, config);
}
exports.load = load;
