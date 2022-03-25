export const WeekDay = (translator: Function) => {
    const type = {
        0: translator('WEEK.MONDAY'),
        1: translator('WEEK.TUESDAY'),
        2: translator('WEEK.WEDNESDAY'),
        3: translator('WEEK.THURSDAY'),
        4: translator('WEEK.FRIDAY'),
        5: translator('WEEK.SATURDAY'),
        6: translator('WEEK.SUNDAY'),
    };
    return type;
};

export const StatusContent = (translator: Function, t: string) => {
    let text = t;
    switch (t) {
        case 'draft':
            text = translator('STATUS_CONTENT.DRAFT');
            break;
        case 'pending':
            text = translator('STATUS_CONTENT.PENDING');
            break;
        case 'public':
            text = translator('STATUS_CONTENT.PUBLISH');
            break;

        default:
            break;
    }
    return text;
};

export const ListWeekDay = (translator: Function) => {
    const type = [
        {
            name: translator('WEEK.MON'),
            value: 0,
        },
        {
            name: translator('WEEK.TUE'),
            value: 1,
        },
        {
            name: translator('WEEK.WED'),
            value: 2,
        },
        {
            name: translator('WEEK.THU'),
            value: 3,
        },
        {
            name: translator('WEEK.FRI'),
            value: 4,
        },
        {
            name: translator('WEEK.SAT'),
            value: 5,
        },
        {
            name: translator('WEEK.SUN'),
            value: 6,
        },
    ];
    return type;
};

export const SessionDateFormat = 'ddd, DD MMM YYYY HH:mm';

export const SessionServiceFormat = 'YYYY-MM-DDTHH:mm:ss';
