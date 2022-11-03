"use strict";const t=require("../../constants.js"),n=require("../constants.js");function e(t,e,r,o){return{y:o.get(t,e,r),x:o.get(t,e,r+n.NUM_KEYPOINTS)}}function r(t,n,r){const{heatmapY:o,heatmapX:s,id:c}=t,{y:u,x:x}=e(o,s,c,r);return{x:t.heatmapX*n+x,y:t.heatmapY*n+u}}function o(t,n,{x:e,y:r},o){return t.some((({keypoints:t})=>function(t,n,e,r){const o=e-t,s=r-n;return o*o+s*s}(r,e,t[o].y,t[o].x)<=n))}const s=t.COCO_KEYPOINTS.reduce(((t,n,e)=>(t[n]=e,t)),{}),c=n.POSE_CHAIN.map((([t,n])=>[s[t],s[n]])),u=c.map((([,t])=>t)),x=c.map((([t])=>t));function y(t,n,e){return t<n?n:t>e?e:t}function a(t,n,e,r){return{y:y(Math.round(t.y/n),0,e-1),x:y(Math.round(t.x/n),0,r-1)}}function i(t,n){return{x:t.x+n.x,y:t.y+n.y}}function f(n,r,o,s,c,u,x,y=2){const[f,p]=s.shape,m={y:r.y,x:r.x},d=function(t,n,e){const r=e.shape[2]/2;return{y:e.get(n.y,n.x,t),x:e.get(n.y,n.x,r+t)}}(n,a(m,u,f,p),x);let h=i(m,d);for(let t=0;t<y;t++){const t=a(h,u,f,p),n=e(t.y,t.x,o,c);h=i({x:t.x*u,y:t.y*u},{x:n.x,y:n.y})}const O=a(h,u,f,p),g=s.get(O.y,O.x,o);return{y:h.y,x:h.x,name:t.COCO_KEYPOINTS[o],score:g}}exports.decodePose=function(n,e,o,s,c,y){const a=e.shape[2],i=u.length,p=new Array(a),{part:m,score:d}=n,h=r(m,s,o);p[m.id]={score:d,name:t.COCO_KEYPOINTS[m.id],y:h.y,x:h.x};for(let t=i-1;t>=0;--t){const n=u[t],r=x[t];p[n]&&!p[r]&&(p[r]=f(t,p[n],r,e,o,s,y))}for(let t=0;t<i;++t){const n=x[t],r=u[t];p[n]&&!p[r]&&(p[r]=f(t,p[n],r,e,o,s,c))}return p},exports.getImageCoords=r,exports.getInstanceScore=function(t,n,e){return e.reduce(((e,{y:r,x:s,score:c},u)=>(o(t,n,{y:r,x:s},u)||(e+=c),e)),0)/e.length},exports.toTensorBuffers3D=
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
async function(t){return Promise.all(t.map((t=>t.buffer())))},exports.withinNmsRadiusOfCorrespondingPoint=o;
