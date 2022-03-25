import React from 'react';
import { useHistory } from 'react-router-dom';
import h5p from 'assets/SVG/h5p-section.svg';

import { LessonInterface } from 'types/GetListOfWorkspace.type';
import LessonDetailAction from './LessonDetailAction';
import LessonForm from './LessonForm';
import { handleRemoveLesson } from '../../LessonFN';
import { useTranslation } from 'react-i18next';
import { StatusContent } from 'constant/util.const';

interface LessonDetailProps {
    data: LessonInterface | undefined;
    currentWorkspace: string;
    dispatch: React.Dispatch<any>;
    canRemove: boolean;
    setSelectedRemove: React.Dispatch<any>;
}

const statusShadow: Record<any, string> = {
    draft: 'shadow-ooolab_lesson_status bg-ooolab_dark_50 ',
    pending: 'shadow-ooolab_lesson_status_pending bg-ooolab_warning',
    public: 'shadow-ooolab_alert_success bg-ooolab_alert_success',
};

const LessonDetail: React.FC<LessonDetailProps> = ({
    data,
    currentWorkspace,
    dispatch,
    canRemove,
    setSelectedRemove,
}) => {
    const { t: translator } = useTranslation();
    const handleDelete = () => {
        if (data?.id) {
            setSelectedRemove(data?.id);
            handleRemoveLesson(dispatch, currentWorkspace, `${data.id}`);
        }
    };

    return (
        <div className="h-full w-full p-ooolab_p_5 custom-scrollbar overflow-y-scroll">
            <div className="flex justify-between items-center">
                <p>{data?.title}</p>
                <p className="capitalize flex items-center">
                    <span
                        className={`w-ooolab_w_2_root h-ooolab_h_2 rounded-full mr-ooolab_m_2  ${
                            statusShadow[data?.status || 'draft']
                        }`}
                    />
                    <span> {StatusContent(translator, data?.status)}</span>
                </p>
            </div>
            <div>
                {data?.id && (
                    <LessonDetailAction
                        workspaceId={currentWorkspace}
                        lessonId={`${data.id}`}
                        handleDelete={handleDelete}
                        canRemove={canRemove}
                    />
                )}
            </div>
            <div className="w-full">
                <LessonForm tags={[]} formData={data} />
            </div>
            <div className="w-full mt-ooolab_m_8">
                <p className="flex items-center mb-ooolab_m_5">
                    <span className="mr-ooolab_m_1">
                        {translator('LESSON.SECTIONS')}
                    </span>
                    <span className="bg-ooolab_light_blue_0 p-ooolab_p_2 rounded-full w-ooolab_w_6 h-ooolab_h_6 inline-flex justify-center items-center">
                        {(data?.sections && data.sections.length) || 0}
                    </span>
                </p>
            </div>
            {data.sections &&
                data.sections.map((i) => (
                    <div className="w-full mb-ooolab_m_5 p-ooolab_p_5 rounded-lg border border-ooolab_border_logout">
                        <p className="flex justify-between items-center mb-ooolab_m_3 font-medium">
                            <span className="text-ooolab_base text-ooolab_dark_1 ">
                                {i.title}
                            </span>
                            <span className="text-ooolab_sm  text-ooolab_dark_2">
                                {i.files.length} Files
                            </span>
                        </p>
                        {i.files.map((j) => (
                            <p className="flex items-center mb-ooolab_m_2">
                                <img src={h5p} alt="" />
                                <span className="ml-ooolab_m_3">
                                    {j.file_name}
                                </span>
                            </p>
                        ))}
                    </div>
                ))}
        </div>
    );
};

export default LessonDetail;
