"use strict";var t=Object.defineProperty,e=(e,s,i)=>(((e,s,i)=>{s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i})(e,"symbol"!=typeof s?s+"":s,i),i);require("../common/vendor.js");const s=require("../pose-detection/types.js"),i=require("../pose-detection/util.js");require("../pose-detection/posenet/calculators/decode_multiple_poses_util.js");exports.Painter=
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
class{constructor(){e(this,"ctx"),e(this,"canvas2D")}setCtx(t){this.ctx=t}setCanvas2D(t){this.canvas2D=t}drawResults(t){for(const e of t)this.drawResult(e)}drawResult(t){null!=t.keypoints&&(this.drawKeypoints(t.keypoints),this.drawSkeleton(t.keypoints))}drawKeypoints(t){const e=i.getKeypointIndexBySide(s.SupportedModels.MoveNet);this.ctx.fillStyle="White",this.ctx.strokeStyle="White",this.ctx.lineWidth=2;for(const s of e.middle)this.drawKeypoint(t[s]);this.ctx.fillStyle="Green";for(const s of e.left)this.drawKeypoint(t[s]);this.ctx.fillStyle="Orange";for(const s of e.right)this.drawKeypoint(t[s])}drawKeypoint(t){if((null!=t.score?t.score:1)>=.3){const e=this.canvas2D.createPath2D();e.arc(t.x,t.y,4,0,2*Math.PI),this.ctx.fill(e),this.ctx.stroke(e)}}drawSkeleton(t){this.ctx.fillStyle="White",this.ctx.strokeStyle="White",this.ctx.lineWidth=2,i.getAdjacentPairs(s.SupportedModels.MoveNet).forEach((([e,s])=>{const i=t[e],o=t[s],r=null!=i.score?i.score:1,c=null!=o.score?o.score:1;r>=.3&&c>=.3&&(this.ctx.beginPath(),this.ctx.moveTo(i.x,i.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke())}))}};
