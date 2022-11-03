"use strict";var e=Object.defineProperty,t=(t,i,o)=>(((t,i,o)=>{i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[i]=o})(t,"symbol"!=typeof i?i+"":i,o),o);const i=require("./keypoints_one_euro_filter.js"),o=require("./keypoints_to_normalized_keypoints.js"),r=require("./keypoints_velocity_filter.js"),n=require("./normalized_keypoints_to_keypoints.js");exports.KeypointsSmoothingFilter=
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
class{constructor(e){if(t(this,"keypointsFilter"),null!=e.velocityFilter)this.keypointsFilter=new r.KeypointsVelocityFilter(e.velocityFilter);else{if(null==e.oneEuroFilter)throw new Error(`Either configure velocityFilter or oneEuroFilter, but got ${e}.`);this.keypointsFilter=new i.KeypointsOneEuroFilter(e.oneEuroFilter)}}apply(e,t,i,r=!1){if(null==e)return this.keypointsFilter.reset(),null;const l=r?n.normalizedKeypointsToKeypoints(e,i):e,s=this.keypointsFilter.apply(l,t);return r?o.keypointsToNormalizedKeypoints(s,i):s}};
