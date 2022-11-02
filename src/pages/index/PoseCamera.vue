<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core';
import * as webgl from '@tensorflow/tfjs-backend-webgl';
import {createDetector, movenet, SupportedModels} from "../../pose-detection";
import {onMounted, onUnmounted} from "vue";
import {onePixel} from "../../utils";
import {setupWechatPlatform} from "../../tfjs-plugin/wechat_platform";
import {fetchFunc} from "../../tfjs-plugin/fetch";
import CameraContext = UniNamespace.CameraContext;
import {Frame, FrameAdapter} from "../../utils/FrameAdapter";

const state: {
  canvasGL: HTMLCanvasElement | null,
  canvas2D: HTMLCanvasElement | null,
  canvasInput: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null,
  inputCtx: CanvasRenderingContext2D | null,
  frameAdapter: FrameAdapter | null,
  cameraCtx: WechatMiniprogram.CameraContext | null,
  cameraListener: WechatMiniprogram.CameraFrameListener | null
} = defineReactive({
  canvasGL: null,
  canvas2D: null,
  canvasInput: null,
  ctx: null,
  inputCtx: null,
  frameAdapter: null,
  cameraCtx: null,
  cameraListener: null
})

const drawCanvas2D = (frame: Frame)=> {
    const { ctx, canvas2D } = deps;
    ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
    canvas2D.width = frame.width;
    canvas2D.height = frame.height;
    // @ts-ignore
    const imageData = canvas2D.createImageData(
        new Uint8Array(frame.data),
        frame.width,
        frame.height,
    );
    ctx.putImageData(imageData, 0, 0);
}


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
  canvas: wx.createOffscreenCanvas(),
});

tf.enableProdMode()

onMounted(async () => {
  const model = await createDetector(SupportedModels.MoveNet, {modelType: movenet.modelType.SINGLEPOSE_LIGHTNING})

// @ts-ignore
  model.estimatePoses(onePixel, {flipHorizontal: false})

})

onUnmounted(() => {
  stopCamera()
})


</script>
<template>
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
