"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../../common/vendor.js");
const poseDetection_calculators_constants = require("../calculators/constants.js");
const poseDetection_calculators_convert_image_to_tensor = require("../calculators/convert_image_to_tensor.js");
const poseDetection_calculators_image_utils = require("../calculators/image_utils.js");
const poseDetection_calculators_is_video = require("../calculators/is_video.js");
const poseDetection_calculators_keypoints_smoothing = require("../calculators/keypoints_smoothing.js");
const poseDetection_calculators_normalized_keypoints_to_keypoints = require("../calculators/normalized_keypoints_to_keypoints.js");
const poseDetection_calculators_shift_image_value = require("../calculators/shift_image_value.js");
const poseDetection_constants = require("../constants.js");
const poseDetection_blazepose_tfjs_calculators_calculate_alignment_points_rects = require("./calculators/calculate_alignment_points_rects.js");
const poseDetection_blazepose_tfjs_calculators_calculate_landmark_projection = require("./calculators/calculate_landmark_projection.js");
const poseDetection_blazepose_tfjs_calculators_create_ssd_anchors = require("./calculators/create_ssd_anchors.js");
const poseDetection_blazepose_tfjs_calculators_detector_inference = require("./calculators/detector_inference.js");
const poseDetection_blazepose_tfjs_calculators_landmarks_to_detection = require("./calculators/landmarks_to_detection.js");
const poseDetection_blazepose_tfjs_calculators_non_max_suppression = require("./calculators/non_max_suppression.js");
const poseDetection_blazepose_tfjs_calculators_refine_landmarks_from_heatmap = require("./calculators/refine_landmarks_from_heatmap.js");
const poseDetection_blazepose_tfjs_calculators_remove_detection_letterbox = require("./calculators/remove_detection_letterbox.js");
const poseDetection_blazepose_tfjs_calculators_remove_landmark_letterbox = require("./calculators/remove_landmark_letterbox.js");
const poseDetection_blazepose_tfjs_calculators_tensors_to_detections = require("./calculators/tensors_to_detections.js");
const poseDetection_blazepose_tfjs_calculators_tensors_to_landmarks = require("./calculators/tensors_to_landmarks.js");
const poseDetection_blazepose_tfjs_calculators_transform_rect = require("./calculators/transform_rect.js");
const poseDetection_blazepose_tfjs_calculators_visibility_smoothing = require("./calculators/visibility_smoothing.js");
const poseDetection_blazepose_tfjs_constants = require("./constants.js");
const poseDetection_blazepose_tfjs_detector_utils = require("./detector_utils.js");
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
class BlazePoseTfjsDetector {
  constructor(detectorModel, landmarkModel, enableSmoothing, modelType) {
    __publicField(this, "anchors");
    __publicField(this, "anchorTensor");
    __publicField(this, "maxPoses");
    __publicField(this, "timestamp");
    __publicField(this, "regionOfInterest", null);
    __publicField(this, "visibilitySmoothingFilterActual");
    __publicField(this, "visibilitySmoothingFilterAuxiliary");
    __publicField(this, "landmarksSmoothingFilterActual");
    __publicField(this, "landmarksSmoothingFilterAuxiliary");
    this.detectorModel = detectorModel;
    this.landmarkModel = landmarkModel;
    this.enableSmoothing = enableSmoothing;
    this.modelType = modelType;
    this.anchors = poseDetection_blazepose_tfjs_calculators_create_ssd_anchors.createSsdAnchors(poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION);
    const anchorW = common_vendor.tensor1d(this.anchors.map((a) => a.width));
    const anchorH = common_vendor.tensor1d(this.anchors.map((a) => a.height));
    const anchorX = common_vendor.tensor1d(this.anchors.map((a) => a.xCenter));
    const anchorY = common_vendor.tensor1d(this.anchors.map((a) => a.yCenter));
    this.anchorTensor = { x: anchorX, y: anchorY, w: anchorW, h: anchorH };
  }
  estimatePoses(image, estimationConfig, timestamp) {
    const config = poseDetection_blazepose_tfjs_detector_utils.validateEstimationConfig(estimationConfig);
    if (image == null) {
      this.reset();
      return [];
    }
    this.maxPoses = config.maxPoses;
    if (timestamp != null) {
      this.timestamp = timestamp * poseDetection_calculators_constants.MILLISECOND_TO_MICRO_SECONDS;
    } else {
      this.timestamp = poseDetection_calculators_is_video.isVideo(image) ? image.currentTime * poseDetection_calculators_constants.SECOND_TO_MICRO_SECONDS : null;
    }
    const imageSize = poseDetection_calculators_image_utils.getImageSize(image);
    const image3d = common_vendor.tidy(() => common_vendor.cast(poseDetection_calculators_image_utils.toImageTensor(image), "float32"));
    let poseRect = this.regionOfInterest;
    if (poseRect == null) {
      const detections = this.detectPose(image3d);
      if (detections.length === 0) {
        this.reset();
        image3d.dispose();
        return [];
      }
      const firstDetection = detections[0];
      poseRect = this.poseDetectionToRoi(firstDetection, imageSize);
    }
    const poseLandmarks = this.poseLandmarksByRoi(poseRect, image3d);
    image3d.dispose();
    if (poseLandmarks == null) {
      this.reset();
      return [];
    }
    const { actualLandmarks, auxiliaryLandmarks, poseScore } = poseLandmarks;
    const { actualLandmarksFiltered, auxiliaryLandmarksFiltered } = this.poseLandmarkFiltering(
      actualLandmarks,
      auxiliaryLandmarks,
      imageSize
    );
    const poseRectFromLandmarks = this.poseLandmarksToRoi(auxiliaryLandmarksFiltered, imageSize);
    this.regionOfInterest = poseRectFromLandmarks;
    const keypoints = actualLandmarksFiltered != null ? poseDetection_calculators_normalized_keypoints_to_keypoints.normalizedKeypointsToKeypoints(actualLandmarksFiltered, imageSize) : null;
    if (keypoints != null) {
      keypoints.forEach((keypoint, i) => {
        keypoint.name = poseDetection_constants.BLAZEPOSE_KEYPOINTS[i];
      });
    }
    const pose = { score: poseScore, keypoints };
    return [pose];
  }
  dispose() {
    this.detectorModel.dispose();
    this.landmarkModel.dispose();
    common_vendor.dispose([
      this.anchorTensor.x,
      this.anchorTensor.y,
      this.anchorTensor.w,
      this.anchorTensor.h
    ]);
  }
  reset() {
    this.regionOfInterest = null;
    this.visibilitySmoothingFilterActual = null;
    this.visibilitySmoothingFilterAuxiliary = null;
    this.landmarksSmoothingFilterActual = null;
    this.landmarksSmoothingFilterAuxiliary = null;
  }
  detectPose(image) {
    const { imageTensor, padding } = poseDetection_calculators_convert_image_to_tensor.convertImageToTensor(
      image,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG
    );
    const imageValueShifted = poseDetection_calculators_shift_image_value.shiftImageValue(imageTensor, [-1, 1]);
    const { boxes, scores } = poseDetection_blazepose_tfjs_calculators_detector_inference.detectorInference(imageValueShifted, this.detectorModel);
    const detections = poseDetection_blazepose_tfjs_calculators_tensors_to_detections.tensorsToDetections(
      [scores, boxes],
      this.anchorTensor,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION
    );
    const selectedDetections = poseDetection_blazepose_tfjs_calculators_non_max_suppression.nonMaxSuppression(
      detections,
      this.maxPoses,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION.minSuppressionThreshold,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION.minScoreThreshold
    );
    const newDetections = poseDetection_blazepose_tfjs_calculators_remove_detection_letterbox.removeDetectionLetterbox(selectedDetections, padding);
    common_vendor.dispose([imageTensor, imageValueShifted, scores, boxes]);
    return newDetections;
  }
  poseDetectionToRoi(detection, imageSize) {
    let startKeypointIndex;
    let endKeypointIndex;
    startKeypointIndex = 0;
    endKeypointIndex = 1;
    const rawRoi = poseDetection_blazepose_tfjs_calculators_calculate_alignment_points_rects.calculateAlignmentPointsRects(detection, imageSize, {
      rotationVectorEndKeypointIndex: endKeypointIndex,
      rotationVectorStartKeypointIndex: startKeypointIndex,
      rotationVectorTargetAngleDegree: 90
    });
    const roi = poseDetection_blazepose_tfjs_calculators_transform_rect.transformNormalizedRect(
      rawRoi,
      imageSize,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG
    );
    return roi;
  }
  poseLandmarksByRoi(poseRect, image) {
    const { imageTensor, padding } = poseDetection_calculators_convert_image_to_tensor.convertImageToTensor(
      image,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG,
      poseRect
    );
    const imageValueShifted = poseDetection_calculators_shift_image_value.shiftImageValue(imageTensor, [0, 1]);
    const landmarkResult = this.landmarkModel.predict(imageValueShifted);
    let landmarkTensor, poseFlagTensor, heatmapTensor;
    switch (this.modelType) {
      case "lite":
        landmarkTensor = landmarkResult[3];
        poseFlagTensor = landmarkResult[4];
        heatmapTensor = landmarkResult[1];
        break;
      case "full":
        landmarkTensor = landmarkResult[4];
        poseFlagTensor = landmarkResult[3];
        heatmapTensor = landmarkResult[1];
        break;
      case "heavy":
        landmarkTensor = landmarkResult[3];
        poseFlagTensor = landmarkResult[1];
        heatmapTensor = landmarkResult[4];
        break;
      default:
        throw new Error(
          `Model type must be one of lite, full or heavy,but got ${this.modelType}`
        );
    }
    const poseScore = poseFlagTensor.dataSync()[0];
    if (poseScore < poseDetection_blazepose_tfjs_constants.BLAZEPOSE_POSE_PRESENCE_SCORE) {
      common_vendor.dispose(landmarkResult);
      common_vendor.dispose([imageTensor, imageValueShifted]);
      return null;
    }
    const landmarks = poseDetection_blazepose_tfjs_calculators_tensors_to_landmarks.tensorsToLandmarks(
      landmarkTensor,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG
    );
    const refinedLandmarks = poseDetection_blazepose_tfjs_calculators_refine_landmarks_from_heatmap.refineLandmarksFromHeatmap(
      landmarks,
      heatmapTensor,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG
    );
    const adjustedLandmarks = poseDetection_blazepose_tfjs_calculators_remove_landmark_letterbox.removeLandmarkLetterbox(refinedLandmarks, padding);
    const landmarksProjected = poseDetection_blazepose_tfjs_calculators_calculate_landmark_projection.calculateLandmarkProjection(adjustedLandmarks, poseRect);
    const actualLandmarks = landmarksProjected.slice(0, poseDetection_blazepose_tfjs_constants.BLAZEPOSE_NUM_KEYPOINTS);
    const auxiliaryLandmarks = landmarksProjected.slice(
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_NUM_KEYPOINTS,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS
    );
    common_vendor.dispose(landmarkResult);
    common_vendor.dispose([imageTensor, imageValueShifted]);
    return { actualLandmarks, auxiliaryLandmarks, poseScore };
  }
  poseLandmarksToRoi(landmarks, imageSize) {
    const detection = poseDetection_blazepose_tfjs_calculators_landmarks_to_detection.landmarksToDetection(landmarks);
    const rawRoi = poseDetection_blazepose_tfjs_calculators_calculate_alignment_points_rects.calculateAlignmentPointsRects(detection, imageSize, {
      rotationVectorStartKeypointIndex: 0,
      rotationVectorEndKeypointIndex: 1,
      rotationVectorTargetAngleDegree: 90
    });
    const roi = poseDetection_blazepose_tfjs_calculators_transform_rect.transformNormalizedRect(
      rawRoi,
      imageSize,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG
    );
    return roi;
  }
  poseLandmarkFiltering(actualLandmarks, auxiliaryLandmarks, imageSize) {
    let actualLandmarksFiltered;
    let auxiliaryLandmarksFiltered;
    if (this.timestamp == null || !this.enableSmoothing) {
      actualLandmarksFiltered = actualLandmarks;
      auxiliaryLandmarksFiltered = auxiliaryLandmarks;
    } else {
      if (this.visibilitySmoothingFilterActual == null) {
        this.visibilitySmoothingFilterActual = new poseDetection_blazepose_tfjs_calculators_visibility_smoothing.LowPassVisibilityFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG
        );
      }
      actualLandmarksFiltered = this.visibilitySmoothingFilterActual.apply(actualLandmarks);
      if (this.visibilitySmoothingFilterAuxiliary == null) {
        this.visibilitySmoothingFilterAuxiliary = new poseDetection_blazepose_tfjs_calculators_visibility_smoothing.LowPassVisibilityFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG
        );
      }
      auxiliaryLandmarksFiltered = this.visibilitySmoothingFilterAuxiliary.apply(auxiliaryLandmarks);
      if (this.landmarksSmoothingFilterActual == null) {
        this.landmarksSmoothingFilterActual = new poseDetection_calculators_keypoints_smoothing.KeypointsSmoothingFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL
        );
      }
      actualLandmarksFiltered = this.landmarksSmoothingFilterActual.apply(
        actualLandmarksFiltered,
        this.timestamp,
        imageSize,
        true
      );
      if (this.landmarksSmoothingFilterAuxiliary == null) {
        this.landmarksSmoothingFilterAuxiliary = new poseDetection_calculators_keypoints_smoothing.KeypointsSmoothingFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY
        );
      }
      auxiliaryLandmarksFiltered = this.landmarksSmoothingFilterAuxiliary.apply(
        auxiliaryLandmarksFiltered,
        this.timestamp,
        imageSize,
        true
      );
    }
    return { actualLandmarksFiltered, auxiliaryLandmarksFiltered };
  }
}
async function load(modelConfig) {
  const config = poseDetection_blazepose_tfjs_detector_utils.validateModelConfig(modelConfig);
  const [detectorModel, landmarkModel] = await Promise.all([
    common_vendor.loadGraphModel(config.detectorModelUrl),
    common_vendor.loadGraphModel(config.landmarkModelUrl)
  ]);
  return new BlazePoseTfjsDetector(
    detectorModel,
    landmarkModel,
    config.enableSmoothing,
    config.modelType
  );
}
exports.load = load;
