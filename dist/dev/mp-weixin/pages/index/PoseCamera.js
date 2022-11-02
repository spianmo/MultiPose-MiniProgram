"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
const tfjsPlugin_wechat_platform = require("../../tfjs-plugin/wechat_platform.js");
const tfjsPlugin_fetch = require("../../tfjs-plugin/fetch.js");
const utils_FrameAdapter = require("../../utils/FrameAdapter.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PoseCamera",
  setup(__props) {
    tfjsPlugin_wechat_platform.setupWechatPlatform({
      fetchFunc: tfjsPlugin_fetch.fetchFunc,
      tf: common_vendor.tf,
      webgl: common_vendor.webgl,
      canvas: wx.createOffscreenCanvas()
    });
    common_vendor.enableProdMode();
    let deps;
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    const state = common_vendor.reactive({
      FPS: "0",
      backend: "",
      inited: false,
      usingCamera: true,
      switchingBackend: false,
      canvas2DW: 0,
      canvas2DH: 0
    });
    common_vendor.onMounted(async () => {
      const userInitPromise = new Promise((resolve) => {
      });
      await wx.showLoading({ title: "\u521D\u59CB\u5316\u4E2D", mask: false });
      console.log("helper view ready");
      state.backend = common_vendor.getBackend();
      console.log("================>", getCurrentPages());
      const [{ node: canvasGL }] = await utils_utils.getNode("#gl");
      const [{ node: canvas2D }] = await utils_utils.getNode("#canvas");
      const [{ node: canvasInput }] = await utils_utils.getNode("#canvas-input");
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
          const [canvas2DW2, canvas2DH2] = utils_utils.objectFit(
            frame.width,
            frame.height,
            windowWidth,
            windowHeight * 0.9
          );
          state.canvas2DH = canvas2DH2;
          state.canvas2DW = canvas2DW2;
          canvasSizeInited = true;
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
      await userInitPromise;
      await wx.hideLoading();
      deps.cameraListener.start();
    });
    common_vendor.onUnmounted(() => {
    });
    common_vendor.toRefs(state);
    return (_ctx, _cache) => {
      return {
        a: `${state.canvas2DW}px`,
        b: `${state.canvas2DH}px`
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/Projects/HealBoneProjects/WeChatProjects/cv-medical-miniprogram-vue3-ts/src/pages/index/PoseCamera.vue"]]);
wx.createComponent(Component);
