"use strict";const e=require("../../../common/vendor.js");
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
 */exports.refineLandmarksFromHeatmap=function(t,n,o){const r=e.squeeze(n,[0]),[a,s,c]=r.shape;if(t.length!==c)throw new Error("Expected heatmap to have same number of channels as the number of landmarks.");const h=[],m=r.bufferSync();for(let e=0;e<t.length;e++){const n={...t[e]};h.push(n);const r=Math.trunc(n.x*s),c=Math.trunc(n.y*a);if(r<0||r>=s||c<0||r>=a)continue;const i=Math.trunc((o.kernelSize-1)/2),f=Math.max(0,r-i),u=Math.min(s,r+i+1),l=Math.max(0,c-i),M=Math.min(a,c+i+1);let p=0,x=0,d=0,b=0;for(let t=l;t<M;++t)for(let n=f;n<u;++n){const o=m.get(t,n,e);p+=o,b=Math.max(b,o),x+=n*o,d+=t*o}b>=o.minConfidenceToRefine&&p>0&&(n.x=x/s/p,n.y=d/a/p)}return r.dispose(),h};
