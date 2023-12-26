<template>
  <p>Time remaining: {{ finalTime }} seconds</p>
  <button @click="periodizer.updateFinalTime(new Date(2023,11,26,17,0).getTime() / 1000)">update</button>
  <button @click="periodizer.restartTimer()">restart</button>
  <button @click="periodizer.stop()">stop</button>
  <button @click="periodizer.start()">start</button>
  
  
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { usePeriodizer } from './usePeriodizer';

  const finalTime = ref<number>(new Date(2023,11,26,13,55).getTime() / 1000);

  const updateCallback = (time: number) => {
    console.log('updateCallback!', time)
  };


  const timerConfig = {
    default: 20,
    intervals: [
      { timeleft: 5, callEvery: 1 },
      { timeleft: 10, callEvery: 5 },
      { timeleft: 7, callEvery: 1 },

    ],
  };

  const periodizer = usePeriodizer(finalTime.value, timerConfig);
  periodizer.events.on('action', () => updateCallback(finalTime.value))
  periodizer.events.on('finish', () => console.log('ITS FINISHED!!'))
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
button {
  max-width: fit-content;
}
</style>
