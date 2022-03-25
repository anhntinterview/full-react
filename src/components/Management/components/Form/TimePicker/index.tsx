import { Control, Controller, FieldValues } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { ClockIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

type TimePickerInputProps = {
    control: Control<any>;
    name: string;
    placeholderText?: string;
    minTime?: Date;
    maxTime?: Date;
    filter?: (time: Date) => boolean;
    defaultValue?: Date;
};

const TimePickerInput: React.FC<TimePickerInputProps> = ({
    control,
    name,
    placeholderText = null,
    minTime = undefined,
    maxTime = null,
    filter,
    defaultValue,
}) => {
    const { t: translator } = useTranslation();

    return (
        <div className="w-full h-ooolab_h_8 relative group flex flex-col justify-center">
            <Controller
                rules={{
                    required: {
                        value: true,
                        message: translator('FORM_CONST.PLEASE_SELECT_A_TIME'),
                    },
                }}
                render={({ field: { onChange, onBlur, value, name, ref } }) => {
                    return (
                        <DatePicker
                            ref={ref}
                            showTimeSelect
                            showTimeSelectOnly
                            clearButtonTitle="Clear"
                            minTime={minTime}
                            maxTime={maxTime}
                            filterTime={filter}
                            placeholderText={placeholderText}
                            selected={value || defaultValue}
                            onChange={onChange}
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            className="border pl-ooolab_p_7 h-full w-full border-ooolab_bar_color text-ooolab_dark_1 py-ooolab_p_2 rounded font-normal"
                        />
                    );
                }}
                control={control}
                name={name}
            />

            <ClockIcon className="w-ooolab_w_4 h-ooolab_h_4 text-ooolab_dark_2 absolute left-ooolab_8px top-ooolab_8px" />
        </div>
    );
};

export default TimePickerInput;
