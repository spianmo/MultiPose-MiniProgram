<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core';
import {createDetector} from "@tensorflow-models/pose-detection";
import {Painter} from "../utils/painter";
import {Deps, DETECT_CONFIG, DetectPoseCallback, FpsCallback} from "./PoseDetectModel";
import PoseCamera from "./PoseCamera.vue";
import {computed, onMounted, reactive, ref, unref} from "vue";
import {onePixel} from "../utils/utils";
import {PoseDetector} from "@tensorflow-models/pose-detection/dist/pose_detector";
import {Frame} from "../utils/FrameAdapter";

const poseCamera = ref<any>(null)
let model!: PoseDetector

const painter = new Painter()

const props = defineProps<{
  detectModel: 'MoveNet-SinglePose-Lightning' | 'MoveNet-SinglePose-Thunder' | 'BlazePose-Lite' | 'BlazePose-Full' | 'PoseNet-MobileNetV1',
  fpsCallback?: FpsCallback,
  cameraPosition: 'back' | 'front',
  detectCallback: DetectPoseCallback
}>()

const state = reactive({
  isDetect: false,
  currentDetectConfig: computed(() => DETECT_CONFIG[props.detectModel])
})


onMounted(async () => {
  console.log("current camera: ", props.cameraPosition)
  await tf.ready()
  model = await createDetector(state.currentDetectConfig.model, state.currentDetectConfig.modelConfig)
  console.log('model load end')

  await warmModel()
})


const onFrame = async (frame: Frame, poseDetectModel: Deps) => {
  const {ctx, canvas2D} = poseDetectModel;
  const cameraFrame = {
    width: frame.width,
    height: frame.height,
    data: new Uint8Array(frame.data),
  }
  if (!model) {
    return
  }
  const t = Date.now()
  // @ts-ignored
  const prediction = await model.estimatePoses(cameraFrame, {flipHorizontal: false})

  if (Array.isArray(prediction) && prediction.length > 0) {
    props.detectCallback({
      pose: prediction[0],
      costTime: Date.now() - t,
      currentTime: new Date()
    })
  }

  painter.setCtx(ctx);
  painter.setModel(state.currentDetectConfig.model);
  painter.setCanvas(canvas2D);

  if (!state.isDetect) return
  unref(poseCamera).drawCameraFrame(frame);
  painter.drawResults(prediction);
}

/**
 * ????????????Pose????????????
 */
const getDetectStatus = () => {
  return state.isDetect
}

/**
 * ??????Pose????????????
 */
const toggleDetect = () => {
  if (!state.isDetect) {
    unref(poseCamera).startDetect()
    state.isDetect = true
  } else {
    unref(poseCamera).stopDetect()
    state.isDetect = false
  }
}

/**
 * ??????????????????????????????????????????
 */
const warmModel = async () => {
  const t = Date.now()

  // @ts-ignored
  await model.estimatePoses(onePixel, {flipHorizontal: false})
  console.log('model warm up', Date.now() - t, new Date())
}

defineExpose({
  getDetectStatus,
  toggleDetect
})

</script>

<template>
  <PoseCamera ref="poseCamera" :fps-callback="fpsCallback" :frame-callback="onFrame" :camera-position="cameraPosition"/>
</template>
