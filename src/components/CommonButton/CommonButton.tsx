import React, {ReactNode} from 'react';
import {Transition} from '@headlessui/react';

interface CommonButtonProps {
    classStyle: string;
    title: string;
    Icon?: ReactNode;
    onClickButton?: () => void | void;
    loading: boolean;
    ref?: React.LegacyRef<HTMLButtonElement> | undefined;
    type?: 'bar' | 'circular';
    actionType?: 'submit' | 'reset' | 'button';
    dataTestId?: string | undefined;
}

const CommonButton: React.FC<CommonButtonProps> = (props) => {
    const {
        classStyle,
        loading,
        title,
        Icon,
        onClickButton,
        type = 'circular',
        actionType,
        dataTestId,
    } = props;

    return (
        <button
            data-test-id={dataTestId}
            className={`${classStyle} focus:outline-none overflow-hidden`}
            onClick={onClickButton || undefined}
            type={actionType}
        >
            <Transition
                show={loading}
                enter={`${loading && 'transform transition duration-[300ms]'}`}
                enterFrom={`${loading && 'opacity-0 scale-50'}`}
                enterTo={`${loading && 'opacity-100 rotate-0 scale-100'}`}
                leave={`${
                    !loading &&
                    'transform duration-200 transition ease-in-out duration-[1000ms]'
                }`}
                leaveFrom={`${loading && 'opacity-100 scale-100 '}`}
                leaveTo={`${loading && 'opacity-0 scale-95 '}`}
            >
                {
                    {
                        bar: (
                            <svg
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="20px"
                                height="24px"
                                viewBox="0 0 24 30"
                            >
                                <rect
                                    x="0"
                                    y="10"
                                    width="4"
                                    height="10"
                                    fill="white"
                                    opacity="0.2"
                                >
                                    <animate
                                        attributeName="opacity"
                                        attributeType="XML"
                                        values="0.2; 1; .2"
                                        begin="0s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="height"
                                        attributeType="XML"
                                        values="10; 20; 10"
                                        begin="0s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="y"
                                        attributeType="XML"
                                        values="10; 5; 10"
                                        begin="0s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                </rect>
                                <rect
                                    x="8"
                                    y="10"
                                    width="4"
                                    height="10"
                                    fill="white"
                                    opacity="0.2"
                                >
                                    <animate
                                        attributeName="opacity"
                                        attributeType="XML"
                                        values="0.2; 1; .2"
                                        begin="0.15s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="height"
                                        attributeType="XML"
                                        values="10; 20; 10"
                                        begin="0.15s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="y"
                                        attributeType="XML"
                                        values="10; 5; 10"
                                        begin="0.15s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                </rect>
                                <rect
                                    x="16"
                                    y="10"
                                    width="4"
                                    height="10"
                                    fill="white"
                                    opacity="0.2"
                                >
                                    <animate
                                        attributeName="opacity"
                                        attributeType="XML"
                                        values="0.2; 1; .2"
                                        begin="0.3s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="height"
                                        attributeType="XML"
                                        values="10; 20; 10"
                                        begin="0.3s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="y"
                                        attributeType="XML"
                                        values="10; 5; 10"
                                        begin="0.3s"
                                        dur="0.6s"
                                        repeatCount="indefinite"
                                    />
                                </rect>
                            </svg>
                        ),
                        circular: (
                            <svg
                                className="animate-spin text-white w-ooolab_w_5 h-ooolab_h_5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ),
                    }[type]
                }
            </Transition>
            {!loading &&
            ((Icon && <Icon/>) || (
                <span className={`${loading && 'ease-in-out'}`}>
                        {title}
                    </span>
            ))}
        </button>
    );
};

export default CommonButton;
