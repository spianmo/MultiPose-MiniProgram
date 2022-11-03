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
 */function o(e,o,s,i,t,n,r){return{score:[t],ind:r,locationData:{relativeBoundingBox:{xMin:o,yMin:n?1-s:e,xMax:i,yMax:n?1-e:s,width:i-o,height:s-e}}}}exports.tensorsToDetections=function(s,i,t){const n=s[0],r=function(o,s,i){return e.tidy((()=>{let t,n,r,u;i.reverseOutputOrder?(n=e.squeeze(e.slice(o,[0,i.boxCoordOffset+0],[-1,1])),t=e.squeeze(e.slice(o,[0,i.boxCoordOffset+1],[-1,1])),u=e.squeeze(e.slice(o,[0,i.boxCoordOffset+2],[-1,1])),r=e.squeeze(e.slice(o,[0,i.boxCoordOffset+3],[-1,1]))):(t=e.squeeze(e.slice(o,[0,i.boxCoordOffset+0],[-1,1])),n=e.squeeze(e.slice(o,[0,i.boxCoordOffset+1],[-1,1])),r=e.squeeze(e.slice(o,[0,i.boxCoordOffset+2],[-1,1])),u=e.squeeze(e.slice(o,[0,i.boxCoordOffset+3],[-1,1]))),n=e.add(e.mul(e.div(n,i.xScale),s.w),s.x),t=e.add(e.mul(e.div(t,i.yScale),s.h),s.y),i.applyExponentialOnBoxSize?(r=e.mul(e.exp(e.div(r,i.hScale)),s.h),u=e.mul(e.exp(e.div(u,i.wScale)),s.w)):(r=e.mul(e.div(r,i.hScale),s.h),u=e.mul(e.div(u,i.wScale),s.h));const l=e.sub(t,e.div(r,2)),c=e.sub(n,e.div(u,2)),d=e.add(t,e.div(r,2)),a=e.add(n,e.div(u,2));let p=e.concat([e.reshape(l,[i.numBoxes,1]),e.reshape(c,[i.numBoxes,1]),e.reshape(d,[i.numBoxes,1]),e.reshape(a,[i.numBoxes,1])],1);if(i.numKeypoints)for(let f=0;f<i.numKeypoints;++f){const t=i.keypointCoordOffset+f*i.numValuesPerKeypoint;let n,r;i.reverseOutputOrder?(n=e.squeeze(e.slice(o,[0,t],[-1,1])),r=e.squeeze(e.slice(o,[0,t+1],[-1,1]))):(r=e.squeeze(e.slice(o,[0,t],[-1,1])),n=e.squeeze(e.slice(o,[0,t+1],[-1,1])));const u=e.add(e.mul(e.div(n,i.xScale),s.w),s.x),l=e.add(e.mul(e.div(r,i.yScale),s.h),s.y);p=e.concat([p,e.reshape(u,[i.numBoxes,1]),e.reshape(l,[i.numBoxes,1])],1)}return p}))}(s[1],i,t),u=e.tidy((()=>{let o=n;return t.sigmoidScore?(null!=t.scoreClippingThresh&&(o=e.clipByValue(n,-t.scoreClippingThresh,t.scoreClippingThresh)),o=e.sigmoid(o),o):o})),l=function(e,s,i){const t=[],n=e.dataSync(),r=s.dataSync();for(let u=0;u<i.numBoxes;++u){if(null!=i.minScoreThresh&&r[u]<i.minScoreThresh)continue;const e=u*i.numCoords,s=o(n[e+0],n[e+1],n[e+2],n[e+3],r[u],i.flipVertically,u),l=s.locationData.relativeBoundingBox;if(!(l.width<0||l.height<0)){if(i.numKeypoints>0){const o=s.locationData;o.relativeKeypoints=[];const t=i.numKeypoints*i.numValuesPerKeypoint;for(let s=0;s<t;s+=i.numValuesPerKeypoint){const t=e+i.keypointCoordOffset+s,r={x:n[t+0],y:i.flipVertically?1-n[t+1]:n[t+1]};o.relativeKeypoints.push(r)}}t.push(s)}}return t}(r,u,t);return e.dispose([r,u]),l};
