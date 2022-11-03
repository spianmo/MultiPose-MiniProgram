"use strict";const t=require("../../common/vendor.js");
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
 */function e(e,i){t.assert(0!==e.width,(()=>`${i} width cannot be 0.`)),t.assert(0!==e.height,(()=>`${i} height cannot be 0.`))}exports.getImageSize=function(e){return e instanceof t.Tensor?{height:e.shape[0],width:e.shape[1]}:{height:e.height,width:e.width}},exports.getProjectiveTransformMatrix=function(t,i,h,n){e(n,"inputResolution");const o=1/i.width,r=1/i.height,a=t.xCenter,s=t.yCenter,g=Math.cos(t.rotation),d=Math.sin(t.rotation),w=h?-1:1,c=t.width,u=t.height;return[1/n.width*c*g*w*o*i.width,1/n.height*-u*d*o*i.width,(-.5*c*g*w+.5*u*d+a)*o*i.width,1/n.width*c*d*w*r*i.height,1/n.height*u*g*r*i.height,(-.5*u*g-.5*c*d*w+s)*r*i.height,0,0]},exports.getRoi=function(t,e){return e?{xCenter:e.xCenter*t.width,yCenter:e.yCenter*t.height,width:e.width*t.width,height:e.height*t.height,rotation:e.rotation}:{xCenter:.5*t.width,yCenter:.5*t.height,width:t.width,height:t.height,rotation:0}},exports.normalizeRadians=function(t){return t-2*Math.PI*Math.floor((t+Math.PI)/(2*Math.PI))},exports.padRoi=function(t,i,h=!1){if(!h)return{top:0,left:0,right:0,bottom:0};const n=i.height,o=i.width;e(i,"targetSize"),e(t,"roi");const r=n/o,a=t.height/t.width;let s,g,d=0,w=0;return r>a?(s=t.width,g=t.width*r,w=(1-a/r)/2):(s=t.height/r,g=t.height,d=(1-r/a)/2),t.width=s,t.height=g,{top:w,left:d,right:d,bottom:w}},exports.toImageTensor=function(e){return e instanceof t.Tensor?e:t.fromPixels(e)},exports.transformValueRange=function(t,e,i,h){const n=e-t,o=h-i;if(0===n)throw new Error(`Original min and max are both ${t}, range cannot be 0.`);const r=o/n;return{scale:r,offset:i-t*r}};
