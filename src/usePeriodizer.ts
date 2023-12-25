import { ref, onUnmounted } from 'vue';
// TODO: Вернуть все комментарии и описать что делает функцию

// Убрать callback и написать emitter (назвать onEmit)

// FinalTime в мс
type Seconds = number;

// Конфигурация
interface PeriodizerOptions {
  /**
   * По-умолчанию для оставшегося времени свыше максимального описанного в intervals.
   * Если *false* то не вызываем функцию вне описанных интервалов.
   */
  default: Seconds | false,
  /**
   * Массив интервалов
   */
  intervals: Array<Interval>
}

interface Interval {
  /**
     * Оставшееся время (в секундах)
     */
  timeleft: Seconds,
  /**
   * Периодичность вызова (в секундах)
   */
  callEvery: Seconds,
}

export function usePeriodizer(
  finalTime: string,
  callback: (time: string) => void,
  config: PeriodizerOptions
) {
  const timer = ref<number | null>(null);

  function startTimer() {
    timer.value = setInterval(() => {
      // Настоящее время и время окончания таймера в UTC
      const currentTimestampUTC = new Date().toISOString();
      const currentDateTime = new Date(currentTimestampUTC);
      const targetDateTime = new Date(finalTime);

      // Находится разница в миллисекундах между временем окончания таймера и настоящим временем
      const timeDifferenceInMilliseconds = targetDateTime.getTime() - currentDateTime.getTime();
      const timeDifferenceInSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);

      if (timeDifferenceInSeconds > 0) {
        const currentInterval = findInterval(timeDifferenceInSeconds, config.intervals)

        // Если оставшееся время больше всех интервалов и кратно config.default 
        if (
            !currentInterval && 
            config.default && 
            timeDifferenceInSeconds % config.default === 0
        ) {
          callback(finalTime)
          
        // Если оставшееся время входит в интервалы и кратно callEvery подходящего интервала 
        } else if (
            currentInterval && 
            timeDifferenceInSeconds % currentInterval.callEvery === 0
        ) {
          callback(finalTime)
        }

      } else {
        stopTimer()
      }
      console.log('diff: ', timeDifferenceInSeconds)
      
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
    // Сортировка массива по убыванию timeleft
    intervals.sort((intervalFirst, intervalSecond) => intervalSecond.timeleft - intervalFirst.timeleft)
    // Нахождение интервала, который подходит под время
    intervals.map((interval: Interval) => {
      time <= interval.timeleft && (
        currentInterval = interval
      )
    })
    return currentInterval
  };

  function restartTimer() {
    stopTimer();
    startTimer();
  };

  startTimer();

  return { restartTimer };
}