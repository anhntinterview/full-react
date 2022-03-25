import { Control, Controller, FieldValues } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { CalendarIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

type DatePickerInputProps = {
    control: Control<any>;
    name: string;
    placeholderText?: string;
    minDate?: Date;
    maxDate?: Date;
    isRequired?: boolean;
    disabled?: boolean;
};

const DatePickerInput: React.FC<DatePickerInputProps> = ({
    control,
    name,
    placeholderText = null,
    minDate = null,
    maxDate = null,
    isRequired,
    disabled = false,
}) => {
    const { t: translator } = useTranslation();

    return (
        <div className="w-full h-ooolab_h_8 relative group text-ooolab_xs">
            <Controller
                rules={{
                    required: {
                        value: isRequired,
                        message: translator('FORM_CONST.REQUIRED_FIELD'),
                    },
                }}
                control={control}
                name={name}
                render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                    <DatePicker
                        disabled={disabled}
                        ref={ref}
                        minDate={minDate}
                        maxDate={maxDate}
                        placeholderText={placeholderText}
                        selected={value}
                        onChange={onChange}
                        dateFormat="yyyy-MM-dd"
                        className="border pl-ooolab_p_7 h-full w-full border-ooolab_bar_color text-ooolab_dark_1 py-ooolab_p_2 rounded font-normal"
                    />
                )}
            />

            <CalendarIcon className="w-ooolab_w_4 h-ooolab_h_4 text-ooolab_dark_2 absolute left-ooolab_8px top-ooolab_8px" />
        </div>
    );
};

export default DatePickerInput;
