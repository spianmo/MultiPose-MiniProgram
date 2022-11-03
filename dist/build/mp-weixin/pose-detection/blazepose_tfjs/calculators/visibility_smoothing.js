"use strict";var i=Object.defineProperty,t=(t,l,s)=>(((t,l,s)=>{l in t?i(t,l,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[l]=s})(t,"symbol"!=typeof l?l+"":l,s),s);const l=require("../../calculators/low_pass_filter.js");
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
 */exports.LowPassVisibilityFilter=class{constructor(i){t(this,"alpha"),t(this,"visibilityFilters"),this.alpha=i.alpha}apply(i){if(null==i)return this.visibilityFilters=null,null;null!=this.visibilityFilters&&this.visibilityFilters.length===i.length||(this.visibilityFilters=i.map((i=>new l.LowPassFilter(this.alpha))));const t=[];for(let l=0;l<i.length;++l){const s=i[l],e={...s};e.score=this.visibilityFilters[l].apply(s.score),t.push(e)}return t}};
