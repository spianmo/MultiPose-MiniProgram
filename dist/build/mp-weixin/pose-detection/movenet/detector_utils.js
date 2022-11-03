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
 */exports.validateEstimationConfig=function(o){const n=null==o?e.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG:{...o};if(n.maxPoses||(n.maxPoses=1),n.maxPoses<=0||n.maxPoses>1)throw new Error(`Invalid maxPoses ${n.maxPoses}. Should be 1.`);return n},exports.validateModelConfig=function(o){const n=null==o?e.MOVENET_CONFIG:{...o};if(o.modelType){if(e.VALID_MODELS.indexOf(n.modelType)<0)throw new Error(`Invalid architecture ${n.modelType}. Should be one of ${e.VALID_MODELS}`)}else o.modelType="SinglePose.Lightning";return null==n.enableSmoothing&&(n.enableSmoothing=!0),n};
