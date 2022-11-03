"use strict";const e=require("../common/vendor.js");
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
 */let t;class n{constructor(e){t=e}fetch(e,n){return t(e,n)}now(){return Date.now()}encode(t,n){if("utf-8"!==n&&"utf8"!==n)throw new Error(`Browser's encoder only supports utf-8, but got ${n}`);return new e.textEncoder.TextEncoder(n).encode(t)}decode(t,n){return new e.textEncoder.TextDecoder(n).decode(t)}}exports.setupWechatPlatform=function(t,o=!1){const a=t.tf,r=t.backendName||"wechat-webgl";if(o&&console.log(a),a.getBackend()===r)return;const c=t.webgl;a.ENV.setPlatform("wechat",new n(t.fetchFunc)),function(t){t.ENV.global.btoa=e.abab.btoa,t.ENV.global.atob=e.abab.atob}(a),t.webgl&&t.canvas?function(e,t,n,o="wechat-webgl",a=!1){if(null==e.findBackend(o)){const c={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0},s=n.getContext("webgl",c);a&&console.log("start backend registration");try{e.registerBackend(o,(()=>{t.setWebGLContext(1,s),e.ENV.set("WEBGL_VERSION",1);const n=new t.GPGPUContext(s);return new t.MathBackendWebGL(n)}),2);e.getKernelsForBackend("webgl").forEach((t=>{const n=Object.assign({},t,{backendName:o});e.registerKernel(n)}))}catch(r){throw new Error(`Failed to register Webgl backend: ${r.message}`)}}e.setBackend(o),a&&console.log("current backend = ",e.getBackend())}(a,c,t.canvas,r,o):console.log("webgl backend is not initialized, please inject webgl backend and the offscreen canvas.")};
