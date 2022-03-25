import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from "react-i18next";

const SECONDS = 59 * 1000;
let due = 0;
let task = 0;

const SendCodeTimer: React.FC<{ onDone: () => void }> = ({onDone}) => {
    const {t: translator} = useTranslation();
    const current = useRef(0);
    const count = useRef(60);
    const currentNow = useRef(new Date().getTime());
    const [now, updateNow] = useState(new Date().getTime());
    const timer = (time: number) => {
        if (current.current === 0) {
            current.current = time;
            task = requestAnimationFrame(timer);
        } else if (time - current.current >= 1000) {
            const now = new Date().getTime();
            count.current =
                time - current.current > 1500
                    ? Math.ceil((due - now) / 1000)
                    : count.current - 1;
            current.current = time;
            currentNow.current = now;
            updateNow(now);
        }
        if (count.current > 0) {
            task = requestAnimationFrame(timer);
        }
    };
    useEffect(() => {
        due = new Date().getTime() + SECONDS;
        task = requestAnimationFrame(timer);
        return () => {
            due = 0;
            cancelAnimationFrame(task);
        };
    }, []);
    // const remaining = Math.ceil((due - now) / 1000);
    useEffect(() => {
        if (count.current <= 0) {
            onDone();
        }
    }, [count.current]);
    return <span>{translator('AUTHENTICATION.SIGN_UP.VERIFY_EMAIL.AGAIN_IN_TIME', {time: count.current})}</span>;
};

export default SendCodeTimer;
