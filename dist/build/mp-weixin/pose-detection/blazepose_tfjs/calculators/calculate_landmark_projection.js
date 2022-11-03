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
 */exports.calculateLandmarkProjection=function(t,o,n={ignoreRotation:!1}){const e=[];for(const i of t){const t=i.x-.5,r=i.y-.5,s=n.ignoreRotation?0:o.rotation;let a=Math.cos(s)*t-Math.sin(s)*r,c=Math.sin(s)*t+Math.cos(s)*r;a=a*o.width+o.xCenter,c=c*o.height+o.yCenter;const h=i.z*o.width,u={...i};u.x=a,u.y=c,u.z=h,e.push(u)}return e};
