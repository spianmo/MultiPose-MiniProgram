"use strict";const n=require("../../../common/vendor.js");
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
 */exports.nonMaxSuppression=function(o,a,e,i){const t=n.tensor2d(o.map((n=>[n.locationData.relativeBoundingBox.yMin,n.locationData.relativeBoundingBox.xMin,n.locationData.relativeBoundingBox.yMax,n.locationData.relativeBoundingBox.xMax]))),r=n.tensor1d(o.map((n=>n.score[0]))),s=n.image.nonMaxSuppression(t,r,a,e,i),x=s.arraySync(),c=o.filter(((n,o)=>x.indexOf(o)>-1));return n.dispose([t,r,s]),c};
