"use strict";const e=require("../../common/vendor.js"),t=require("./image_utils.js");exports.convertImageToTensor=
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
function(o,r,i){const{inputResolution:n,keepAspectRatio:s}=r,a=t.getImageSize(o),g=t.getRoi(a,i),m=t.padRoi(g,n,s);return{imageTensor:e.tidy((()=>{const r=t.toImageTensor(o),i=e.tensor2d(t.getProjectiveTransformMatrix(g,a,!1,n),[1,8]);return e.image.transform(e.expandDims(e.cast(r,"float32")),i,"bilinear","nearest",0,[n.height,n.width])})),padding:m}};
