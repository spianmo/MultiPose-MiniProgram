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
 */function e(e,t,s,h){return 1===h?.5*(e+t):e+(t-e)*s/(h-1)}exports.createSsdAnchors=function(t){const s=[];let h=0;for(;h<t.numLayers;){const i=[],r=[],n=[],a=[];let o=h;for(;o<t.strides.length&&t.strides[o]===t.strides[h];){const s=e(t.minScale,t.maxScale,o,t.strides.length);if(0===o&&t.reduceBoxesInLowestLayer)n.push(1),n.push(2),n.push(.5),a.push(.1),a.push(s),a.push(s);else{for(let e=0;e<t.aspectRatios.length;++e)n.push(t.aspectRatios[e]),a.push(s);if(t.interpolatedScaleAspectRatio>0){const h=o===t.strides.length-1?1:e(t.minScale,t.maxScale,o+1,t.strides.length);a.push(Math.sqrt(s*h)),n.push(t.interpolatedScaleAspectRatio)}}o++}for(let e=0;e<n.length;++e){const t=Math.sqrt(n[e]);i.push(a[e]/t),r.push(a[e]*t)}let c=0,l=0;if(t.featureMapHeight.length>0)c=t.featureMapHeight[h],l=t.featureMapWidth[h];else{const e=t.strides[h];c=Math.ceil(t.inputSizeHeight/e),l=Math.ceil(t.inputSizeWidth/e)}for(let e=0;e<c;++e)for(let h=0;h<l;++h)for(let n=0;n<i.length;++n){const a={xCenter:(h+t.anchorOffsetX)/l,yCenter:(e+t.anchorOffsetY)/c,width:0,height:0};t.fixedAnchorSize?(a.width=1,a.height=1):(a.width=r[n],a.height=i[n]),s.push(a)}h=o}return s};
