"use strict";const e=require("../constants.js"),t=require("./build_part_with_score_queue.js"),s=require("./decode_multiple_poses_util.js");exports.decodeMultiplePoses=
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
async function(o,r,i,n,u,c,d=.5,a=20){const[p,_,l,f]=await s.toTensorBuffers3D([o,r,i,n]),g=[],h=t.buildPartWithScoreQueue(d,e.K_LOCAL_MAXIMUM_RADIUS,p),q=a*a;for(;g.length<c&&!h.empty();){const e=h.dequeue(),t=s.getImageCoords(e.part,u,_);if(s.withinNmsRadiusOfCorrespondingPoint(g,q,t,e.part.id))continue;const o=s.decodePose(e,p,_,u,l,f),r=s.getInstanceScore(g,q,o);g.push({keypoints:o,score:r})}return g};
