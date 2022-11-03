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
 */exports.removeLandmarkLetterbox=function(t,e){const o=e.left,r=e.top,n=e.left+e.right,m=e.top+e.bottom;return t.map((t=>({...t,x:(t.x-o)/(1-n),y:(t.y-r)/(1-m),z:t.z/(1-n)})))};
