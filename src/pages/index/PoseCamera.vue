<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core';
import * as webgl from '@tensorflow/tfjs-backend-webgl';
import {createDetector, movenet, SupportedModels} from "../../pose-detection";
import {getCurrentInstance, onMounted, onUnmounted} from "vue";
import {getNode, objectFit, onePixel} from "../../utils/utils";
import {setupWechatPlatform} from "../../tfjs-plugin/wechat_platform";
import {fetchFunc} from "../../tfjs-plugin/fetch";
import {Frame, FrameAdapter} from "../../utils/FrameAdapter";


// setWasmPaths(
//     {
//       'tfjs-backend-wasm.wasm': '/tfjs-backend-wasm.wasm',
//       'tfjs-backend-wasm-simd.wasm': '/tfjs-backend-wasm.wasm',
//       'tfjs-backend-wasm-threaded-simd.wasm': '/tfjs-backend-wasm.wasm',
//     },
//     true,
// );

setupWechatPlatform({
  fetchFunc,
  tf,
  webgl,
  // @ts-ignore
  canvas: wx.createOffscreenCanvas(),
});

tf.enableProdMode()

let deps: {
  canvasGL: HTMLCanvasElement;
  canvas2D: HTMLCanvasElement;
  canvasInput: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  inputCtx: CanvasRenderingContext2D;

  frameAdapter: FrameAdapter;
  cameraCtx: WechatMiniprogram.CameraContext;
  cameraListener: WechatMiniprogram.CameraFrameListener;
};

let userInitedResolver;

let userFrameCallback: (frame: Frame, deps: any) => Promise<any> | void;

const { windowWidth, windowHeight } = wx.getSystemInfoSync()

const state:{
  FPS: string,
  backend: string,
  inited: boolean,
  usingCamera: boolean,
  switchingBackend: boolean,
  canvas2DW: number,
  canvas2DH: number,
} = defineReactive({
  FPS: '0',
  backend: '',
  inited: false,
  usingCamera: true,
  switchingBackend: false,
  canvas2DW: 0,
  canvas2DH: 0,
})


const drawCanvas2D = (frame: Frame) => {
  deps.ctx.clearRect(0, 0, deps.canvas2D.width, deps.canvas2D.height);
  deps.canvas2D.width = frame.width;
  deps.canvas2D.height = frame.height;
  // @ts-ignore
  const imageData = deps.canvas2D.createImageData(
      new Uint8Array(frame.data),
      frame.width,
      frame.height,
  );
  deps.ctx.putImageData(imageData, 0, 0);
}
const start = () => {
  deps.cameraListener.start();
}
const stop = () => {
  deps.cameraListener.stop();
}

onMounted(async () => {
  const userInitPromise = new Promise(resolve => {
    userInitedResolver = resolve;
  });
  await wx.showLoading({title: '初始化中', mask: false});
  console.log('helper view ready');
  state.backend = tf.getBackend()
  console.log("================>", getCurrentPages())
  const [{ node: canvasGL }] = await getNode('#gl');
  const [{ node: canvas2D }] = await getNode('#canvas');
  const [{ node: canvasInput }] = await getNode('#canvas-input');
  console.log('helper view get canvas node');

  const ctx = canvas2D.getContext('2d') as CanvasRenderingContext2D;
  const inputCtx = canvasInput.getContext('2d') as CanvasRenderingContext2D;

  const cameraCtx = wx.createCameraContext();
  const frameAdapter = new FrameAdapter();
  const cameraListener = cameraCtx.onCameraFrame(
      frameAdapter.triggerFrame.bind(frameAdapter),
  );
  let canvasSizeInited = false;

  frameAdapter.onProcessFrame(async frame => {
    if (!canvasSizeInited) {
      const [canvas2DW, canvas2DH] = objectFit(
          frame.width,
          frame.height,
          windowWidth,
          windowHeight * 0.9,
      );
      state.canvas2DH = canvas2DH
      state.canvas2DW = canvas2DW
      canvasSizeInited = true;
    }
    if (userFrameCallback && !state.switchingBackend) {
      const t = Date.now();
      userFrameCallback(frame, deps);
      // @ts-ignore
      await new Promise(resolve => canvas2D.requestAnimationFrame(resolve));
      state.FPS = (1000 / (Date.now() - t)).toFixed(2)
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
    cameraListener,
  };
  console.log('helper view inited');

  await userInitPromise;
  await wx.hideLoading();
  deps.cameraListener.start();
})

onUnmounted(() => {

})


</script>
<template>
  <div id="ddd">3232323</div>
  <camera class="camera" frame-size="medium" device-position="front"></camera>
  <canvas class="gl" type="webgl" id="gl"></canvas>
  <canvas class="canvas" type="2d" id="canvas" :style="{
    width: `${state.canvas2DW}px`,
    height: `${state.canvas2DH}px`
  }"></canvas>
  <canvas class="canvas canvas-input" type="2d" id="canvas-input"></canvas>
</template>
<style>
.page {
  position: relative;
  z-index: 0;
  height: 100vh;
  width: 100vw;
  color: #425066;
}

.gl,
.camera,
.canvas {
  width: 100vw;
  height: 90vh;
  position: absolute;
  bottom: 0;
  left: 0;
}

.canvas.canvas-input, .camera {
  left: -100vw;
}
</style>
