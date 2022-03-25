export const FORM_CONST = {
    FORGOT_PASSWORD:
        'Enter your registered email below to recieve password reset instructions',
    PASSWORD_RESET_SUCCESS: 'Your password was reset successfully!',
    IS_REQUIRED: 'This field is required',
    MAX_LENGTH: 'You exceeded the max length',
    MIN_LENGTH: 'Password must have at least 6 characters',
    PASSWORD_NOT_MATCH: "Password doesn't match",
    EMAIL_VALIDATE: 'Email is invalid',
    PASSWORD_VALIDATE:
        'Password must at have least 10 characters, at least one capital letter, at least one number AND at least one special character',
    NUMBER_VALIDATE: 'Number only',
    // PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d~!@#$%^&*_\-+=`|\\(){}[\]:;\"\'<>,.?/]{10,64}$/,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*_\-+=`|\\(){}[\]:;\"\'<>,.?/])(?=.*\d)[A-Za-z\d~!@#$%^&*_\-+=`|\\(){}[\]:;\"\'<>,.?/]{10,64}$/,
    EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    NUMBER_REGEX: /^[0-9]*$/,
};

export const FORM_FIlTER: Record<any, any> = {
    typeFilter: {
        H5P_CONTENT: 'H5P',
        LESSON: 'Lesson',
        COURSE: 'Course',
    },
    durationType: {
        MONTH_1: '1 month',
        MONTHS_7: '7 months',
        YEAR_1: '1 year',
    },
    statusType: {
        PENDING: 'Pending',
        PUBLIC: 'Published',
        DRAFT: 'Draft',
        ARCHIVE: 'Archive',
        TRASH: 'Trash',
    },
};

export const TYPE_FILTER = (t: Function): Record<any, string> => {
    const typeFilter = {
        H5P_CONTENT: t('DASHBOARD.ADMIN_APPROVAL.TYPE_H5P'),
        LESSON: t('DASHBOARD.ADMIN_APPROVAL.TYPE_LESSON'),
        COURSE: t('DASHBOARD.ADMIN_APPROVAL.TYPE_COURSE'),
    };
    return typeFilter;
};
