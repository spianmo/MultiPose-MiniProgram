"use strict";const t=require("../../calculators/sigmoid.js");
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
 */exports.tensorsToLandmarks=function(n,e,i=!1,s=!1){const a=n.size/e.numLandmarks,o=n.dataSync(),r=[];for(let m=0;m<e.numLandmarks;++m){const n=m*a,u={x:0,y:0};u.x=i?e.inputImageWidth-o[n]:o[n],a>1&&(u.y=s?e.inputImageHeight-o[n+1]:o[n+1]),a>2&&(u.z=o[n+2]),a>3&&(u.score=t.sigmoid(o[n+3])),r.push(u)}for(let t=0;t<r.length;++t){const n=r[t];n.x=n.x/e.inputImageWidth,n.y=n.y/e.inputImageHeight,n.z=n.z/e.inputImageWidth/(e.normalizeZ||1)}return r};
