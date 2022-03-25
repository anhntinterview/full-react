import UnAuthImg from 'assets/img/unauthorized.png';

interface IUnauthorizedProps {
    action: () => void;
}

const Unauthorized: React.FC<IUnauthorizedProps> = ({ action }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <img src={UnAuthImg} alt="unauthorized" />
            <p className="mt-ooolab_m_8 mb-ooolab_m_6 text-ooolab_dark_1 font-semibold text-ooolab_xl">
                Unauthorized action or unknown error
            </p>
            <button
                onClick={action}
                className="bg-ooolab_blue_1 text-white rounded-lg px-ooolab_p_4 py-ooolab_p_2"
            >
                Back to Homepage
            </button>
        </div>
    );
};

export default Unauthorized;
