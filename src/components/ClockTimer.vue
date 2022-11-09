<script lang="ts" setup>
import {onMounted, onUnmounted, reactive, watch} from "vue";
import Timer from "./start-animation/Timer";

const props = defineProps<{
  gameTime: number,
  timerStatus: 'start' | 'pause' | 'continue',
  endGame: () => void
}>()

const state: {
  isPaused: boolean,
  counter: number,
  isRemind: boolean,
  _gameTimer?: any
} = reactive({
  isPaused: false,
  counter: 0,
  isRemind: false,
  _gameTimer: null
})

watch(() => props.timerStatus, (newValue, oldValue) => {
  const gameTimer = state._gameTimer;
  if (!gameTimer) {
    return;
  }
  switch (newValue) {
    case 'start':
      gameTimer.start();
      break;
    case 'pause':
      gameTimer.pause();
      break;
    case 'continue':
      gameTimer.continue();
      break;
    default:
      break;
  }
})

onMounted(() => {
  state._gameTimer = new Timer({
    duration: props.gameTime,
    intervalCallBack: (time:number) => {
      // 间隔回调
      state.counter = time
      if (time === 5) {
        state.isRemind = true
      }
    },
    endCallback: () => {
      // 结束回调
      props.endGame()
    }
  });
  state.counter = props.gameTime
})

onUnmounted(() => {
  state._gameTimer.destory();
})
</script>
<template>
  <div class="timer-container">
    <div class="timer-icon"></div>
    <div
        class="timer-num inner-element-center"
    >
      <div
          :class="`${state.isRemind&& 'font-red animate__pulsePro'}`"
          class="num animate__animated animate__infinite"
      >{{ state.counter }}
      </div>
      s
    </div>
  </div>
  <div class="timer-container">
    <div class="timer-icon"></div>
    <div
        class="timer-num inner-element-center"
    >
      <div
          :class="`${state.isRemind && 'font-red animate__pulsePro'}`"
          class="num animate__animated animate__infinite"
      >{{ state.counter }}
      </div>
      s
    </div>
  </div>
</template>
<style lang="scss">
.timer-container {
  margin-left: 3.38vw;
  display: flex;
  align-items: center;
  /* flex-wrap: nowrap; */
}

.timer-icon {
  margin-right: 1.44vw;
  width: 8.05vw;
  height: 8.05vw;
  background: url(https://mms-voice-fe.cdn.bcebos.com/pdproject/clas/wx-project/time_icon.png) no-repeat;
  background-size: 100% 100%;
}

.timer-num {
  min-width: 15vw;
  color: #323232;
  font-family: RMTT;
  font-size: 6vw;
  font-weight: bold;
}

.timer-num .num {
  display: inline-block;
  width: 10vw;
  text-align: center;
}

.font-red {
  color: red
}
</style>