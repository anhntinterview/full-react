import { useTranslation } from 'react-i18next';
import { LessonInterface, TagType } from 'types/GetListOfWorkspace.type';
import TagRender from '../../../../TagRender';

interface LessonFormProps {
    formData: LessonInterface | undefined;
    editable?: boolean;
    tags: TagType[];
}

const LessonForm: React.FC<LessonFormProps> = ({
    formData,
    editable = false,
    tags,
}) => {
    const { t: translator } = useTranslation();
    return (
        <form className="mt-ooolab_m_4">
            <div className="relative h-ooolab_h_8 border-ooolab_bar_color border rounded-lg mb-ooolab_m_4">
                <div className="absolute top-0 left-0 flex items-center justify-center h-full  ">
                    <label
                        className="border-r rounded-lg h-full text-ooolab_base px-ooolab_p_3 border-ooolab_bar_color"
                        htmlFor="author"
                    >
                        <span className="text-ooolab_sm text-ooolab_dark_1">
                            {translator('LESSON.AUTHOR')}
                        </span>
                    </label>
                    <div className="flex items-center">
                        <img
                            className="w-ooolab_w_5 h-ooolab_h_5 rounded-full mx-ooolab_m_2 "
                            src={formData?.created_by.avatar_url}
                            alt=""
                        />
                        <p className="text-ooolab_dark_1">
                            {formData?.created_by.display_name}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mb-ooolab_m_4">
                <TagRender
                    title={translator('LESSON.COURSES')}
                    isEditable={false}
                />
            </div>
            <TagRender
                title={translator('TAGS')}
                data={formData?.tags}
                isEditable={false}
            />
        </form>
    );
};

export default LessonForm;
