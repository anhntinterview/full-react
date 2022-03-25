import dayjs, { Dayjs } from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import UTC from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';

import { getUserLocalData } from 'utils/handleLocalStorage';

dayjs.extend(RelativeTime);
dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

export const getTimeFromNow = (e: string | number | Date | Dayjs) => {
    // dayjs.locale(vi);
    // console.log(dayjs.locale());
    const i18nData = localStorage.getItem('i18nextLng');
    dayjs.locale(i18nData || '');
    const localData = getUserLocalData();
    const { time_zone } = localData;
    return (
        dayjs
            .utc(e)
            // .tz(time_zone || '')
            .fromNow()
    );
};

export const getDayOfWeekInRange = (
    from: Date | string,
    to: Date | string,
    timezone?: string
) => {
    if (!from || !to) return [];
    const dayWeekStart = dayjs(from).isoWeekday() - 1;
    const endWeekStart = dayjs(to).isoWeekday() - 1;
    const between = dayjs(to).diff(dayjs(from), 'day');
    let listActiveDayInWeek = [];
    if (between >= 7) {
        listActiveDayInWeek = [0, 1, 2, 3, 4, 5, 6];
    } else if (dayWeekStart === endWeekStart) {
        listActiveDayInWeek = [dayWeekStart];
    } else {
        const start = dayWeekStart;
        const tmp = [dayWeekStart];
        for (let index = 1; index <= between; index++) {
            const tmpday = start + index;
            tmp.push(tmpday > 6 ? tmpday - 7 : tmpday);
        }
        listActiveDayInWeek = tmp;
    }

    return listActiveDayInWeek;
};

export const convertTimeFromAPI = (
    time: string,
    timezone: string
): dayjs.Dayjs => {
    
    return dayjs.utc(time).tz(timezone);
};
