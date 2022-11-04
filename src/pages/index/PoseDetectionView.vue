<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core';
import {createDetector} from "@tensorflow-models/pose-detection";
import {Painter} from "../../utils/painter";
import {Deps, DETECT_CONFIG, FpsCallback} from "./PoseDetectModel";
import PoseCamera from "./PoseCamera.vue";
import {computed, getCurrentInstance, onMounted, onUnmounted, reactive, ref, unref} from "vue";
import {onePixel} from "../../utils/utils";
import {PoseDetector} from "@tensorflow-models/pose-detection/dist/pose_detector";
import {Frame} from "../../utils/FrameAdapter";
import {clearRafInterval, setRafInterval} from "../../utils/raf-interval";
import {Pose} from "@tensorflow-models/pose-detection/dist/types";

const instance = getCurrentInstance()
const poseCamera = ref<any>(null)
let model!: PoseDetector
let intervalHandle = 0
let lastPrediction!: Pose[]

const painter = new Painter()

const props = defineProps<{
  detectModel: 'MoveNet-SinglePose-Lightning' | 'MoveNet-SinglePose-Thunder' | 'BlazePose-Lite' | 'MobileNetV1',
  fpsCallback?: FpsCallback,
  cameraPosition: 'back' | 'front'
}>()

const state = reactive({
  isDetect: false,
  currentDetectConfig: computed(() => DETECT_CONFIG[props.detectModel]),
  modelWarmFlag: false
})


onMounted(async () => {
  await tf.ready()
  model = await createDetector(state.currentDetectConfig.model, state.currentDetectConfig.modelConfig)
  console.log('model load end')
  const t = Date.now()

  // @ts-ignored
  await model.estimatePoses(onePixel, {flipHorizontal: false})
  console.log('model warm up', Date.now() - t)
  state.modelWarmFlag = true

  intervalHandle = setRafInterval(() => {
    if (!state.isDetect) return
    painter.drawResults(lastPrediction);
  }, 1000 / 60)
})

onUnmounted(() => {
  clearRafInterval(intervalHandle)
})


const onFrame = async (frame: Frame, poseDetectModel: Deps) => {
  const {ctx, canvas2D} = poseDetectModel;
  const video = {
    width: frame.width,
    height: frame.height,
    data: new Uint8Array(frame.data),
  }
  unref(poseCamera).drawCanvas2D(frame);
  if (!model) {
    return
  }
  const t = Date.now()
  // @ts-ignored
  lastPrediction = await model.estimatePoses(video, {flipHorizontal: false})
  console.log('predict cost', Date.now() - t)

  painter.setCtx(ctx);
  painter.setModel(state.currentDetectConfig.model);
  painter.setCanvas(canvas2D);
}

/**
 * 获取当前Pose检测状态
 */
const getDetectStatus = () => {
  return state.isDetect
}

/**
 * 切换Pose检测开关
 */
const toggleDetect = () => {
  if (!state.modelWarmFlag) {
    uni.showToast({title: '模型热身中', icon: "loading"})
    return
  }
  if (!state.isDetect) {
    unref(poseCamera).start()
    state.isDetect = true
  } else {
    unref(poseCamera).stop()
    state.isDetect = false
  }

}

defineExpose({
  getDetectStatus,
  toggleDetect
})

</script>

<template>
  <PoseCamera ref="poseCamera" :fps-callback="fpsCallback" :frame-callback="onFrame" :camera-position="cameraPosition"/>
</template>
