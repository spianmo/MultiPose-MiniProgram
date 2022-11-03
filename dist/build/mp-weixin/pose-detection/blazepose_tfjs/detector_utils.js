"use strict";const e=require("./constants.js");
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
 */exports.validateEstimationConfig=function(l){let o;if(o=null==l?e.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG:{...l},null==o.maxPoses&&(o.maxPoses=1),o.maxPoses<=0)throw new Error(`Invalid maxPoses ${o.maxPoses}. Should be > 0.`);if(o.maxPoses>1)throw new Error("Multi-pose detection is not implemented yet. Please set maxPoses to 1.");return o},exports.validateModelConfig=function(l){const o=null==l?{...e.DEFAULT_BLAZEPOSE_MODEL_CONFIG}:{...l};if(null==o.enableSmoothing&&(o.enableSmoothing=e.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSmoothing),null==o.modelType&&(o.modelType=e.DEFAULT_BLAZEPOSE_MODEL_CONFIG.modelType),null==o.detectorModelUrl&&(o.detectorModelUrl=e.DEFAULT_BLAZEPOSE_MODEL_CONFIG.detectorModelUrl),null==o.landmarkModelUrl)switch(o.modelType){case"lite":o.landmarkModelUrl=e.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE;break;case"heavy":o.landmarkModelUrl=e.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY;break;default:o.landmarkModelUrl=e.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL}return o};
