import { ErrorMessage } from '@hookform/error-message';
import { CLASS_DATE_FORMAT } from 'constant/ui.const';
import { ListWeekDay, WeekDay } from 'constant/util.const';
import dayjs from 'dayjs';
import { toInteger } from 'lodash';
import { useCallback, useEffect } from 'react';
import {
    Control,
    DeepMap,
    FieldError,
    FieldValues,
    useFieldArray,
    useForm,
    UseFormWatch,
} from 'react-hook-form';
import { getDayOfWeekInRange } from 'utils/handleFormatTime';
import CustomCheckbox from '../Form/CustomCheckbox';
import DatePickerInput from '../Form/DatePicker';
import TimePickerInput from '../Form/TimePicker';
import { useTranslation } from 'react-i18next';

interface FormCreateSessionProps {
    watch: UseFormWatch<FieldValues>;
    control: Control<FieldValues>;
    errors: DeepMap<FieldValues, FieldError>;
}

const FormCreateSession: React.FC<FormCreateSessionProps> = ({
    watch,
    control,
    errors,
}) => {
    const { t: translator } = useTranslation();

    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: 'time_range', // unique name for your Field Array
        // keyName: "id", default to "id", you can change the key name
        shouldUnregister: false,
    });

    const startDateWatch = watch('class_start_date');
    const endDateWatch = watch('class_end_date');
    const timeslotWatch = watch('time_range');

    const resetTimeslots = useCallback(() => {
        const listAllowWeekday = getDayOfWeekInRange(
            startDateWatch,
            endDateWatch
        );

        const listRemoveValue = timeslotWatch
            ?.filter((i) => !listAllowWeekday.includes(i['weekday']))
            .map((j) => j['weekday']);

        const listRemoveIndex = [];

        fields.forEach((j, index) => {
            if (listRemoveValue.includes(j['weekday'])) {
                listRemoveIndex.push(index);
            }
        });

        remove(listRemoveIndex);
        const listInputsDocument = document.getElementsByClassName(
            'custom-input'
        );
        if (listInputsDocument?.length) {
            for (let i = 0; i < listInputsDocument.length; i++) {
                const inputFields = listInputsDocument[i] as HTMLInputElement;

                if (
                    inputFields &&
                    !listAllowWeekday.includes(toInteger(inputFields.value))
                )
                    inputFields.checked = false;
            }
        }
    }, [timeslotWatch]);

    const handleChangeTimeSlot = useCallback(
        (checked: boolean, fieldsValue: number) => {
            if (checked) {
                append({ weekday: fieldsValue });
            } else {
                const targetIndex = fields.findIndex(
                    (i) => i['weekday'] === fieldsValue
                );
                if (targetIndex > -1) {
                    remove(targetIndex);
                }
            }
        },
        [fields, remove, append]
    );

    const sortedTimeslots = Array.from(fields)
        .map((i, index) => ({ ...i, originalIndex: index }))
        .sort((a, b) => a['weekday'] - b['weekday']);
    const listActiveDay = getDayOfWeekInRange(startDateWatch, endDateWatch);

    useEffect(() => {
        resetTimeslots();
    }, [startDateWatch, endDateWatch]);


    return (
        <>
            <div className="col-span-1">
                <label
                    className="text-ooolab_dark_1 text-ooolab_xs font-semibold leading-ooolab_24px block"
                    htmlFor="class_start_date"
                >
                    {translator('CLASSES.START_DATE')}
                </label>
                <div className="w-full h-ooolab_h_8 relative">
                    <DatePickerInput
                        control={control}
                        name="class_start_date"
                        placeholderText={CLASS_DATE_FORMAT}
                        maxDate={endDateWatch}
                        minDate={new Date()}
                        isRequired
                    />
                </div>
                <ErrorMessage
                    className="text-red-500 text-ooolab_10px"
                    errors={errors}
                    name="class_start_date"
                    as="p"
                />
            </div>
            <div className="col-span-1">
                <label
                    className="text-ooolab_dark_1 text-ooolab_xs font-semibold leading-ooolab_24px block"
                    htmlFor="class_end_date"
                >
                    {translator('CLASSES.END_DATE')}
                </label>
                <div className="w-full h-ooolab_h_8 relative">
                    <DatePickerInput
                        control={control}
                        name="class_end_date"
                        placeholderText={CLASS_DATE_FORMAT}
                        minDate={startDateWatch}
                        isRequired
                    />
                </div>
                <ErrorMessage
                    className="text-red-500 text-ooolab_10px"
                    errors={errors}
                    name="class_end_date"
                    as="p"
                />
            </div>
            <div className="col-span-2 text-ooolab_dark_1">
                <p className="text-ooolab_xs font-semibold mb-ooolab_m_1">
                    {translator('CLASSES.CLASS_DAYS')}
                </p>
                <div className="grid grid-cols-7 gap-x-2">
                    {ListWeekDay(translator).map((i, index) => {
                        return (
                            <CustomCheckbox
                                key={`class-slot-${i.name}`}
                                className="flex col-span-1 items-center text-ooolab_10px font-semibold leading-ooolab_24px"
                                value={i.value}
                                title={i.name}
                                onChange={handleChangeTimeSlot}
                                disabled={!listActiveDay.includes(i.value)}
                            />
                        );
                    })}
                </div>
            </div>
            <p className="font-bold"> {translator('CLASSES.TIME_SLOT')}</p>
            <div className="col-span-2 h-3/5 ">
                {(sortedTimeslots.length &&
                    sortedTimeslots.map((field) => {
                        const fieldValue = timeslotWatch.find(
                            (i: { weekday: any }) =>
                                i.weekday === field['weekday']
                        );
                        const filterPassedTime = (time) => {
                            return fieldValue['start_time']
                                ? dayjs(time).isAfter(fieldValue['start_time'])
                                : true;
                        };
                        const filterBeforeTime = (time) =>
                            fieldValue['end_time']
                                ? dayjs(time)
                                      .set('milliseconds', 0)
                                      .isBefore(
                                          dayjs(fieldValue['end_time']).set(
                                              'milliseconds',
                                              0
                                          )
                                      )
                                : true;
                        return (
                            <div
                                className="grid grid-cols-5 mb-ooolab_m_2 items-center gap-x-3"
                                key={`${field.id}`}
                            >
                                <label
                                    className="col-span-1 inline-flex align-middle capitalize text-ooolab_dark_2 font-semibold"
                                    htmlFor={field.id}
                                >
                                    {WeekDay(translator)[field['weekday']]}
                                </label>
                                <div className="col-span-2">
                                    <TimePickerInput
                                        control={control}
                                        name={`time_range.${field.originalIndex}.start_time`}
                                        placeholderText={translator(
                                            'CLASSES.START_DATE'
                                        )}
                                        filter={filterBeforeTime}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <TimePickerInput
                                        control={control}
                                        name={`time_range.${field.originalIndex}.end_time`}
                                        placeholderText={translator(
                                            'CLASSES.END_DATE'
                                        )}
                                        filter={filterPassedTime}
                                    />
                                </div>
                                <div className="col-span-1"></div>
                                <div className="col-span-2">
                                    <ErrorMessage
                                        className="text-red-500 text-ooolab_10px min-h-button"
                                        errors={errors}
                                        name={`time_range.${field.originalIndex}.start_time`}
                                        as="p"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <ErrorMessage
                                        className="text-red-500 text-ooolab_10px min-h-button"
                                        errors={errors}
                                        name={`time_range.${field.originalIndex}.end_time`}
                                        as="p"
                                    />
                                </div>
                            </div>
                        );
                    })) || (
                    <p className="text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px">
                        {translator('CLASSES.NO_CLASS')}
                    </p>
                )}
            </div>
        </>
    );
};

export default FormCreateSession;
