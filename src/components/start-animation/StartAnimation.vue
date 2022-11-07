<script lang="ts" setup>
import {onMounted, reactive, watch, watchEffect} from "vue";
import Timer from "./Timer";

const props = defineProps<{
  startGame: ()=>void
}>()

let startCountdownTimer!: Timer

const state: {
  count: number,
  start: boolean, // 控制组件展示
  showCountdownAni: boolean, // 切换倒计时动画 | GO动画
  countdownEntranceAni: boolean, // 控制倒计时入场动画
  countdownExitAni: boolean, // 控制倒计时退场动画
  GOExitAni: boolean, // 控制GO退出动画
  startCountdown: boolean,
  _startDuration: number, // 过度延时 ms
  _countdownEntranceAniDuration: number, // 倒计时动画进场延时 ms
  _countdownExitAniDuration: number, // 倒计时动画退场延时 ms
  _GOEntranceAniDuration: number, // GO进场动画延时 ms
  _GOExitAniDuration: number // GO退场动画延时 ms
} = reactive({
  count: 3,
  start: false, // 控制组件展示
  showCountdownAni: true, // 切换倒计时动画 | GO动画
  countdownEntranceAni: false, // 控制倒计时入场动画
  countdownExitAni: false, // 控制倒计时退场动画
  GOExitAni: false, // 控制GO退出动画

  startCountdown: false,

  _startDuration: 500, // 过度延时 ms
  _countdownEntranceAniDuration: 700, // 倒计时动画进场延时 ms
  _countdownExitAniDuration: 300, // 倒计时动画退场延时 ms
  _GOEntranceAniDuration: 300, // GO进场动画延时 ms
  _GOExitAniDuration: 300 // GO退场动画延时 ms
})

watch(() => state.startCountdown, (newValue, oldValue) => {
  if (newValue) {
    setTimeout(() => {
      startCountdownTimer.start();
      state.start = true
      state.countdownEntranceAni = true
    }, state._startDuration);
  }
})

watch(() => state.countdownEntranceAni, (newValue, oldValue) => {
  if (newValue) {
    // 执行入场动画
    setTimeout(() => {
      state.countdownEntranceAni = false
      state.countdownExitAni = true
    }, state._countdownEntranceAniDuration);
  }
})



watch(() => state.countdownExitAni, (newValue, oldValue) => {
  if (newValue) {
    // 执行退场动画
    setTimeout(() => {
      state.countdownExitAni = false
      state.countdownEntranceAni = true
    }, state._countdownExitAniDuration);
  }
})

onMounted(() => {
  startCountdownTimer = new Timer({
    duration: 3,
    interval: state._countdownEntranceAniDuration + state._countdownExitAniDuration, // 间隔时间为倒计时入场退场延时之和
    intervalCallBack: (time:number) => {
      // 间隔回调
      if (time === 0) {
        return;
      }
      state.count = time
    },
    endCallback: () => {
      // 结束回调
      state.showCountdownAni = false
      setTimeout(() => {
        // 执行GO退场动画
        state.GOExitAni = true
        // 结束事件
        setTimeout(() => {
          props.startGame()
        }, state._GOExitAniDuration);
      }, state._GOEntranceAniDuration + 300);
    }
  });
  state.startCountdown = true
})
</script>
<template>
  <div
      v-if="state.start"
      class="start-animation-container inner-element-center"
  >
    <div
        v-if="state.showCountdownAni"
        :class="`${state.countdownEntranceAni ? 'animate__flipInY animate__duration-700ms' : ''}${state.countdownExitAni ? ' animate__fadeOut animate__duration-300ms' : ''}`"
        class="clock-container inner-element-center animate__animated"
    >{{ state.count }}
    </div>

    <div
        v-else
        :class="state.GOExitAni ? 'animate__zoomOut' : ''"
        class="start animate__animated animate__fadeInDownBig animate__duration-300ms"
    >GO!
    </div>
  </div>

</template>
<style>
.start-animation-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clock-container {
  width: 53.30vw;
  height: 53.30vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(https://mms-voice-fe.cdn.bcebos.com/pdproject/clas/wx-project/clock_210909.png) no-repeat;
  background-size: 100% 100%;
  font-family: RMTT;
  font-weight: 500;
  font-size: 26.65vw;
  color: #4184C3;
}

.start {
  font-family: RMTT;
  font-weight: 500;
  font-size: 40vw;
  color: #4184C3;
}
</style>