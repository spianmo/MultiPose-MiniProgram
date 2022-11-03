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
 */exports.computeRotation=function(e,o,i){const n=e.locationData,a=i.rotationVectorStartKeypointIndex,r=i.rotationVectorEndKeypointIndex;let c;c=i.rotationVectorTargetAngle?i.rotationVectorTargetAngle:Math.PI*i.rotationVectorTargetAngleDegree/180;const s=n.relativeKeypoints[a].x*o.width,l=n.relativeKeypoints[a].y*o.height,g=n.relativeKeypoints[r].x*o.width,h=n.relativeKeypoints[r].y*o.height;return t.normalizeRadians(c-Math.atan2(-(h-l),g-s))};
