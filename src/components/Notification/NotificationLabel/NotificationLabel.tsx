interface NotificationLabelProps {
    textContent: string;
    type: 'success' | 'warning' | 'danger';
    imageContent: string | React.ReactElement;
}

const imgStyle: Record<'success' | 'warning' | 'danger', string> = {
    success: 'bg-ooolab_blue_1 text-white ',
    warning: 'bg-ooolab_warning text-white',
    danger: 'bg-red-500 text-white',
};


const NotificationLabel: React.FC<NotificationLabelProps> = ({
    textContent,
    type,
    imageContent,
}) => {
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
        </div>
    );
};

export default NotificationLabel;
