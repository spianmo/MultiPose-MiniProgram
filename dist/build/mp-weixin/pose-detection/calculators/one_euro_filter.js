"use strict";var t=Object.defineProperty,s=(s,e,h)=>(((s,e,h)=>{e in s?t(s,e,{enumerable:!0,configurable:!0,writable:!0,value:h}):s[e]=h})(s,"symbol"!=typeof e?e+"":e,h),h);const e=require("./constants.js"),h=require("./low_pass_filter.js");exports.OneEuroFilter=
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
class{constructor(t){s(this,"minCutOff"),s(this,"beta"),s(this,"derivateCutOff"),s(this,"x"),s(this,"dx"),s(this,"thresholdCutOff"),s(this,"thresholdBeta"),s(this,"frequency"),s(this,"lastTimestamp"),this.frequency=t.frequency,this.minCutOff=t.minCutOff,this.beta=t.beta,this.thresholdCutOff=t.thresholdCutOff,this.thresholdBeta=t.thresholdBeta,this.derivateCutOff=t.derivateCutOff,this.x=new h.LowPassFilter(this.getAlpha(this.minCutOff)),this.dx=new h.LowPassFilter(this.getAlpha(this.derivateCutOff)),this.lastTimestamp=0}apply(t,s,h){if(null==t)return t;const i=Math.trunc(s);if(this.lastTimestamp>=i)return t;0!==this.lastTimestamp&&0!==i&&(this.frequency=1/((i-this.lastTimestamp)*e.MICRO_SECONDS_TO_SECOND)),this.lastTimestamp=i;const a=this.x.hasLastRawValue()?(t-this.x.lastRawValue())*h*this.frequency:0,r=this.dx.applyWithAlpha(a,this.getAlpha(this.derivateCutOff)),l=this.minCutOff+this.beta*Math.abs(r),f=null!=this.thresholdCutOff?this.thresholdCutOff+this.thresholdBeta*Math.abs(r):null;return this.x.applyWithAlpha(t,this.getAlpha(l),f)}getAlpha(t){return 1/(1+this.frequency/(2*Math.PI*t))}};
