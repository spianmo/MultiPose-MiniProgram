"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../../common/vendor.js");
const poseDetection_constants = require("../constants.js");
const poseDetection_shared_calculators_calculate_alignment_points_rects = require("../shared/calculators/calculate_alignment_points_rects.js");
const poseDetection_shared_calculators_calculate_inverse_matrix = require("../shared/calculators/calculate_inverse_matrix.js");
const poseDetection_shared_calculators_calculate_landmark_projection = require("../shared/calculators/calculate_landmark_projection.js");
const poseDetection_shared_calculators_calculate_score_copy = require("../shared/calculators/calculate_score_copy.js");
const poseDetection_shared_calculators_calculate_world_landmark_projection = require("../shared/calculators/calculate_world_landmark_projection.js");
const poseDetection_shared_calculators_constants = require("../shared/calculators/constants.js");
const poseDetection_shared_calculators_convert_image_to_tensor = require("../shared/calculators/convert_image_to_tensor.js");
const poseDetection_shared_calculators_create_ssd_anchors = require("../shared/calculators/create_ssd_anchors.js");
const poseDetection_shared_calculators_detector_result = require("../shared/calculators/detector_result.js");
const poseDetection_shared_calculators_image_utils = require("../shared/calculators/image_utils.js");
const poseDetection_shared_calculators_is_video = require("../shared/calculators/is_video.js");
const poseDetection_shared_calculators_landmarks_to_detection = require("../shared/calculators/landmarks_to_detection.js");
const poseDetection_shared_calculators_mask_util = require("../shared/calculators/mask_util.js");
const poseDetection_shared_calculators_non_max_suppression = require("../shared/calculators/non_max_suppression.js");
const poseDetection_shared_calculators_normalized_keypoints_to_keypoints = require("../shared/calculators/normalized_keypoints_to_keypoints.js");
const poseDetection_shared_calculators_refine_landmarks_from_heatmap = require("../shared/calculators/refine_landmarks_from_heatmap.js");
const poseDetection_shared_calculators_remove_detection_letterbox = require("../shared/calculators/remove_detection_letterbox.js");
const poseDetection_shared_calculators_remove_landmark_letterbox = require("../shared/calculators/remove_landmark_letterbox.js");
const poseDetection_shared_calculators_segmentation_smoothing = require("../shared/calculators/segmentation_smoothing.js");
const poseDetection_shared_calculators_tensors_to_detections = require("../shared/calculators/tensors_to_detections.js");
const poseDetection_shared_calculators_tensors_to_landmarks = require("../shared/calculators/tensors_to_landmarks.js");
const poseDetection_shared_calculators_tensors_to_segmentation = require("../shared/calculators/tensors_to_segmentation.js");
const poseDetection_shared_calculators_transform_rect = require("../shared/calculators/transform_rect.js");
const poseDetection_shared_filters_keypoints_smoothing = require("../shared/filters/keypoints_smoothing.js");
const poseDetection_shared_filters_visibility_smoothing = require("../shared/filters/visibility_smoothing.js");
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
class BlazePoseTfjsMask {
  constructor(mask) {
    this.mask = mask;
  }
  async toCanvasImageSource() {
    return poseDetection_shared_calculators_mask_util.toHTMLCanvasElementLossy(this.mask);
  }
  async toImageData() {
    return poseDetection_shared_calculators_mask_util.toImageDataLossy(this.mask);
  }
  async toTensor() {
    return this.mask;
  }
  getUnderlyingType() {
    return "tensor";
  }
}
function maskValueToLabel(maskValue) {
  poseDetection_shared_calculators_mask_util.assertMaskValue(maskValue);
  return "person";
}
class BlazePoseTfjsDetector {
  constructor(detectorModel, landmarkModel, enableSmoothing, enableSegmentation, smoothSegmentation2, modelType) {
    __publicField(this, "anchors");
    __publicField(this, "anchorTensor");
    __publicField(this, "maxPoses");
    __publicField(this, "timestamp");
    __publicField(this, "regionOfInterest", null);
    __publicField(this, "prevFilteredSegmentationMask", null);
    __publicField(this, "visibilitySmoothingFilterActual");
    __publicField(this, "visibilitySmoothingFilterAuxiliary");
    __publicField(this, "landmarksSmoothingFilterActual");
    __publicField(this, "landmarksSmoothingFilterAuxiliary");
    __publicField(this, "worldLandmarksSmoothingFilterActual");
    this.detectorModel = detectorModel;
    this.landmarkModel = landmarkModel;
    this.enableSmoothing = enableSmoothing;
    this.enableSegmentation = enableSegmentation;
    this.smoothSegmentation = smoothSegmentation2;
    this.modelType = modelType;
    this.anchors = poseDetection_shared_calculators_create_ssd_anchors.createSsdAnchors(poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION);
    const anchorW = common_vendor.tensor1d(this.anchors.map((a) => a.width));
    const anchorH = common_vendor.tensor1d(this.anchors.map((a) => a.height));
    const anchorX = common_vendor.tensor1d(this.anchors.map((a) => a.xCenter));
    const anchorY = common_vendor.tensor1d(this.anchors.map((a) => a.yCenter));
    this.anchorTensor = { x: anchorX, y: anchorY, w: anchorW, h: anchorH };
    this.prevFilteredSegmentationMask = this.enableSegmentation ? common_vendor.tensor2d([], [0, 0]) : null;
  }
  async estimatePoses(image, estimationConfig, timestamp) {
    const config = poseDetection_blazepose_tfjs_detector_utils.validateEstimationConfig(estimationConfig);
    if (image == null) {
      this.reset();
      return [];
    }
    this.maxPoses = config.maxPoses;
    if (timestamp != null) {
      this.timestamp = timestamp * poseDetection_shared_calculators_constants.MILLISECOND_TO_MICRO_SECONDS;
    } else {
      this.timestamp = poseDetection_shared_calculators_is_video.isVideo(image) ? image.currentTime * poseDetection_shared_calculators_constants.SECOND_TO_MICRO_SECONDS : null;
    }
    const imageSize = poseDetection_shared_calculators_image_utils.getImageSize(image);
    const image3d = common_vendor.tidy(() => common_vendor.cast(poseDetection_shared_calculators_image_utils.toImageTensor(image), "float32"));
    let poseRect = this.regionOfInterest;
    if (poseRect == null) {
      const detections = await this.detectPose(image3d);
      if (detections.length === 0) {
        this.reset();
        image3d.dispose();
        return [];
      }
      const firstDetection = detections[0];
      poseRect = this.poseDetectionToRoi(firstDetection, imageSize);
    }
    const poseLandmarksByRoiResult = await this.poseLandmarksByRoi(poseRect, image3d);
    image3d.dispose();
    if (poseLandmarksByRoiResult == null) {
      this.reset();
      return [];
    }
    const {
      landmarks: unfilteredPoseLandmarks,
      auxiliaryLandmarks: unfilteredAuxiliaryLandmarks,
      poseScore,
      worldLandmarks: unfilteredWorldLandmarks,
      segmentationMask: unfilteredSegmentationMask
    } = poseLandmarksByRoiResult;
    const {
      actualLandmarksFiltered: poseLandmarks,
      auxiliaryLandmarksFiltered: auxiliaryLandmarks,
      actualWorldLandmarksFiltered: poseWorldLandmarks
    } = this.poseLandmarkFiltering(
      unfilteredPoseLandmarks,
      unfilteredAuxiliaryLandmarks,
      unfilteredWorldLandmarks,
      imageSize
    );
    const poseRectFromLandmarks = this.poseLandmarksToRoi(auxiliaryLandmarks, imageSize);
    this.regionOfInterest = poseRectFromLandmarks;
    const filteredSegmentationMask = this.smoothSegmentation && unfilteredSegmentationMask != null ? this.poseSegmentationFiltering(unfilteredSegmentationMask) : unfilteredSegmentationMask;
    const keypoints = poseLandmarks != null ? poseDetection_shared_calculators_normalized_keypoints_to_keypoints.normalizedKeypointsToKeypoints(poseLandmarks, imageSize) : null;
    if (keypoints != null) {
      keypoints.forEach((keypoint, i) => {
        keypoint.name = poseDetection_constants.BLAZEPOSE_KEYPOINTS[i];
      });
    }
    const keypoints3D = poseWorldLandmarks;
    if (keypoints3D != null) {
      keypoints3D.forEach((keypoint3D, i) => {
        keypoint3D.name = poseDetection_constants.BLAZEPOSE_KEYPOINTS[i];
      });
    }
    const pose = { score: poseScore, keypoints, keypoints3D };
    if (filteredSegmentationMask !== null) {
      const rgbaMask = common_vendor.tidy(() => {
        const mask3D = common_vendor.expandDims(filteredSegmentationMask, 2);
        const rgMask = common_vendor.pad(mask3D, [[0, 0], [0, 0], [0, 1]]);
        return common_vendor.mirrorPad(rgMask, [[0, 0], [0, 0], [0, 2]], "symmetric");
      });
      if (!this.smoothSegmentation) {
        common_vendor.dispose(filteredSegmentationMask);
      }
      const segmentation = {
        maskValueToLabel,
        mask: new BlazePoseTfjsMask(rgbaMask)
      };
      pose.segmentation = segmentation;
    }
    return [pose];
  }
  poseSegmentationFiltering(segmentationMask) {
    const prevMask = this.prevFilteredSegmentationMask;
    if (prevMask.size === 0) {
      this.prevFilteredSegmentationMask = segmentationMask;
    } else {
      this.prevFilteredSegmentationMask = poseDetection_shared_calculators_segmentation_smoothing.smoothSegmentation(
        prevMask,
        segmentationMask,
        poseDetection_blazepose_tfjs_constants.BLAZEPOSE_SEGMENTATION_SMOOTHING_CONFIG
      );
      common_vendor.dispose(segmentationMask);
    }
    common_vendor.dispose(prevMask);
    return this.prevFilteredSegmentationMask;
  }
  dispose() {
    this.detectorModel.dispose();
    this.landmarkModel.dispose();
    common_vendor.dispose([
      this.anchorTensor.x,
      this.anchorTensor.y,
      this.anchorTensor.w,
      this.anchorTensor.h,
      this.prevFilteredSegmentationMask
    ]);
  }
  reset() {
    this.regionOfInterest = null;
    if (this.enableSegmentation) {
      common_vendor.dispose(this.prevFilteredSegmentationMask);
      this.prevFilteredSegmentationMask = common_vendor.tensor2d([], [0, 0]);
    }
    this.visibilitySmoothingFilterActual = null;
    this.visibilitySmoothingFilterAuxiliary = null;
    this.landmarksSmoothingFilterActual = null;
    this.landmarksSmoothingFilterAuxiliary = null;
  }
  async detectPose(image) {
    const { imageTensor: imageValueShifted, padding } = poseDetection_shared_calculators_convert_image_to_tensor.convertImageToTensor(
      image,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG
    );
    const detectionResult = this.detectorModel.predict(imageValueShifted);
    const { boxes, logits } = poseDetection_shared_calculators_detector_result.detectorResult(detectionResult);
    const detections = await poseDetection_shared_calculators_tensors_to_detections.tensorsToDetections(
      [logits, boxes],
      this.anchorTensor,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION
    );
    if (detections.length === 0) {
      common_vendor.dispose([imageValueShifted, detectionResult, logits, boxes]);
      return detections;
    }
    const selectedDetections = await poseDetection_shared_calculators_non_max_suppression.nonMaxSuppression(
      detections,
      this.maxPoses,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION.minSuppressionThreshold
    );
    const newDetections = poseDetection_shared_calculators_remove_detection_letterbox.removeDetectionLetterbox(selectedDetections, padding);
    common_vendor.dispose([imageValueShifted, detectionResult, logits, boxes]);
    return newDetections;
  }
  poseDetectionToRoi(detection, imageSize) {
    let startKeypointIndex;
    let endKeypointIndex;
    startKeypointIndex = 0;
    endKeypointIndex = 1;
    const rawRoi = poseDetection_shared_calculators_calculate_alignment_points_rects.calculateAlignmentPointsRects(detection, imageSize, {
      rotationVectorEndKeypointIndex: endKeypointIndex,
      rotationVectorStartKeypointIndex: startKeypointIndex,
      rotationVectorTargetAngleDegree: 90
    });
    const roi = poseDetection_shared_calculators_transform_rect.transformNormalizedRect(
      rawRoi,
      imageSize,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG
    );
    return roi;
  }
  async poseLandmarksByRoi(roi, image) {
    const imageSize = poseDetection_shared_calculators_image_utils.getImageSize(image);
    const {
      imageTensor: imageValueShifted,
      padding: letterboxPadding,
      transformationMatrix
    } = poseDetection_shared_calculators_convert_image_to_tensor.convertImageToTensor(
      image,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG,
      roi
    );
    if (this.modelType !== "lite" && this.modelType !== "full" && this.modelType !== "heavy") {
      throw new Error(
        `Model type must be one of lite, full or heavy,but got ${this.modelType}`
      );
    }
    const outputs = ["ld_3d", "output_poseflag", "activation_heatmap", "world_3d"];
    if (this.enableSegmentation) {
      outputs.push("activation_segmentation");
    }
    const outputTensor = this.landmarkModel.execute(imageValueShifted, outputs);
    const tensorsToPoseLandmarksAndSegmentationResult = await this.tensorsToPoseLandmarksAndSegmentation(outputTensor);
    if (tensorsToPoseLandmarksAndSegmentationResult == null) {
      common_vendor.dispose(outputTensor);
      common_vendor.dispose(imageValueShifted);
      return null;
    }
    const {
      landmarks: roiLandmarks,
      auxiliaryLandmarks: roiAuxiliaryLandmarks,
      poseScore,
      worldLandmarks: roiWorldLandmarks,
      segmentationMask: roiSegmentationMask
    } = tensorsToPoseLandmarksAndSegmentationResult;
    const poseLandmarksAndSegmentationInverseProjectionResults = await this.poseLandmarksAndSegmentationInverseProjection(
      imageSize,
      roi,
      letterboxPadding,
      transformationMatrix,
      roiLandmarks,
      roiAuxiliaryLandmarks,
      roiWorldLandmarks,
      roiSegmentationMask
    );
    common_vendor.dispose(outputTensor);
    common_vendor.dispose(imageValueShifted);
    return { poseScore, ...poseLandmarksAndSegmentationInverseProjectionResults };
  }
  async poseLandmarksAndSegmentationInverseProjection(imageSize, roi, letterboxPadding, transformationMatrix, roiLandmarks, roiAuxiliaryLandmarks, roiWorldLandmarks, roiSegmentationMask) {
    const adjustedLandmarks = poseDetection_shared_calculators_remove_landmark_letterbox.removeLandmarkLetterbox(roiLandmarks, letterboxPadding);
    const adjustedAuxiliaryLandmarks = poseDetection_shared_calculators_remove_landmark_letterbox.removeLandmarkLetterbox(roiAuxiliaryLandmarks, letterboxPadding);
    const landmarks = poseDetection_shared_calculators_calculate_landmark_projection.calculateLandmarkProjection(adjustedLandmarks, roi);
    const auxiliaryLandmarks = poseDetection_shared_calculators_calculate_landmark_projection.calculateLandmarkProjection(adjustedAuxiliaryLandmarks, roi);
    const worldLandmarks = poseDetection_shared_calculators_calculate_world_landmark_projection.calculateWorldLandmarkProjection(roiWorldLandmarks, roi);
    let segmentationMask = null;
    if (this.enableSegmentation) {
      segmentationMask = common_vendor.tidy(() => {
        const [inputHeight, inputWidth] = roiSegmentationMask.shape;
        const inverseTransformationMatrix = poseDetection_shared_calculators_calculate_inverse_matrix.calculateInverseMatrix(transformationMatrix);
        const projectiveTransform = common_vendor.tensor2d(
          poseDetection_shared_calculators_image_utils.getProjectiveTransformMatrix(
            inverseTransformationMatrix,
            { width: inputWidth, height: inputHeight },
            imageSize
          ),
          [1, 8]
        );
        const shape4D = [1, inputHeight, inputWidth, 1];
        return common_vendor.squeeze(
          common_vendor.image.transform(
            common_vendor.reshape(roiSegmentationMask, shape4D),
            projectiveTransform,
            "bilinear",
            "constant",
            0,
            [imageSize.height, imageSize.width]
          ),
          [0, 3]
        );
      });
      common_vendor.dispose(roiSegmentationMask);
    }
    return { landmarks, auxiliaryLandmarks, worldLandmarks, segmentationMask };
  }
  async tensorsToPoseLandmarksAndSegmentation(tensors) {
    const landmarkTensor = tensors[0], poseFlagTensor = tensors[1], heatmapTensor = tensors[2], worldLandmarkTensor = tensors[3], segmentationTensor = this.enableSegmentation ? tensors[4] : null;
    const poseScore = (await poseFlagTensor.data())[0];
    if (poseScore < poseDetection_blazepose_tfjs_constants.BLAZEPOSE_POSE_PRESENCE_SCORE) {
      return null;
    }
    const rawLandmarks = await poseDetection_shared_calculators_tensors_to_landmarks.tensorsToLandmarks(
      landmarkTensor,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG
    );
    const allLandmarks = await poseDetection_shared_calculators_refine_landmarks_from_heatmap.refineLandmarksFromHeatmap(
      rawLandmarks,
      heatmapTensor,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG
    );
    const landmarks = allLandmarks.slice(0, poseDetection_blazepose_tfjs_constants.BLAZEPOSE_NUM_KEYPOINTS);
    const auxiliaryLandmarks = allLandmarks.slice(
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_NUM_KEYPOINTS,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS
    );
    const allWorldLandmarks = await poseDetection_shared_calculators_tensors_to_landmarks.tensorsToLandmarks(
      worldLandmarkTensor,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_TENSORS_TO_WORLD_LANDMARKS_CONFIG
    );
    const worldLandmarksWithoutVisibility = allWorldLandmarks.slice(0, poseDetection_blazepose_tfjs_constants.BLAZEPOSE_NUM_KEYPOINTS);
    const worldLandmarks = poseDetection_shared_calculators_calculate_score_copy.calculateScoreCopy(landmarks, worldLandmarksWithoutVisibility, true);
    const segmentationMask = this.enableSegmentation ? poseDetection_shared_calculators_tensors_to_segmentation.tensorsToSegmentation(
      segmentationTensor,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_TENSORS_TO_SEGMENTATION_CONFIG
    ) : null;
    return {
      landmarks,
      auxiliaryLandmarks,
      poseScore,
      worldLandmarks,
      segmentationMask
    };
  }
  poseLandmarksToRoi(landmarks, imageSize) {
    const detection = poseDetection_shared_calculators_landmarks_to_detection.landmarksToDetection(landmarks);
    const rawRoi = poseDetection_shared_calculators_calculate_alignment_points_rects.calculateAlignmentPointsRects(detection, imageSize, {
      rotationVectorStartKeypointIndex: 0,
      rotationVectorEndKeypointIndex: 1,
      rotationVectorTargetAngleDegree: 90
    });
    const roi = poseDetection_shared_calculators_transform_rect.transformNormalizedRect(
      rawRoi,
      imageSize,
      poseDetection_blazepose_tfjs_constants.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG
    );
    return roi;
  }
  poseLandmarkFiltering(actualLandmarks, auxiliaryLandmarks, actualWorldLandmarks, imageSize) {
    let actualLandmarksFiltered;
    let auxiliaryLandmarksFiltered;
    let actualWorldLandmarksFiltered;
    if (this.timestamp == null || !this.enableSmoothing) {
      actualLandmarksFiltered = actualLandmarks;
      auxiliaryLandmarksFiltered = auxiliaryLandmarks;
      actualWorldLandmarksFiltered = actualWorldLandmarks;
    } else {
      const auxDetection = poseDetection_shared_calculators_landmarks_to_detection.landmarksToDetection(auxiliaryLandmarks);
      const objectScaleROI = poseDetection_shared_calculators_calculate_alignment_points_rects.calculateAlignmentPointsRects(auxDetection, imageSize, {
        rotationVectorEndKeypointIndex: 0,
        rotationVectorStartKeypointIndex: 1,
        rotationVectorTargetAngleDegree: 90
      });
      if (this.visibilitySmoothingFilterActual == null) {
        this.visibilitySmoothingFilterActual = new poseDetection_shared_filters_visibility_smoothing.LowPassVisibilityFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG
        );
      }
      actualLandmarksFiltered = this.visibilitySmoothingFilterActual.apply(actualLandmarks);
      if (this.visibilitySmoothingFilterAuxiliary == null) {
        this.visibilitySmoothingFilterAuxiliary = new poseDetection_shared_filters_visibility_smoothing.LowPassVisibilityFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG
        );
      }
      auxiliaryLandmarksFiltered = this.visibilitySmoothingFilterAuxiliary.apply(auxiliaryLandmarks);
      actualWorldLandmarksFiltered = this.visibilitySmoothingFilterActual.apply(actualWorldLandmarks);
      if (this.landmarksSmoothingFilterActual == null) {
        this.landmarksSmoothingFilterActual = new poseDetection_shared_filters_keypoints_smoothing.KeypointsSmoothingFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL
        );
      }
      actualLandmarksFiltered = this.landmarksSmoothingFilterActual.apply(
        actualLandmarksFiltered,
        this.timestamp,
        imageSize,
        true,
        objectScaleROI
      );
      if (this.landmarksSmoothingFilterAuxiliary == null) {
        this.landmarksSmoothingFilterAuxiliary = new poseDetection_shared_filters_keypoints_smoothing.KeypointsSmoothingFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY
        );
      }
      auxiliaryLandmarksFiltered = this.landmarksSmoothingFilterAuxiliary.apply(
        auxiliaryLandmarksFiltered,
        this.timestamp,
        imageSize,
        true,
        objectScaleROI
      );
      if (this.worldLandmarksSmoothingFilterActual == null) {
        this.worldLandmarksSmoothingFilterActual = new poseDetection_shared_filters_keypoints_smoothing.KeypointsSmoothingFilter(
          poseDetection_blazepose_tfjs_constants.BLAZEPOSE_WORLD_LANDMARKS_SMOOTHING_CONFIG_ACTUAL
        );
      }
      actualWorldLandmarksFiltered = this.worldLandmarksSmoothingFilterActual.apply(
        actualWorldLandmarks,
        this.timestamp
      );
    }
    return {
      actualLandmarksFiltered,
      auxiliaryLandmarksFiltered,
      actualWorldLandmarksFiltered
    };
  }
}
async function load(modelConfig) {
  const config = poseDetection_blazepose_tfjs_detector_utils.validateModelConfig(modelConfig);
  const detectorFromTFHub = typeof config.detectorModelUrl === "string" && config.detectorModelUrl.indexOf("https://tfhub.dev") > -1;
  const landmarkFromTFHub = typeof config.landmarkModelUrl === "string" && config.landmarkModelUrl.indexOf("https://tfhub.dev") > -1;
  const [detectorModel, landmarkModel] = await Promise.all([
    common_vendor.loadGraphModel(
      config.detectorModelUrl,
      { fromTFHub: detectorFromTFHub }
    ),
    common_vendor.loadGraphModel(
      config.landmarkModelUrl,
      { fromTFHub: landmarkFromTFHub }
    )
  ]);
  return new BlazePoseTfjsDetector(
    detectorModel,
    landmarkModel,
    config.enableSmoothing,
    config.enableSegmentation,
    config.smoothSegmentation,
    config.modelType
  );
}
exports.load = load;
