import { ref, onUnmounted } from 'vue';

type Seconds = number;

interface PeriodizerOptions {
  default: Seconds | false;
  intervals: Array<Interval>;
}

interface Interval {
  timeleft: Seconds; 
  callEvery: Seconds
}

export function usePeriodizer(
  finalTime: string,
  callback: (time: string) => void,
  config: PeriodizerOptions
) {
  const timer = ref<number | null>(null);

  function startTimer() {
    timer.value = setInterval(() => {
      const currentTimestampUTC = new Date().toISOString();
      const currentDateTime = new Date(currentTimestampUTC);
      const targetDateTime = new Date(finalTime);
      const timeDifferenceInMilliseconds = targetDateTime.getTime() - currentDateTime.getTime();
      const timeDifferenceInSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);

      if (timeDifferenceInSeconds > 0) {
        const currentInterval = findInterval(timeDifferenceInSeconds, config.intervals)

        if (
            !currentInterval && 
            config.default && 
            timeDifferenceInSeconds % config.default === 0
        ) {
          callback(finalTime)
          
        } else if (
            currentInterval && 
            timeDifferenceInSeconds % currentInterval.callEvery === 0
        ) {
          // const extendedTime = new Date(new Date(finalTime).setTime(targetDateTime.getTime()  + currentInterval.callEvery))
          // callback(extendedTime.toISOString())
          callback(finalTime)
        }

      } else {
        stopTimer()
      }
      console.log('diff: ', timeDifferenceInSeconds)
      // console.log(new Date(finalTime).getTime() + )
      
    }, 1000)
  };

  function stopTimer() {
    if (timer.value !== null) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  function findInterval(
    time: Seconds,
    intervals: Array<{ timeleft: Seconds; callEvery: Seconds }>
  ) {
    let currentInterval: Interval | undefined;
    intervals.map((interval: Interval) => {
      time <= interval.timeleft && (
        currentInterval = interval
      )
    })
    // return intervals.find((interval) => time <= interval.timeleft);
    return currentInterval
  };

  function restartTimer() {
    stopTimer();
    startTimer();
  };

  startTimer();

  onUnmounted(() => {
    stopTimer();
  });

  // return { restartTimer };
}