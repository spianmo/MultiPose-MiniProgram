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
 */exports.landmarksToDetection=function(t){const a={locationData:{relativeKeypoints:[]}};let e=Number.MAX_SAFE_INTEGER,n=Number.MIN_SAFE_INTEGER,i=Number.MAX_SAFE_INTEGER,o=Number.MIN_SAFE_INTEGER;for(let r=0;r<t.length;++r){const x=t[r];e=Math.min(e,x.x),n=Math.max(n,x.x),i=Math.min(i,x.y),o=Math.max(o,x.y),a.locationData.relativeKeypoints.push({x:x.x,y:x.y})}return a.locationData.relativeBoundingBox={xMin:e,yMin:i,xMax:n,yMax:o,width:n-e,height:o-i},a};
