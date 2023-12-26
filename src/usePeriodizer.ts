import { ref } from 'vue';
// Убрать callback и написать emitter (назвать onEmit)
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
  finalTime: number,
  config: PeriodizerOptions
) {
  const timer = ref<number | null>(null);
  const finalTimeRef = ref<number>(finalTime * 1000)
  const EventEmitter = require('events');

  const events = new EventEmitter();

  function startTimer() {
    timer.value = setInterval(timerInterval, 1000);
    events.emit('start');
  };

  function timerInterval() {
    // Настоящее время и время окончания таймера в UTC
    const currentTimestampUTC = new Date().toISOString();
    const currentDateTime = new Date(currentTimestampUTC);
    const targetDateTime = new Date(finalTimeRef.value);

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
        events.emit('action')
        
      // Если оставшееся время входит в интервалы и кратно callEvery подходящего интервала 
      } else if (
          currentInterval && 
          timeDifferenceInSeconds % currentInterval.callEvery === 0
      ) {
        events.emit('action')
      }

    } else {
      stopTimer()
      events.emit('finish')
    }
    console.log('diff: ', timeDifferenceInSeconds)
  }

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

  function start() {
    stopTimer();
    startTimer();
  }

  function restartTimer() {
    stopTimer();
    startTimer();
    events.emit('restart')
  };

  function updateFinalTime(time: number) {
    finalTimeRef.value = time * 1000
    restartTimer()
  }

  function stopTimer() {
    if (timer.value !== null) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  function stop() {
    events.emit('stop');
    stopTimer();
  };

  return { 
    events, 
    restartTimer, 
    updateFinalTime, 
    stop,
    start
  };
}