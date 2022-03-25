import * as React from 'react';
import { useCallback } from 'react';

interface PasswordWithEyesProps {
    formProps: any;
    onChange: React.ChangeEventHandler<any>;
    placeholder?: string;
    dataTestId?: string | undefined;
}

const PasswordIcon = () => (
    <svg
        className="w-ooolab_w_4 h-ooolab_h_4"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.00008 2.66634C9.09856 2.66634 10.0001 3.56786 10.0001 4.66634V6.66634H6.00008V4.66634C6.00008 3.56786 6.9016 2.66634 8.00008 2.66634ZM11.3334 6.66634V4.66634C11.3334 2.83148 9.83494 1.33301 8.00008 1.33301C6.16522 1.33301 4.66675 2.83148 4.66675 4.66634V6.66634H4.00008C3.2637 6.66634 2.66675 7.2633 2.66675 7.99967V13.333C2.66675 14.0694 3.2637 14.6663 4.00008 14.6663H12.0001C12.7365 14.6663 13.3334 14.0694 13.3334 13.333V7.99967C13.3334 7.26329 12.7365 6.66634 12.0001 6.66634H11.3334ZM4.00008 7.99967H12.0001V13.333H4.00008V7.99967Z"
            fill="#C7C9D9"
        />
    </svg>
);

export const EyeOpen = () => (
    <svg
        className="w-ooolab_w_5 h-ooolab_h_3_e"
        viewBox="0 0 20 14"
        fill="none"
    >
        <path
            className="group-hover:fill-button_bar_hover"
            d="M13 7C13 8.65685 11.6569 10 10 10C8.34315 10 7 8.65685 7 7C7 5.34315 8.34315 4 10 4C11.6569 4 13 5.34315 13 7Z"
            fill="#C7C9D9"
        />
        <path
            className="group-hover:fill-button_bar_hover"
            d="M19.8944 6.55279C17.7362 2.23635 13.9031 0 10 0C6.09687 0 2.26379 2.23635 0.105573 6.55279C-0.0351909 6.83431 -0.0351909 7.16569 0.105573 7.44721C2.26379 11.7637 6.09687 14 10 14C13.9031 14 17.7362 11.7637 19.8944 7.44721C20.0352 7.16569 20.0352 6.83431 19.8944 6.55279ZM10 12C7.03121 12 3.99806 10.3792 2.12966 7C3.99806 3.62078 7.03121 2 10 2C12.9688 2 16.0019 3.62078 17.8703 7C16.0019 10.3792 12.9688 12 10 12Z"
            fill="#C7C9D9"
        />
    </svg>
);

export const EyeClose = () => (
    <svg className="w-ooolab_w_5 h-ooolab_h_5" viewBox="0 0 20 18" fill="none">
        <path
            className="group-hover:fill-button_bar_hover"
            d="M2.70711 0.292893C2.31658 -0.0976311 1.68342 -0.0976311 1.29289 0.292893C0.902369 0.683417 0.902369 1.31658 1.29289 1.70711L3.71706 4.13127C2.28639 5.20737 1.03925 6.68543 0.105573 8.55279C-0.0351909 8.83432 -0.0351909 9.16569 0.105573 9.44722C2.26379 13.7637 6.09687 16 10 16C11.5552 16 13.0992 15.645 14.5306 14.9448L17.2929 17.7071C17.6834 18.0976 18.3166 18.0976 18.7071 17.7071C19.0976 17.3166 19.0976 16.6834 18.7071 16.2929L2.70711 0.292893ZM13.0138 13.428C12.0343 13.8112 11.0134 14 10 14C7.03121 14 3.99806 12.3792 2.12966 9C2.94721 7.52136 3.98778 6.3794 5.14838 5.56259L7.29237 7.70659C7.10495 8.09822 7 8.53686 7 9.00001C7 10.6569 8.34315 12 10 12C10.4631 12 10.9018 11.8951 11.2934 11.7076L13.0138 13.428Z"
            fill="#C7C9D9"
        />
        <path
            className="group-hover:fill-button_bar_hover"
            d="M16.5523 10.8955C17.0353 10.3402 17.4784 9.70876 17.8703 9C16.0019 5.62078 12.9687 4 9.99996 4C9.88796 4 9.77586 4.00231 9.66374 4.00693L7.87939 2.22258C8.57741 2.07451 9.28752 2 9.99996 2C13.9031 2 17.7362 4.23635 19.8944 8.55279C20.0352 8.83431 20.0352 9.16569 19.8944 9.44721C19.3504 10.5352 18.7 11.491 17.9689 12.3121L16.5523 10.8955Z"
            fill="#C7C9D9"
        />
    </svg>
);

const PasswordWithEyes: React.FC<PasswordWithEyesProps> = ({
    formProps,
    onChange,
    placeholder,
    dataTestId,
}) => {
    const [show, updateShow] = React.useState(false);
    const changeEye = useCallback(() => updateShow(!show), [show]);
    return (
        <div className="w-full ooolab_input_1 flex items-center relative">
            <span className="ooolab_input_icon_1">
                <PasswordIcon />
            </span>
            <input
                data-test-id={dataTestId}
                type={show ? 'text' : 'password'}
                placeholder={placeholder ?? 'Password'}
                className="flex-1 w-full form-input focus:ring-0 focus:outline-none pl-ooolab_p_10 bg-transparent"
                {...formProps}
                name="password"
                onChange={onChange}
            />
            <div
                onClick={changeEye}
                className="flex justify-center items-center w-ooolab_w_8 cursor-pointer group mr-ooolab_m_5"
            >
                {show ? <EyeClose /> : <EyeOpen />}
            </div>
        </div>
    );
};

export default PasswordWithEyes;
