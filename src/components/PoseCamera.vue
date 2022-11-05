<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core';
import * as webgl from '@tensorflow/tfjs-backend-webgl';
import {defineExpose, getCurrentInstance, nextTick, onMounted, onUnmounted, reactive} from "vue";
import {getNode, objectFit} from "../utils/utils";
import {setupWechatPlatform} from "../tfjs-plugin/wechat_platform";
import {fetchFunc} from "../tfjs-plugin/fetch";
import {Frame, FrameAdapter} from "../utils/FrameAdapter";
import {Deps, FpsCallback, FrameCallback} from "./PoseDetectModel";
import {isIos} from "../utils/env";

setupWechatPlatform({
  fetchFunc,
  tf,
  webgl,
  // @ts-ignore
  canvas: wx.createOffscreenCanvas(),
});

tf.enableProdMode()

const {windowWidth, windowHeight} = wx.getSystemInfoSync()

const instance = getCurrentInstance()

let poseDetectModel: Deps

const props = defineProps<{
  fpsCallback?: FpsCallback,
  frameCallback?: FrameCallback,
  cameraPosition: 'back' | 'front'
}>()

const state: {
  FPS: string,
  backend: string,
  usingCamera: boolean,
  switchingBackend: boolean,
  canvas2DW: number,
  canvas2DH: number,
  canvasHorizontalOffset: number,
  isDetect: boolean
} = reactive({
  FPS: '0',
  backend: '',
  usingCamera: true,
  switchingBackend: false,
  canvas2DW: 0,
  canvas2DH: 0,
  canvasHorizontalOffset: 0,
  isDetect: false
})

let screenSize: {
  width: number,
  height: number
} = {
  width: 0,
  height: 0
}

/**
 * 回绘制当前相片帧到2D Canvas画布
 * @param frame
 */
const drawCameraFrame = (frame: Frame) => {
  poseDetectModel.ctx.clearRect(0, 0, poseDetectModel.canvas2D.width, poseDetectModel.canvas2D.height);
  poseDetectModel.canvas2D.width = frame.width;
  poseDetectModel.canvas2D.height = frame.height;
  // @ts-ignore
  const imageData = poseDetectModel.canvas2D.createImageData(
      new Uint8Array(frame.data),
      frame.width,
      frame.height,
  );
  poseDetectModel.ctx.putImageData(imageData, 0, 0);
}

/**
 * 开始姿势识别
 */
const startDetect = () => {
  poseDetectModel.cameraListener.start();
  state.canvas2DH = screenSize.height
  state.canvas2DW = screenSize.width
  state.isDetect = true
}

/**
 * 停止姿势识别
 */
const stopDetect = () => {
  poseDetectModel.cameraListener.stop();
  state.canvas2DH = 0
  state.canvas2DW = 0
  state.isDetect = false
}

/**
 * 获取画布横向对齐, 因为iOS Camera大小与实际取得的相片帧大小不符 unit: px
 */
const getCanvasHorizontalOffset = () => {
  return Math.abs(state.canvasHorizontalOffset)
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

    frameAdapter.onProcessFrame(async (frame: Frame) => {
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
        if (isIos) {
          state.canvasHorizontalOffset = (windowWidth - state.canvas2DW) / 2
        }
        canvasSizeInited = true;
      }
      if (props.frameCallback && !state.switchingBackend) {
        const t = Date.now();
        props.frameCallback(frame, poseDetectModel);
        // @ts-ignore
        await new Promise(resolve => canvas2D.requestAnimationFrame(resolve));
        state.FPS = (1000 / (Date.now() - t)).toFixed(2)
        if (props.fpsCallback) {
          props.fpsCallback(state.FPS)
        }
      }
    });
    poseDetectModel = {
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
  if (state.usingCamera) poseDetectModel?.cameraListener.stop();
  // @ts-ignore
  poseDetectModel = null;
})

defineExpose({
  drawCameraFrame,
  startDetect,
  stopDetect,
  getCanvasHorizontalOffset
})

</script>
<template>
  <div class="pose-camera">
    <camera class="camera" frame-size="medium" :device-position="cameraPosition"/>
    <canvas class="canvas" type="2d" id="canvas" :style="{
      width: `${state.canvas2DW}px`,
      height: `${state.canvas2DH}px`,
      left: `${state.canvasHorizontalOffset}px`
    }"></canvas>
  </div>
</template>
<style lang="scss">
.pose-camera {
  position: relative;
  height: 100vh;
  width: 100vw;

  .canvas {
    width: 100vw;
    height: 100vh;
    position: absolute;
    bottom: 0;
  }

  .camera {
    width: 100vw;
    height: 100vh;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
