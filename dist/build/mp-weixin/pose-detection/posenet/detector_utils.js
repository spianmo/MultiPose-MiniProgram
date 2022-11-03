"use strict";const t=require("../../common/vendor.js"),e=require("./constants.js");function r(t,e){return(t-1)%e==0}exports.assertValidOutputStride=function(r){t.assert(e.VALID_OUTPUT_STRIDES.indexOf(r)>=0,(()=>`outputStride of ${r} is invalid. It must be either 8 or 16.`))},exports.assertValidResolution=function(e,i){t.assert(r(e.height,i),(()=>`height of ${e.height} is invalid for output stride ${i}.`)),t.assert(r(e.width,i),(()=>`width of ${e.width} is invalid for output stride ${i}.`))},exports.validateEstimationConfig=function(t){let r=t;if(null==r.maxPoses&&(r.maxPoses=1),r.maxPoses<=0)throw new Error(`Invalid maxPoses ${r.maxPoses}. Should be > 0.`);if(r.maxPoses>1){if(r={...e.MULTI_PERSON_ESTIMATION_CONFIG,...r},r.scoreThreshold<0||r.scoreThreshold>1)throw new Error(`Invalid scoreThreshold ${r.scoreThreshold}. Should be in range [0.0, 1.0]`);if(r.nmsRadius<=0)throw new Error(`Invalid nmsRadius ${r.nmsRadius}.`)}return r},exports.validateModelConfig=
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
function(t){const r=t||e.MOBILENET_V1_CONFIG;if(null==r.architecture&&(r.architecture="MobileNetV1"),e.VALID_ARCHITECTURE.indexOf(r.architecture)<0)throw new Error(`Invalid architecture ${r.architecture}. Should be one of ${e.VALID_ARCHITECTURE}`);if(null==r.inputResolution&&(r.inputResolution={height:257,width:257}),null==r.outputStride&&(r.outputStride=16),e.VALID_STRIDE[r.architecture].indexOf(r.outputStride)<0)throw new Error(`Invalid outputStride ${r.outputStride}. Should be one of ${e.VALID_STRIDE[r.architecture]} for architecture ${r.architecture}.`);if(null==r.multiplier&&(r.multiplier=1),e.VALID_MULTIPLIER[r.architecture].indexOf(r.multiplier)<0)throw new Error(`Invalid multiplier ${r.multiplier}. Should be one of ${e.VALID_MULTIPLIER[r.architecture]} for architecture ${r.architecture}.`);if(null==r.quantBytes&&(r.quantBytes=4),e.VALID_QUANT_BYTES.indexOf(r.quantBytes)<0)throw new Error(`Invalid quantBytes ${r.quantBytes}. Should be one of ${e.VALID_QUANT_BYTES} for architecture ${r.architecture}.`);if("MobileNetV1"===r.architecture&&32===r.outputStride&&1!==r.multiplier)throw new Error("When using an output stride of 32, you must select 1 as the multiplier.");return r};
