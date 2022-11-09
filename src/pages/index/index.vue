<script setup lang="ts">
import {computed, onMounted, reactive, ref, unref} from "vue";
import PoseDetectionView from "../../components/PoseDetectionView.vue";
import {DetectPoseCallback, DetectResult} from "../../components/PoseDetectModel";
import StartAnimation from "../../components/start-animation/StartAnimation.vue";

const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
const menuButtonLayoutInfo = wx.getMenuButtonBoundingClientRect();
const poseDetectionView = ref<any>(null)


enum UIState {'init', 'onStarting', 'onGaming'}

type UIElement = {
  splash: boolean,
  background: boolean,
  appbar: boolean,
  controlPane: boolean,
  startAnimate: boolean
}

/**
 * UI State状态机
 */
const stateMachine: Map<UIState, UIElement> = new Map<UIState, UIElement>([
  [UIState.init, {
    splash: true,
    background: true,
    appbar: true,
    controlPane: true,
    startAnimate: false
  }],
  [UIState.onStarting, {
    splash: false,
    background: false,
    appbar: true,
    controlPane: false,
    startAnimate: true
  }],
  [UIState.onGaming, {
    splash: false,
    background: false,
    appbar: true,
    controlPane: true,
    startAnimate: false
  }]
])

/**
 * Reactive Variable
 */
const state: {
  statusBarHeight: number,
  toolbarHeight: number,
  isDetect: boolean,
  titleEntranceAniName: string,
  titleBgUrl: string,
  currentState: UIState,
  UIState?: UIElement
} = reactive({
  statusBarHeight: computed(() => statusBarHeight),
  toolbarHeight: computed(() => (menuButtonLayoutInfo.height + (menuButtonLayoutInfo.top - statusBarHeight) * 2)),
  isDetect: computed(() => unref(poseDetectionView)?.getDetectStatus()),
  titleEntranceAniName: '',
  titleBgUrl: '',
  currentState: UIState.init,
  UIState: computed(() => stateMachine.get(state.currentState))
})

/**
 * 切换检测状态
 */
const startDetect = () => {
  state.currentState = UIState.onGaming
  unref(poseDetectionView)?.toggleDetect()
}

/**
 * 检测相片帧的姿势回调
 * @param detectResult
 */
const detectCallback: DetectPoseCallback = (detectResult: DetectResult) => {
  console.log(detectResult)
}

/**
 * 开始按钮点击
 */
const btnStartClick = () => {
  if (!state.isDetect) {
    state.currentState = UIState.onStarting
  } else {
    state.currentState = UIState.init
    unref(poseDetectionView)?.toggleDetect()
  }
}

onMounted(() => {
  setTimeout(() => {
    state.titleEntranceAniName = 'animate__zoomIn'
    state.titleBgUrl = 'http://oss.cache.ren/img/cv-xmxx-logo.png'
    setTimeout(() => {
      state.titleEntranceAniName = 'animate__bounce'
    }, 200);
  }, 400);
})

</script>
<template>
  <div class="tf-container">
    <!--导航栏部分-->
    <div :style="{
      paddingTop: `${state.statusBarHeight}px`,
      height: `${state.toolbarHeight}px`
    }" class="tf-appbar" v-if="state.UIState.appbar">
    </div>

    <!--图层：姿势检测驱动-->
    <div class="tf-layer-pose">
      <PoseDetectionView ref="poseDetectionView" detect-model="BlazePose-Lite" camera-position="front"
                         :detect-callback="detectCallback"/>
    </div>

    <!--图层：背景图层-->
    <div class="tf-layer-bg bg-cover" v-if="state.UIState.background"></div>

    <!--图层：Splash-->
    <div class="tf-layer bg-cover" v-if="state.UIState.splash">
      <!--标题-->
      <div
          :style="`background-image: url(${state.titleBgUrl});`"
          :class="state.titleEntranceAniName"
          class="tf-title bg-cover animate__animated animate__duration-600ms"
      />

      <div class="tf-title-logo bg-cover animate__animated animate__infinite animate__duration-2000ms animate__tada"/>

      <!--标题描述-->
      <div
          class="tf-introduction font-rmtt animate__animated animate__infinite animate__duration-2000ms animate__pulse">
        <div>将手机摄像头打开，对准自己全身，跟着神经网络姿势推理进行运动训练。</div>
        <div>训练结束后看看自己的得分，快来开始吧！</div>
      </div>
    </div>

    <!--图层：动画-->
    <div class="tf-layer-ani">
      <!--开始倒计时动画-->
      <StartAnimation v-if="state.UIState.startAnimate" :start-game="startDetect"/>
    </div>

    <!--底部操作按钮-->
    <div v-if="state.UIState.controlPane" class="tf-footer">
      <div
          class="handle-area inner-element-center animate__animated animate__infinite animate__duration-2000ms animate__pulse">
        <div @click="btnStartClick" class="tf-btn-start"/>
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
    z-index: 9999;
  }

  .tf-layer-pose {
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
    z-index: 10;
  }

  .tf-layer-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(https://mms-voice-fe.cdn.bcebos.com/pdproject/clas/wx-project/home_bg_2109011341.png);
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


    .tf-game-title-deprecated {
      font-family: RMTT;
      font-size: 58px;
      background: linear-gradient(to right, #ff6f00, #ff9100);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      height: fit-content;
    }

    .tf-title-logo {
      width: 100px;
      height: 100px;
      position: absolute;
      right: 20px;
      margin-top: -240px;
      background-image: url(https://mms-voice-fe.cdn.bcebos.com/pdproject/clas/wx-project/figure_icon.png);
    }

    .tf-title {
      width: 84.46vw;
      height: 28.09vw;
      z-index: 10;
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
    z-index: 9999;
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
