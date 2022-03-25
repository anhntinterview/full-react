import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface INotificationWithUndo {
    onClickCancel?: () => Promise<boolean>;
    imageContent: string | React.ReactElement;
    textContent: string;
    type: 'success' | 'warning' | 'danger';
}

const textStyle: Record<'success' | 'warning' | 'danger', string> = {
    success: 'text-ooolab_blue_1',
    warning: 'text-oolab_warning',
    danger: 'text-red-500',
};

const imgStyle: Record<'success' | 'warning' | 'danger', string> = {
    success: 'bg-ooolab_blue_1 text-white ',
    warning: 'bg-ooolab_warning text-white',
    danger: 'bg-red-500 text-white',
};

const NotificationWithUndo: React.FC<INotificationWithUndo> = ({
    onClickCancel,
    imageContent,
    textContent,
    type,
}) => {
    const { t: translator } = useTranslation();

    const [loadingCancel, setLoadingCancel] = useState(false);

    return (
        <div className="p-ooolab_p_3 bg-white flex justify-between items-center">
            <div
                className={`w-ooolab_w_14 h-ooolab_w_14 rounded-lg inline-flex justify-center items-center mr-ooolab_m_2 ${imgStyle[type]}`}
            >
                <div className="w-ooolab_w_6 h-ooolab_h_6">
                    {(typeof imageContent === 'string' && (
                        <img
                            src={imageContent}
                            className="h-full w-full"
                            alt=""
                        />
                    )) ||
                        imageContent}
                </div>
            </div>
            <p className="mr-ooolab_m_2 text-ooolab_xs text-center text-ooolab_dark_1">
                {textContent}
            </p>
            {(onClickCancel && !loadingCancel && (
                <button
                    onClick={() => {
                        setLoadingCancel(true);
                        onClickCancel().finally(() => {
                            setTimeout(() => {
                                setLoadingCancel(false);
                                toast.dismiss();
                            }, 1000);
                        });
                    }}
                    className={textStyle[type]}
                >
                    {translator('UNDO')}
                </button>
            )) || (
                <svg
                    className="animate-spin w-ooolab_w_5 h-ooolab_h_5 opacity-100 top-1/2 left-1/2"
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
                        fill="red"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
        </div>
    );
};

export default NotificationWithUndo;
