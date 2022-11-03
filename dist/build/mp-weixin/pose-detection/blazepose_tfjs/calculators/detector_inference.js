"use strict";const e=require("../../../common/vendor.js"),t=require("./split_detection_result.js");exports.detectorInference=
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
function(r,s){return e.tidy((()=>{const n=s.predict(r),[o,c]=t.splitDetectionResult(n);return{boxes:e.squeeze(c),scores:e.squeeze(o)}}))};
