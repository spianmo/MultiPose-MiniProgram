"use strict";const t=require("../../../common/vendor.js"),n=require("../../constants.js");function e(t,e,r,s){return{y:s.get(t,e,r),x:s.get(t,e,r+n.COCO_KEYPOINTS.length)}}exports.argmax2d=function(n){const[e,r,s]=n.shape;return t.tidy((()=>{const o=t.reshape(n,[e*r,s]),a=t.argMax(o,0),c=t.expandDims(t.div(a,t.scalar(r,"int32")),1),u=t.expandDims((i=a,l=r,t.tidy((()=>{const n=t.div(i,t.scalar(l,"int32"));return t.sub(i,t.mul(n,t.scalar(l,"int32")))}))),1);
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var i,l;return t.concat([c,u],1)}))},exports.getOffsetPoints=function(r,s,o){return t.tidy((()=>{const a=function(r,s){const o=[];for(let t=0;t<n.COCO_KEYPOINTS.length;t++){const n=r.get(t,0).valueOf(),a=r.get(t,1).valueOf(),{x:c,y:u}=e(n,a,t,s);o.push(u),o.push(c)}return t.tensor2d(o,[n.COCO_KEYPOINTS.length,2])}(r,o);return t.add(t.cast(t.mul(r.toTensor(),t.scalar(s,"int32")),"float32"),a)}))},exports.getPointsConfidence=function(t,n){const e=n.shape[0],r=new Float32Array(e);for(let s=0;s<e;s++){const e=n.get(s,0),o=n.get(s,1);r[s]=t.get(e,o,s)}return r};
