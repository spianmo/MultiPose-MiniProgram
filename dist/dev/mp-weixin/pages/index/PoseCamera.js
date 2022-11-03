"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
const tfjsPlugin_wechat_platform = require("../../tfjs-plugin/wechat_platform.js");
const tfjsPlugin_fetch = require("../../tfjs-plugin/fetch.js");
const utils_FrameAdapter = require("../../utils/FrameAdapter.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PoseCamera",
  setup(__props, { expose }) {
    tfjsPlugin_wechat_platform.setupWechatPlatform({
      fetchFunc: tfjsPlugin_fetch.fetchFunc,
      tf: common_vendor.tf,
      webgl: common_vendor.webgl,
      canvas: wx.createOffscreenCanvas()
    });
    common_vendor.enableProdMode();
    let userFrameCallback;
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    const instance = common_vendor.getCurrentInstance();
    let deps;
    const state = common_vendor.reactive({
      FPS: "0",
      backend: "",
      inited: false,
      usingCamera: true,
      switchingBackend: false,
      canvas2DW: 0,
      canvas2DH: 0
    });
    const drawCanvas2D = (frame) => {
      deps.ctx.clearRect(0, 0, deps.canvas2D.width, deps.canvas2D.height);
      deps.canvas2D.width = frame.width;
      deps.canvas2D.height = frame.height;
      const imageData = deps.canvas2D.createImageData(
        new Uint8Array(frame.data),
        frame.width,
        frame.height
      );
      deps.ctx.putImageData(imageData, 0, 0);
    };
    const start = () => {
      deps.cameraListener.start();
    };
    const stop = () => {
      deps.cameraListener.stop();
    };
    const set = (cfg) => {
      userFrameCallback = cfg.onFrame;
    };
    common_vendor.onMounted(async () => {
      await wx.showLoading({ title: "\u521D\u59CB\u5316\u4E2D", mask: false });
      console.log("helper view ready");
      state.backend = common_vendor.getBackend();
      common_vendor.nextTick(async () => {
        const [{ node: canvasGL }] = await utils_utils.getNode("#gl", instance);
        const [{ node: canvas2D }] = await utils_utils.getNode("#canvas", instance);
        const [{ node: canvasInput }] = await utils_utils.getNode("#canvas-input", instance);
        console.log(canvasGL, canvas2D, canvasInput);
        console.log("helper view get canvas node");
        const ctx = canvas2D.getContext("2d");
        const inputCtx = canvasInput.getContext("2d");
        const cameraCtx = wx.createCameraContext();
        const frameAdapter = new utils_FrameAdapter.FrameAdapter();
        const cameraListener = cameraCtx.onCameraFrame(
          frameAdapter.triggerFrame.bind(frameAdapter)
        );
        let canvasSizeInited = false;
        frameAdapter.onProcessFrame(async (frame) => {
          if (!canvasSizeInited) {
            const [canvas2DW, canvas2DH] = utils_utils.objectFit(
              frame.width,
              frame.height,
              windowWidth,
              windowHeight
            );
            state.canvas2DH = canvas2DH;
            state.canvas2DW = canvas2DW;
            canvasSizeInited = true;
          }
          if (userFrameCallback && !state.switchingBackend) {
            const t = Date.now();
            userFrameCallback(frame, deps);
            await new Promise((resolve) => canvas2D.requestAnimationFrame(resolve));
            state.FPS = (1e3 / (Date.now() - t)).toFixed(2);
          }
        });
        deps = {
          ctx,
          inputCtx,
          canvasGL,
          canvas2D,
          canvasInput,
          cameraCtx,
          frameAdapter,
          cameraListener
        };
        console.log("helper view inited");
        await wx.hideLoading();
      });
    });
    common_vendor.onUnmounted(() => {
      if (state.usingCamera)
        deps == null ? void 0 : deps.cameraListener.stop();
      deps = null;
      userFrameCallback = null;
    });
    expose({
      drawCanvas2D,
      set,
      start,
      stop
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/Projects/HealBoneProjects/WeChatProjects/cv-medical-miniprogram-vue3-ts/src/pages/index/PoseCamera.vue"]]);
wx.createComponent(Component);
