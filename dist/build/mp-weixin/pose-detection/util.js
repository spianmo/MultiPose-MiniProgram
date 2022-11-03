"use strict";const e=require("./constants.js"),t=require("./types.js");exports.getAdjacentPairs=function(o){switch(o){case t.SupportedModels.BlazePose:return e.BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS;case t.SupportedModels.PoseNet:case t.SupportedModels.MoveNet:return e.COCO_CONNECTED_KEYPOINTS_PAIRS;default:throw new Error(`Model ${o} is not supported.`)}},exports.getKeypointIndexByName=function(o){switch(o){case t.SupportedModels.BlazePose:return e.BLAZEPOSE_KEYPOINTS.reduce(((e,t,o)=>(e[t]=o,e)),{});case t.SupportedModels.PoseNet:case t.SupportedModels.MoveNet:return e.COCO_KEYPOINTS.reduce(((e,t,o)=>(e[t]=o,e)),{});default:throw new Error(`Model ${o} is not supported.`)}},exports.getKeypointIndexBySide=
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
function(o){switch(o){case t.SupportedModels.BlazePose:return e.BLAZEPOSE_KEYPOINTS_BY_SIDE;case t.SupportedModels.PoseNet:case t.SupportedModels.MoveNet:return e.COCO_KEYPOINTS_BY_SIDE;default:throw new Error(`Model ${o} is not supported.`)}};
