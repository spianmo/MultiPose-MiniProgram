"use strict";const e=require("./blazepose_tfjs/detector.js"),t=require("./movenet/detector.js"),r=require("./posenet/detector.js"),o=require("./types.js");exports.createDetector=
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
async function(s,n){switch(s){case o.SupportedModels.PoseNet:return r.load(n);case o.SupportedModels.BlazePose:const u=n;let d;if(null!=u){if("tfjs"===u.runtime)return e.load(n);d=u.runtime}throw new Error(`Expect modelConfig.runtime to be either 'tfjs' or 'mediapipe', but got ${d}`);case o.SupportedModels.MoveNet:return t.load(n);default:throw new Error(`${s} is not a supported model name.`)}};
