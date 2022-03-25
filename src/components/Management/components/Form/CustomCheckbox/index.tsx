import { UseFormRegister, FieldValues } from 'react-hook-form';

type CustomCheckboxProps = {
    value: number;
    title: string;
    className?: string;
    disabled?: boolean;
    onChange: (checkd: boolean, fieldsValue: number) => void;
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    value,
    title,
    className,
    disabled = false,
    onChange,
}) => {
    return className ? (
        <div className={className}>
            <input
                disabled={disabled}
                className="opacity-0 hidden w-ooolab_w_4 h-ooolab_h_4 border-ooolab_bar_color border custom-input"
                type="checkbox"
                id={`class-${title}`}
                value={value}
                onChange={(e) => {
                    onChange(e.target.checked, value);
                }}
                // {...register(`checkbox_slot.${value}`)}
            />
            <label
                htmlFor={`class-${title}`}
                className="border overflow-hidden rounded-sm border-ooolab_bar_color w-ooolab_w_4 h-ooolab_h_4 flex flex-shrink-0 justify-center items-center mr-ooolab_m_1"
            >
                <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden w-ooolab_w_3 h-ooolab_h_3"
                >
                    <path
                        d="M5.00036 7.58478L9.59636 2.98828L10.3039 3.69528L5.00036 8.99878L1.81836 5.81678L2.52536 5.10978L5.00036 7.58478Z"
                        fill="white"
                    />
                </svg>
            </label>
            <label
                className={`capitalize ${disabled && 'text-gray-200'}`}
                htmlFor={`class-${title}`}
            >
                {title}
            </label>
        </div>
    ) : (
        <>
            <input
                disabled={disabled}
                className="opacity-0 w-ooolab_w_4 h-ooolab_h_4 border-ooolab_bar_color border bg-red-400"
                type="checkbox"
                name=""
                id={`class-${title}`}
            />
            <label
                htmlFor={`class-${title}`}
                className="border rounded-sm border-ooolab_bar_color w-ooolab_w_4 h-ooolab_h_4 flex flex-shrink-0 justify-center items-center mr-ooolab_m_1"
            >
                <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden w-ooolab_w_3 h-ooolab_h_3"
                >
                    <path
                        d="M5.00036 7.58478L9.59636 2.98828L10.3039 3.69528L5.00036 8.99878L1.81836 5.81678L2.52536 5.10978L5.00036 7.58478Z"
                        fill="white"
                    />
                </svg>
            </label>
            <label className="capitalize" htmlFor={`class-${title}`}>
                {title}
            </label>
        </>
    );
};

export default CustomCheckbox;
