<script setup lang="ts">
import {computed, reactive, ref, unref} from "vue";
import PoseDetectionView from "./PoseDetectionView.vue";

const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
const menuButtonLayoutInfo = wx.getMenuButtonBoundingClientRect();
const poseDetectionView = ref<any>(null)

const toggleDetect = () => unref(poseDetectionView)?.toggleDetect()

const state: any = reactive({
  statusBarHeight: computed(() => statusBarHeight),
  toolbarHeight: computed(() => (menuButtonLayoutInfo.height + (menuButtonLayoutInfo.top - statusBarHeight) * 2)),
  isDetect: computed(() => unref(poseDetectionView)?.getDetectStatus())
})

</script>
<template>
  <div class="tf-container">
    <div class="tf-content">
      <PoseDetectionView ref="poseDetectionView" detect-model="MoveNet-SinglePose-Lightning" camera-position="back"/>
    </div>
    <div :style="{
      paddingTop: `${state.statusBarHeight}px`,
      height: `${state.toolbarHeight}px`
    }" class="tf-appbar">
    </div>
    <div class="tf-footer">
      <div @click="toggleDetect" class="tf-btn-round">
        {{ state.isDetect ? '停止识别' : '开始识别' }}
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.tf-container {
  position: relative;
  height: 100vh;
  width: 100vw;

  .tf-appbar {
    position: absolute;
    display: flex;
    width: 100%;
    background: rgba(200, 200, 200, 0.6);
    justify-content: center;
    align-items: center;
    z-index: 99;
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
