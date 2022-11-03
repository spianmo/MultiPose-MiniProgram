"use strict";var t=Object.defineProperty,i=(i,a,e)=>(((i,a,e)=>{a in i?t(i,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[a]=e})(i,"symbol"!=typeof a?a+"":a,e),e);exports.LowPassFilter=
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
class{constructor(t){i(this,"initialized",!1),i(this,"rawValue"),i(this,"storedValue"),this.alpha=t}apply(t,i){let a;return this.initialized?a=null==i?this.storedValue+this.alpha*(t-this.storedValue):this.storedValue+this.alpha*i*Math.asinh((t-this.storedValue)/i):(a=t,this.initialized=!0),this.rawValue=t,this.storedValue=a,a}applyWithAlpha(t,i,a){return this.alpha=i,this.apply(t,a)}hasLastRawValue(){return this.initialized}lastRawValue(){return this.rawValue}reset(){this.initialized=!1}};
