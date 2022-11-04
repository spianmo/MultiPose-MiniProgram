<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core';
import * as webgl from '@tensorflow/tfjs-backend-webgl';
import {defineExpose, getCurrentInstance, nextTick, onMounted, onUnmounted, reactive} from "vue";
import {getNode, objectFit} from "../../utils/utils";
import {setupWechatPlatform} from "../../tfjs-plugin/wechat_platform";
import {fetchFunc} from "../../tfjs-plugin/fetch";
import {Frame, FrameAdapter} from "../../utils/FrameAdapter";
import {Deps} from "./Deps";

setupWechatPlatform({
  fetchFunc,
  tf,
  webgl,
  // @ts-ignore
  canvas: wx.createOffscreenCanvas(),
});

tf.enableProdMode()

let userFrameCallback: (frame: Frame, deps: any) => Promise<any> | void;

const {windowWidth, windowHeight} = wx.getSystemInfoSync()

const instance = getCurrentInstance()

let deps: Deps

const state: {
  FPS: string,
  backend: string,
  inited: boolean,
  usingCamera: boolean,
  switchingBackend: boolean,
  canvas2DW: number,
  canvas2DH: number,
  isDetect: boolean
} = reactive({
  FPS: '0',
  backend: '',
  inited: false,
  usingCamera: true,
  switchingBackend: false,
  canvas2DW: 0,
  canvas2DH: 0,
  isDetect: false
})

let screenSize: {
  width: number,
  height: number
} = {
  width: 0,
  height: 0
}


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
  state.canvas2DH = screenSize.height
  state.canvas2DW = screenSize.width
  state.isDetect = true
}
const stop = () => {
  deps.cameraListener.stop();
  state.canvas2DH = 0
  state.canvas2DW = 0
  state.isDetect = false
}

const set = (cfg: {
  onFrame: (frame: Frame, deps: any) => Promise<any> | void;
}) => {
  userFrameCallback = cfg.onFrame;
}

onMounted(async () => {
  await wx.showLoading({title: '初始化中', mask: false});
  console.log('helper view ready');
  state.backend = tf.getBackend()

  nextTick(async () => {
    const [{node: canvas2D}] = await getNode('#canvas', instance);

    console.log('helper view get canvas node');
    const ctx = canvas2D.getContext('2d') as CanvasRenderingContext2D;

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
            windowHeight,
        );
        screenSize = {
          width: canvas2DW,
          height: canvas2DH
        }
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
      canvas2D,
      cameraCtx,
      frameAdapter,
      cameraListener,
    };
    console.log('helper view inited');
    await wx.hideLoading();
  })
})


onUnmounted(() => {
  if (state.usingCamera) deps?.cameraListener.stop();
  // @ts-ignore
  deps = null;
  // @ts-ignore
  userFrameCallback = null;
})

defineExpose({
  drawCanvas2D,
  set,
  start,
  stop
})


</script>
<template>
  <div class="pose-camera">
    <camera class="camera" frame-size="medium" device-position="back" />
    <canvas class="canvas" type="2d" id="canvas" :style="{
      width: `${state.canvas2DW}px`,
      height: `${state.canvas2DH}px`
    }"></canvas>
  </div>
</template>
<style lang="scss">
.pose-camera {
  position: relative;
  height: 100%;
  width: 100%;

  .canvas {
    width: 100vw;
    height: 100vh;
    position: absolute;
  }

  .camera {
    width: 100vw;
    height: 100vh;
    position: absolute;
  }
}
</style>
