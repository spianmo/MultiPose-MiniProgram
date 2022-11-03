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
 */const e={runtime:"tfjs",modelType:"full",enableSmoothing:!0,detectorModelUrl:"http://oss.cache.ren/img/blazepose/detector/f16/model.json",landmarkModelUrl:"http://oss.cache.ren/img/blazepose/landmark/full-f16/model.json"};exports.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION={reduceBoxesInLowestlayer:!1,interpolatedScaleAspectRatio:1,featureMapHeight:[],featureMapWidth:[],numLayers:5,minScale:.1484375,maxScale:.75,inputSizeHeight:224,inputSizeWidth:224,anchorOffsetX:.5,anchorOffsetY:.5,strides:[8,16,32,32,32],aspectRatios:[1],fixedAnchorSize:!0},exports.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG={inputResolution:{width:224,height:224},keepAspectRatio:!0},exports.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION={minScoreThreshold:-1,minSuppressionThreshold:.3},exports.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG={shiftX:0,shiftY:0,scaleX:1.25,scaleY:1.25,squareLong:!0},exports.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL={oneEuroFilter:{frequency:30,minCutOff:.1,beta:40,derivateCutOff:1,minAllowedObjectScale:1e-6}},exports.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY={oneEuroFilter:{frequency:30,minCutOff:.01,beta:1,derivateCutOff:1,minAllowedObjectScale:1e-6}},exports.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG={inputResolution:{width:256,height:256},keepAspectRatio:!0},exports.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS=35,exports.BLAZEPOSE_NUM_KEYPOINTS=33,exports.BLAZEPOSE_POSE_PRESENCE_SCORE=.5,exports.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG={kernelSize:7,minConfidenceToRefine:.5},exports.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION={applyExponentialOnBoxSize:!1,flipVertically:!1,ignoreClasses:[],numClasses:1,numBoxes:2254,numCoords:12,boxCoordOffset:0,keypointCoordOffset:4,numKeypoints:4,numValuesPerKeypoint:2,sigmoidScore:!0,scoreClippingThresh:100,reverseOutputOrder:!0,xScale:224,yScale:224,hScale:224,wScale:224,minScoreThresh:.5},exports.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG={numLandmarks:39,inputImageWidth:256,inputImageHeight:256},exports.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG={alpha:.1},exports.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG={maxPoses:1,flipHorizontal:!1},exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL="http://oss.cache.ren/img/blazepose/landmark/full-f16/model.json",exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY="http://oss.cache.ren/img/blazepose/landmark/heavy-f16/model.json",exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE="http://oss.cache.ren/img/blazepose/landmark/lite-f16/model.json",exports.DEFAULT_BLAZEPOSE_MODEL_CONFIG=e;
