<template>
  <p>Time remaining: {{ finalTime }} seconds</p>
  <button @click="() => usePeriodizer(finalTime, () => updateCallback(finalTime), timerConfig)">Click</button>
  
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { usePeriodizer } from './usePeriodizer';

  const finalTime = ref<string>(new Date(2023,11,25,18,0).toISOString());

  const updateCallback = (time: string) => {
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
</script>

<style>

</style>
