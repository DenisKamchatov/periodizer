<template>
  <p>Time remaining: {{ finalTime }} seconds</p>
  <button @click="() => usePeriodizer(finalTime, () => updateCallback(finalTime), timerConfig)">Click</button>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { usePeriodizer } from './usePeriodizer';

  const finalTime = ref<string>(new Date(2023,11,20,19,30).toISOString());

  const updateCallback = (time: string) => {
    console.log('updateCallback!', time)
  };

  const timerConfig = {
    default: false,
    intervals: [
      { timeleft: 10, callEvery: 5 },
      { timeleft: 5, callEvery: 1 },
    ],
  };
</script>

<style>

</style>
