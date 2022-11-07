<script setup lang="ts">
import {computed, onMounted, reactive, ref, unref} from "vue";
import PoseDetectionView from "../../components/PoseDetectionView.vue";
import {DetectPoseCallback, DetectResult} from "../../components/PoseDetectModel";
import StartAnimation from "../../components/start-animation/StartAnimation.vue";

const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
const menuButtonLayoutInfo = wx.getMenuButtonBoundingClientRect();
const poseDetectionView = ref<any>(null)

const state: any = reactive({
  statusBarHeight: computed(() => statusBarHeight),
  toolbarHeight: computed(() => (menuButtonLayoutInfo.height + (menuButtonLayoutInfo.top - statusBarHeight) * 2)),
  isDetect: computed(() => unref(poseDetectionView)?.getDetectStatus()),
  startAnimVisible: false,
  titleEntranceAniName: ''
})

/**
 * 切换检测状态
 */
const toggleDetect = () => {
  state.startAnimVisible = false
  unref(poseDetectionView)?.toggleDetect()
}

/**
 * 检测相片帧的姿势回调
 * @param detectResult
 */
const detectCallback: DetectPoseCallback = (detectResult: DetectResult) => {
  console.log(detectResult)
}

const startGame = () => {
  if (!state.isDetect) {
    state.startAnimVisible = true
  } else {
    toggleDetect()
  }
}

onMounted(() => {
  setTimeout(() => {
    state.titleEntranceAniName = 'animate__zoomIn'
    state.titleBgUrl = 'https://mms-voice-fe.cdn.bcebos.com/pdproject/clas/wx-project/title_logo_2109011341.png'
    setTimeout(() => {
      state.titleEntranceAniName = 'animate__bounce'
    }, 500);
  }, 800);
})

</script>
<template>
  <div class="tf-container">
    <!--导航栏部分-->
    <div :style="{
      paddingTop: `${state.statusBarHeight}px`,
      height: `${state.toolbarHeight}px`
    }" class="tf-appbar">
    </div>

    <!--姿势检测驱动视图-->
    <div class="tf-content">
      <PoseDetectionView ref="poseDetectionView" detect-model="BlazePose-Lite" camera-position="front"
                         :detect-callback="detectCallback"/>
    </div>

    <!--开始倒计时动画-->
    <div v-if="!state.startAnimVisible && !state.isDetect" class="tf-layer">
      <!--标题-->
      <div
          :style="`background-image: url(${state.titleBgUrl});`"
          :class="state.titleEntranceAniName"
          class="tf-title bg-cover animate__animated animate__duration-600ms"
      />
      <div
          class="tf-introduction font-common animate__animated animate__infinite animate__duration-2000ms animate__pulse">
        <div>将手机摄像头打开，对准自己全身，跟着神经网络姿势推理进行运动训练。</div>
        <div>训练结束后看看自己的得分能达到多少排名，快来开始吧！</div>
      </div>
    </div>

    <div class="tf-layer-ani">
      <!--开始动画倒计时-->
      <StartAnimation v-if="state.startAnimVisible" :start-game="toggleDetect"/>
    </div>

    <!--底部操作按钮-->
    <div v-if="!state.startAnimVisible || state.isDetect" class="tf-footer">
      <div
          class="handle-area inner-element-center animate__animated animate__infinite animate__duration-2000ms animate__pulse">
        <div @click="startGame" class="tf-btn-start"/>
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

  .tf-layer-ani {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }


  .tf-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    .tf-game-title {
      font-family: RMTT;
      font-size: 58px;
      background: linear-gradient(to right, #ff6f00, #ff9100);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      height: fit-content;
    }

    .tf-title {
      width: 84.46vw;
      height: 28.09vw;
    }

    .tf-introduction {
      margin: 10px 0 64px 0;
      width: 64.92vw;
      height: 29vw;
      background-image: url(https://mms-voice-fe.cdn.bcebos.com/pdproject/clas/wx-project/introduction_bg.png);
      box-sizing: border-box;
      background-size: 100% 100%;
      padding: 2vw 2vw 2vw 3vw;
      font-size: 3.7vw;
      color: #166FA1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }

  .tf-footer {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    background: rgba(200, 200, 200, 0.6);

    .tf-btn-start {
      width: 68.43vw;
      height: 21.65vw;
      background-image: url(https://mms-voice-fe.cdn.bcebos.com/pdproject/clas/wx-project/start_btn.png);
      background-size: cover;
      background-repeat: no-repeat;
      margin: 8px 0 8px 0;
    }
  }
}


</style>
