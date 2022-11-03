"use strict";var t=Object.defineProperty,i=(i,e,l)=>(((i,e,l)=>{e in i?t(i,e,{enumerable:!0,configurable:!0,writable:!0,value:l}):i[e]=l})(i,"symbol"!=typeof e?e+"":e,l),l);const e=require("./one_euro_filter.js"),l=require("./velocity_filter_utils.js");exports.KeypointsOneEuroFilter=
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
class{constructor(t){i(this,"xFilters"),i(this,"yFilters"),i(this,"zFilters"),this.config=t}apply(t,i){if(null==t)return this.reset(),null;this.initializeFiltersIfEmpty(t);let e=1;if(null!=this.config.minAllowedObjectScale){const i=l.getObjectScale(t);if(i<this.config.minAllowedObjectScale)return[...t];e=1/i}return t.map(((t,l)=>{const s={...t,x:this.xFilters[l].apply(t.x,i,e),y:this.yFilters[l].apply(t.y,i,e)};return null!=t.z&&(s.z=this.zFilters[l].apply(t.z,i,e)),s}))}reset(){this.xFilters=null,this.yFilters=null,this.zFilters=null}initializeFiltersIfEmpty(t){null!=this.xFilters&&this.xFilters.length===t.length||(this.xFilters=t.map((t=>new e.OneEuroFilter(this.config))),this.yFilters=t.map((t=>new e.OneEuroFilter(this.config))),this.zFilters=t.map((t=>new e.OneEuroFilter(this.config))))}};
