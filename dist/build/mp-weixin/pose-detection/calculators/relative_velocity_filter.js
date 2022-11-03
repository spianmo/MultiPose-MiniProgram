"use strict";var t=Object.defineProperty,s=(s,i,e)=>(((s,i,e)=>{i in s?t(s,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[i]=e})(s,"symbol"!=typeof i?i+"":i,e),e);const i=require("./constants.js"),e=require("./low_pass_filter.js");exports.RelativeVelocityFilter=
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
class{constructor(t){s(this,"window",[]),s(this,"lowPassFilter",new e.LowPassFilter(1)),s(this,"lastValue",0),s(this,"lastValueScale",1),s(this,"lastTimestamp",-1),this.config=t}apply(t,s,e){if(null==t)return t;const a=Math.trunc(s);if(this.lastTimestamp>=a)return t;let l;if(-1===this.lastTimestamp)l=1;else{const s=t*e-this.lastValue*this.lastValueScale,n=a-this.lastTimestamp;let o=s,r=n;const h=i.SECOND_TO_MICRO_SECONDS/30,c=(1+this.window.length)*h;for(const t of this.window){if(r+t.duration>c)break;o+=t.distance,r+=t.duration}const u=o/(r*i.MICRO_SECONDS_TO_SECOND);l=1-1/(1+this.config.velocityScale*Math.abs(u)),this.window.unshift({distance:s,duration:n}),this.window.length>this.config.windowSize&&this.window.pop()}return this.lastValue=t,this.lastValueScale=e,this.lastTimestamp=a,this.lowPassFilter.applyWithAlpha(t,l)}};
