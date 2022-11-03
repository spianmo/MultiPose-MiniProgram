<template>
  <div class="tf-container">
    <div class="tf-content">
      <PoseCamera ref="helper"/>
    </div>
    <div class="tf-appbar">
    </div>
    <div class="tf-footer">
      <div @click="toggleDetect" class="tf-btn-round">
        {{ state.isDetect ? '停止识别' : '开始识别' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core';
import {onHide, onReady, onShow} from "@dcloudio/uni-app";
import {createDetector, movenet, SupportedModels} from "../../pose-detection";
import {Painter} from "../../utils/painter";
import {Deps} from "./Deps";
import PoseCamera from "./PoseCamera.vue";
import {getCurrentInstance, reactive, ref, unref} from "vue";
import {onePixel} from "../../utils/utils";

const instance = getCurrentInstance()
const helper = ref<any>(null)
const state = reactive({
  isDetect: false
})

onReady(async () => {
  await tf.ready()
  const model = await createDetector(SupportedModels.MoveNet, {modelType: movenet.modelType.SINGLEPOSE_LIGHTNING})
  console.log('movenet load end')
  const t = Date.now()

  // @ts-ignored
  await model.estimatePoses(onePixel, {flipHorizontal: false})
  console.log('movenet warm up', Date.now() - t)
  const painter = new Painter()

  const onFrame = async (frame: { width: any; height: any; data: Iterable<number>; }, deps: Deps) => {
    const {ctx, canvas2D} = deps;
    const video = {
      width: frame.width,
      height: frame.height,
      data: new Uint8Array(frame.data),
    }

    helper.value.drawCanvas2D(frame);

    const t = Date.now()
    // @ts-ignored
    const prediction = await model.estimatePoses(video, {flipHorizontal: false})
    console.log('predict cost', Date.now() - t)

    painter.setCtx(ctx);
    painter.setCanvas2D(canvas2D);
    painter.drawResults(prediction);
  }

  helper.value.set({onFrame});
})

const toggleDetect = () => {
  if (!state.isDetect) {
    unref(helper).start()
    state.isDetect = true
  } else {
    unref(helper).stop()
    state.isDetect = false
  }

}

onShow(() => {
  console.log("onShow")
})

onHide(() => {
  console.log("onHide")
})

</script>

<style lang="scss">
.tf-container {
  position: relative;
  height: 100vh;
  width: 100vw;

  .tf-appbar {
    position: absolute;
    display: flex;
    width: 100%;
    height: 96px;
    background-color: rgba(241, 241, 241, 0.4);
    justify-content: center;
    align-items: center;
  }

  .tf-content {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .tf-footer {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;

    .tf-btn-round {
      color: white;
      margin: 10px 0 20px 0;
      width: 80%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: linear-gradient(to right, #ff6f00, #ff9100);
      padding: 5px;
      height: 32px;
      text-align: center;
      border-radius: 25px;
    }
  }
}


</style>
