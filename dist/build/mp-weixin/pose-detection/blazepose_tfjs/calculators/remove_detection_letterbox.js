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
 */exports.removeDetectionLetterbox=function(t=[],e){const o=e.left,i=e.top,n=e.left+e.right,a=e.top+e.bottom;for(let l=0;l<t.length;l++){const e=t[l],r=e.locationData.relativeBoundingBox,c=(r.xMin-o)/(1-n),h=(r.yMin-i)/(1-a),s=r.width/(1-n),x=r.height/(1-a);r.xMin=c,r.yMin=h,r.width=s,r.height=x;for(let t=0;t<e.locationData.relativeKeypoints.length;++t){const l=e.locationData.relativeKeypoints[t],r=(l.x-o)/(1-n),c=(l.y-i)/(1-a);l.x=r,l.y=c}}return t};
