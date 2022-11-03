"use strict";var e=Object.defineProperty,t=(t,i,s)=>(((t,i,s)=>{i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[i]=s})(t,"symbol"!=typeof i?i+"":i,s),s);
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
 */
function i(e){return Math.floor(e/2)}exports.MaxHeap=class{constructor(e,i){t(this,"priorityQueue"),t(this,"numberOfElements"),t(this,"getElementValue"),this.priorityQueue=new Array(e),this.numberOfElements=-1,this.getElementValue=i}enqueue(e){this.priorityQueue[++this.numberOfElements]=e,this.swim(this.numberOfElements)}dequeue(){const e=this.priorityQueue[0];return this.exchange(0,this.numberOfElements--),this.sink(0),this.priorityQueue[this.numberOfElements+1]=null,e}empty(){return-1===this.numberOfElements}size(){return this.numberOfElements+1}all(){return this.priorityQueue.slice(0,this.numberOfElements+1)}max(){return this.priorityQueue[0]}swim(e){for(;e>0&&this.less(i(e),e);)this.exchange(e,i(e)),e=i(e)}sink(e){for(;2*e<=this.numberOfElements;){let t=2*e;if(t<this.numberOfElements&&this.less(t,t+1)&&t++,!this.less(e,t))break;this.exchange(e,t),e=t}}getValueAt(e){return this.getElementValue(this.priorityQueue[e])}less(e,t){return this.getValueAt(e)<this.getValueAt(t)}exchange(e,t){const i=this.priorityQueue[e];this.priorityQueue[e]=this.priorityQueue[t],this.priorityQueue[t]=i}};
