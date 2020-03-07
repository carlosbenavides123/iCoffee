
import { useState, useEffect } from 'react';

export function useCoffee() {

    const [nightTime, setNightTime] = useState(false)
    const [countDown, setCountDown] = useState(false)
    const [countDownTimer, setCountDownTimer] = useState('')
    const [coffeeState, setCoffeeState] = useState('')
    const [appState, setAppState] = useState('')
    const [scannedDevices, setScannedDevices] = useState(new Map)

    function isNightTime() {
        const hours = new Date().getHours()
        const isDayTime = hours > 6 && hours < 20
        console.log(isDayTime)
        if (isDayTime) {
            setNightTime(false)
        } else {
            setNightTime(true)
        }
    }

    useEffect(() => {
        isNightTime()
        setInterval(() => isNightTime(), 10000)
    }, [])

    function startTimer(duration) {
        let timer2 = duration
        var interval = setInterval(function() {
            var timer = timer2.split(':');
            //by parsing integer, I avoid all extra string processing
            var minutes = parseInt(timer[0], 10);
            var seconds = parseInt(timer[1], 10);
            --seconds;
            minutes = (seconds < 0) ? --minutes : minutes;
            seconds = (seconds < 0) ? 59 : seconds;
            seconds = (seconds < 10) ? '0' + seconds : seconds;
            if (minutes < 0) clearInterval(interval);
            if ((seconds <= 0) && (minutes <= 0)) clearInterval(interval);
            timer2 = minutes + ':' + seconds;
            console.log(timer2)
            setCountDownTimer(timer2)
          }, 1000);
    }

    useEffect(() => {
        if(countDown === true) {
            setCountDownTimer("7:00")
            startTimer("7:00")
        }
    }, [countDown])

	return {
		nightTime,
        setNightTime,
        countDown,
        setCountDown,
        countDownTimer,
        setCountDownTimer
	};
}