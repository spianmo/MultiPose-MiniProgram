<template>
  <div class="tf-appbar">
    <div @click="startCamera" class="tf-btn">开始识别</div>
    <div @click="stopCamera" class="tf-btn">停止识别</div>
  </div>
  <PoseCamera ref="helper"/>
</template>

<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core';
import {onHide, onReady, onShow} from "@dcloudio/uni-app";
import {createDetector, movenet, SupportedModels} from "../../pose-detection";
import {Painter} from "../../utils/painter";
import {Deps} from "./Deps";
import PoseCamera from "./PoseCamera.vue";
import {getCurrentInstance, nextTick, ref, unref} from "vue";
import {getNode, onePixel} from "../../utils/utils";

const instance = getCurrentInstance()
const helper = ref<any>(null)

onReady(async () => {
  await tf.ready()
  const model = await createDetector(SupportedModels.MoveNet, {modelType: movenet.modelType.SINGLEPOSE_LIGHTNING})
  console.log('movenet load end')
  const t = Date.now()

  // @ts-ignored
  model.estimatePoses(onePixel, {flipHorizontal: false})
  console.log('movenet warm up', Date.now() - t)
  const painter = new Painter()

  const onFrame = (frame: { width: any; height: any; data: Iterable<number>; }, deps: Deps) => {
    const {ctx, canvas2D} = deps;
    const video = {
      width: frame.width,
      height: frame.height,
      data: new Uint8Array(frame.data),
    }

    helper.value.drawCanvas2D(frame);

    const t = Date.now()
    // @ts-ignore
    const prediction = model.estimatePoses(video, {flipHorizontal: false})
    console.log('predict cost', Date.now() - t)

    painter.setCtx(ctx);
    painter.setCanvas2D(canvas2D);
    painter.drawResults(prediction);
  }

  helper.value.set({onFrame});
})

const startCamera = ()=>{
  unref(helper).start()
}

const stopCamera = () => {
  unref(helper).stop();
}

onShow(()=>{
  console.log("onShow")
})

onHide(()=>{
  console.log("onHide")
})

</script>

<style>
.tf-appbar {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.tf-btn {
  color: white;
  margin: 10px;
  background-image: linear-gradient(to right, #ff6f00, #ff9100);
  padding: 5px;
  text-align: center;
  border-radius: 5px;
}
</style>
