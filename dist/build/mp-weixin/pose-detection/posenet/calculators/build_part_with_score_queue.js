"use strict";const e=require("./max_heap.js");
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
 */function t(e,t,a,r,o,n){const[s,c]=n.shape;let i=!0;const u=Math.max(a-o,0),h=Math.min(a+o+1,s);for(let f=u;f<h;++f){const a=Math.max(r-o,0),s=Math.min(r+o+1,c);for(let r=a;r<s;++r)if(n.get(f,r,e)>t){i=!1;break}if(!i)break}return i}exports.buildPartWithScoreQueue=function(a,r,o){const[n,s,c]=o.shape,i=new e.MaxHeap(n*s*c,(({score:e})=>e));for(let e=0;e<n;++e)for(let n=0;n<s;++n)for(let s=0;s<c;++s){const c=o.get(e,n,s);c<a||t(s,c,e,n,r,o)&&i.enqueue({score:c,part:{heatmapY:e,heatmapX:n,id:s}})}return i};
