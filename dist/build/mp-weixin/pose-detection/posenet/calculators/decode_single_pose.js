"use strict";const e=require("../../constants.js"),s=require("./decode_single_pose_util.js");exports.decodeSinglePose=
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
async function(t,o,r){let n=0;const i=s.argmax2d(t),f=await Promise.all([t.buffer(),o.buffer(),i.buffer()]),a=f[0],c=f[1],u=f[2],d=s.getOffsetPoints(u,r,c),g=await d.buffer(),l=Array.from(s.getPointsConfidence(a,u)).map(((s,t)=>(n+=s,{y:g.get(t,0),x:g.get(t,1),score:s,name:e.COCO_KEYPOINTS[t]})));return i.dispose(),d.dispose(),{keypoints:l,score:n/l.length}};
