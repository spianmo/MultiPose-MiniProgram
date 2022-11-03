"use strict";const t=require("../../calculators/image_utils.js");
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
 */exports.transformNormalizedRect=function(e,i,h){let n=e.width,r=e.height,o=e.rotation;if(null==h.rotation&&null==h.rotationDegree||(o=function(e,i){null!=i.rotation?e+=i.rotation:null!=i.rotationDegree&&(e+=Math.PI*i.rotationDegree/180);return t.normalizeRadians(e)}(o,h)),0===o)e.xCenter=e.xCenter+n*h.shiftX,e.yCenter=e.yCenter+r*h.shiftY;else{const t=(i.width*n*h.shiftX*Math.cos(o)-i.height*r*h.shiftY*Math.sin(o))/i.width,s=(i.width*n*h.shiftX*Math.sin(o)+i.height*r*h.shiftY*Math.cos(o))/i.height;e.xCenter=e.xCenter+t,e.yCenter=e.yCenter+s}if(h.squareLong){const t=Math.max(n*i.width,r*i.height);n=t/i.width,r=t/i.height}else if(h.squareShort){const t=Math.min(n*i.width,r*i.height);n=t/i.width,r=t/i.height}return e.width=n*h.scaleX,e.height=r*h.scaleY,e};
