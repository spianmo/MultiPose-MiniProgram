"use strict";
const common_vendor = require("../common/vendor.js");
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
 */
let systemFetchFunc;
class PlatformWeChat {
  constructor(fetchFunc) {
    systemFetchFunc = fetchFunc;
  }
  fetch(path, requestInits) {
    return systemFetchFunc(path, requestInits);
  }
  now() {
    return Date.now();
  }
  encode(text, encoding) {
    if (encoding !== "utf-8" && encoding !== "utf8") {
      throw new Error(
        `Browser's encoder only supports utf-8, but got ${encoding}`
      );
    }
    return new common_vendor.textEncoder.TextEncoder(encoding).encode(text);
  }
  decode(bytes, encoding) {
    return new common_vendor.textEncoder.TextDecoder(encoding).decode(bytes);
  }
}
const WECHAT_WEBGL_BACKEND_NAME = "wechat-webgl";
function setupWechatPlatform(config, debug = false) {
  const tf = config.tf;
  const backendName = config.backendName || WECHAT_WEBGL_BACKEND_NAME;
  if (debug) {
    console.log(tf);
  }
  if (tf.getBackend() === backendName) {
    return;
  }
  const webgl = config.webgl;
  tf.ENV.setPlatform("wechat", new PlatformWeChat(config.fetchFunc));
  setBase64Methods(tf);
  if (config.webgl && config.canvas) {
    initWebGL(tf, webgl, config.canvas, backendName, debug);
  } else {
    console.log(
      "webgl backend is not initialized, please inject webgl backend and the offscreen canvas."
    );
  }
}
function setBase64Methods(tf) {
  tf.ENV.global.btoa = common_vendor.abab.btoa;
  tf.ENV.global.atob = common_vendor.abab.atob;
}
const BACKEND_PRIORITY = 2;
function initWebGL(tf, webgl, canvas, backendName = WECHAT_WEBGL_BACKEND_NAME, debug = false) {
  if (tf.findBackend(backendName) == null) {
    const WEBGL_ATTRIBUTES = {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      depth: false,
      stencil: false,
      failIfMajorPerformanceCaveat: true
    };
    const gl = canvas.getContext("webgl", WEBGL_ATTRIBUTES);
    if (debug) {
      console.log("start backend registration");
    }
    try {
      tf.registerBackend(backendName, () => {
        webgl.setWebGLContext(1, gl);
        tf.ENV.set("WEBGL_VERSION", 1);
        const context = new webgl.GPGPUContext(gl);
        return new webgl.MathBackendWebGL(context);
      }, BACKEND_PRIORITY);
      const kernels = tf.getKernelsForBackend("webgl");
      kernels.forEach((kernelConfig) => {
        const newKernelConfig = Object.assign({}, kernelConfig, { backendName });
        tf.registerKernel(newKernelConfig);
      });
    } catch (e) {
      throw new Error(`Failed to register Webgl backend: ${e.message}`);
    }
  }
  tf.setBackend(backendName);
  if (debug) {
    console.log("current backend = ", tf.getBackend());
  }
}
exports.setupWechatPlatform = setupWechatPlatform;
