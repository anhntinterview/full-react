import SearchInput from 'components/Workspace/CoursesList/components/SearchInput';
import { useTranslation } from 'react-i18next';

interface LessonMenuBarProps {
    onSubmit: (content: string) => void;
}

const LessonMenuBar: React.FC<LessonMenuBarProps> = ({
    onSubmit,
    children,
}) => {
    const { t: translator } = useTranslation();
    return (
        <div className="flex justify-between w-full">
            <div className="flex items-center">
                <div className="w-1/8">{children}</div>
                {/* <p className="text-ooolab_dark_1 font-semibold text-ooolab_xl">
                    {translator('LESSON.TITLE')}
                </p> */}
                <div
                    style={{ width: 1 }}
                    className="bg-ooolab_dark_50 h-8 mx-ooolab_m_3"
                />
                {/* <div className="relative">
                    <input
                        className={`${
                            !open
                                ? 'w-ooolab_w_8 border-none h-ooolab_h_8'
                                : 'w-ooolab_w_64 border-2 border-ooolab_border_logout rounded-sub_tab  pl-ooolab_p_3'
                        } overflow-hidden ease-linear transition-transform duration-500 w-full h-ooolab_h_10 focus:outline-none pr-ooolab_p_9`}
                        type="text"
                        placeholder="Search"
                        onBlur={() => setOpen(false)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                onSubmit(e.target.value);
                            }
                        }}
                    />
                    <SearchIcon
                        onClick={() => setOpen(true)}
                        style={{ top: 10, right: 10 }}
                        className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 absolute cursor-pointer"
                    />
                </div> */}
                <SearchInput onSubmit={onSubmit} />
            </div>
        </div>
    );
};

export default LessonMenuBar;
