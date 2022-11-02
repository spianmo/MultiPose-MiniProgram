"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../../common/vendor.js");
const poseDetection_calculators_convert_image_to_tensor = require("../calculators/convert_image_to_tensor.js");
const poseDetection_calculators_image_utils = require("../calculators/image_utils.js");
const poseDetection_calculators_shift_image_value = require("../calculators/shift_image_value.js");
const poseDetection_posenet_calculators_decode_multiple_poses = require("./calculators/decode_multiple_poses.js");
const poseDetection_posenet_calculators_decode_single_pose = require("./calculators/decode_single_pose.js");
const poseDetection_posenet_calculators_flip_poses = require("./calculators/flip_poses.js");
const poseDetection_posenet_calculators_scale_poses = require("./calculators/scale_poses.js");
const poseDetection_posenet_constants = require("./constants.js");
const poseDetection_posenet_detector_utils = require("./detector_utils.js");
const poseDetection_posenet_load_utils = require("./load_utils.js");
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
class PosenetDetector {
  constructor(posenetModel, config) {
    __publicField(this, "inputResolution");
    __publicField(this, "architecture");
    __publicField(this, "outputStride");
    __publicField(this, "maxPoses");
    this.posenetModel = posenetModel;
    const inputShape = this.posenetModel.inputs[0].shape;
    common_vendor.assert(
      inputShape[1] === -1 && inputShape[2] === -1,
      () => `Input shape [${inputShape[1]}, ${inputShape[2]}] must both be equal to or -1`
    );
    const validInputResolution = poseDetection_posenet_load_utils.getValidInputResolutionDimensions(
      config.inputResolution,
      config.outputStride
    );
    poseDetection_posenet_detector_utils.assertValidOutputStride(config.outputStride);
    poseDetection_posenet_detector_utils.assertValidResolution(validInputResolution, config.outputStride);
    this.inputResolution = validInputResolution;
    this.outputStride = config.outputStride;
    this.architecture = config.architecture;
  }
  async estimatePoses(image, estimationConfig = poseDetection_posenet_constants.SINGLE_PERSON_ESTIMATION_CONFIG) {
    const config = poseDetection_posenet_detector_utils.validateEstimationConfig(estimationConfig);
    if (image == null) {
      return [];
    }
    this.maxPoses = config.maxPoses;
    const { imageTensor, padding } = poseDetection_calculators_convert_image_to_tensor.convertImageToTensor(
      image,
      { inputResolution: this.inputResolution, keepAspectRatio: true }
    );
    const imageValueShifted = this.architecture === "ResNet50" ? common_vendor.add(imageTensor, poseDetection_posenet_constants.RESNET_MEAN) : poseDetection_calculators_shift_image_value.shiftImageValue(imageTensor, [-1, 1]);
    const results = this.posenetModel.predict(imageValueShifted);
    let offsets, heatmap, displacementFwd, displacementBwd;
    if (this.architecture === "ResNet50") {
      offsets = common_vendor.squeeze(results[2], [0]);
      heatmap = common_vendor.squeeze(results[3], [0]);
      displacementFwd = common_vendor.squeeze(results[0], [0]);
      displacementBwd = common_vendor.squeeze(results[1], [0]);
    } else {
      offsets = common_vendor.squeeze(results[0], [0]);
      heatmap = common_vendor.squeeze(results[1], [0]);
      displacementFwd = common_vendor.squeeze(results[2], [0]);
      displacementBwd = common_vendor.squeeze(results[3], [0]);
    }
    const heatmapScores = common_vendor.sigmoid(heatmap);
    let poses;
    if (this.maxPoses === 1) {
      const pose = await poseDetection_posenet_calculators_decode_single_pose.decodeSinglePose(
        heatmapScores,
        offsets,
        this.outputStride
      );
      poses = [pose];
    } else {
      poses = await poseDetection_posenet_calculators_decode_multiple_poses.decodeMultiplePoses(
        heatmapScores,
        offsets,
        displacementFwd,
        displacementBwd,
        this.outputStride,
        this.maxPoses,
        config.scoreThreshold,
        config.nmsRadius
      );
    }
    const imageSize = poseDetection_calculators_image_utils.getImageSize(image);
    let scaledPoses = poseDetection_posenet_calculators_scale_poses.scalePoses(poses, imageSize, this.inputResolution, padding);
    if (config.flipHorizontal) {
      scaledPoses = poseDetection_posenet_calculators_flip_poses.flipPosesHorizontal(scaledPoses, imageSize);
    }
    imageTensor.dispose();
    imageValueShifted.dispose();
    common_vendor.dispose(results);
    offsets.dispose();
    heatmap.dispose();
    displacementFwd.dispose();
    displacementBwd.dispose();
    heatmapScores.dispose();
    return scaledPoses;
  }
  dispose() {
    this.posenetModel.dispose();
  }
  reset() {
  }
}
async function load(modelConfig = poseDetection_posenet_constants.MOBILENET_V1_CONFIG) {
  const config = poseDetection_posenet_detector_utils.validateModelConfig(modelConfig);
  if (config.architecture === "ResNet50") {
    const defaultUrl2 = poseDetection_posenet_load_utils.resNet50Checkpoint(config.outputStride, config.quantBytes);
    const model2 = await common_vendor.loadGraphModel(config.modelUrl || defaultUrl2);
    return new PosenetDetector(model2, config);
  }
  const defaultUrl = poseDetection_posenet_load_utils.mobileNetCheckpoint(
    config.outputStride,
    config.multiplier,
    config.quantBytes
  );
  const model = await common_vendor.loadGraphModel(config.modelUrl || defaultUrl);
  return new PosenetDetector(model, config);
}
exports.load = load;
