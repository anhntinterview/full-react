import h5pIcon from 'assets/SVG/h5p.svg';
import { useTranslation } from 'react-i18next';
import { SectionState } from 'types/Lesson.type';
interface LessonFormProps {
    section: SectionState;
}

const SectionView: React.FC<LessonFormProps> = ({ section }) => {
    const { t: translator } = useTranslation();

    return (
        <>
            <div className="flex w-full">
                <div className="w-3/4">
                    <h3 className="text-ooolab_dark_1 text-ooolab_lg">
                        <span className="text-ooolab_dark_1 text-ooolab_base font-normal">
                            {section.title}
                            <span className="text-ooolab_dark_2 text-ooolab_sm pl-ooolab_p_4">
                                {section.files && section?.files?.length > 0
                                    ? `${section.files.length} ${translator('FILE')}`
                                    : `  0 ${translator('FILE')}`}
                            </span>
                        </span>
                    </h3>
                </div>
            </div>

            <div className="my-ooolab_m_4">
                {section?.files &&
                    section.files.map((d: any) => (
                        <div className="flex items-center border border-ooolab_dark_1 rounded-sub_tab group hover:bg-ooolab_bg_bar cursor-pointer mb-ooolab_m_3  duration-300">
                            <div className=" w-9/12  ">
                                <div className=" flex items-center w-full">
                                    <div className=" w-1/12 h-1/12  m-ooolab_m_1">
                                        <img
                                            className="  mr-ooolab_m_3 w-ooolab_w_10 h-ooolab_h_10   "
                                            alt=""
                                            src={h5pIcon}
                                        />
                                    </div>
                                    <div className=" text-ooolab_base text-ooolab_text_username">
                                        <p>{d.file_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default SectionView;
