const ActionsCircleButton = ({
    icon,
    onclick,
}: {
    icon: React.ReactNode;
    onclick?: () => void;
}) => {
    return (
        <button
            onClick={() => {
                if (onclick) onclick();
            }}
            className="w-ooolab_w_8 h-ooolab_h_8 mr-ooolab_m_1 p-ooolab_p_2 hover:bg-ooolab_light_blue_0 hover:text-ooolab_blue_7 active:bg-ooolab_blue_1 active:text-white active:outline-none rounded-full group"
        >
            {icon}
        </button>
    );
};

export default ActionsCircleButton;
