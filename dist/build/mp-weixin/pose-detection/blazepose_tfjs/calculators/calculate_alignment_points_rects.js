"use strict";const t=require("./detection_to_rect.js");
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
 */exports.calculateAlignmentPointsRects=function(e,i,o){const n=o.rotationVectorStartKeypointIndex,r=o.rotationVectorEndKeypointIndex,h=e.locationData,a=h.relativeKeypoints[n].x*i.width,c=h.relativeKeypoints[n].y*i.height,s=h.relativeKeypoints[r].x*i.width,d=h.relativeKeypoints[r].y*i.height,y=2*Math.sqrt((s-a)*(s-a)+(d-c)*(d-c)),l=t.computeRotation(e,i,o);return{xCenter:a/i.width,yCenter:c/i.height,width:y/i.width,height:y/i.height,rotation:l}};
