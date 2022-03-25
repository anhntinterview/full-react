import TagRender from 'components/TagRender';
import { FC, useState } from 'react';
import { useHistory } from 'react-router';
import { CourseDetailType } from 'types/Courses.type';
import { LessonInterface } from 'types/GetListOfWorkspace.type';

import ViewDetailActions from './ViewDetailAction';
import CancelChanges from 'assets/SVG/cancel.svg';

import '../../style.css';
import Modal from 'components/Modal';
import { useTranslation } from 'react-i18next';
import { StatusContent } from 'constant/util.const';

interface IViewDetail {
    data: CourseDetailType;
    removeCourse: (courseId: number) => void;
    canRemove: boolean;
}

const Lesson = ({ d }: { d: LessonInterface }) => (
    <div
        onClick={() => history}
        className="px-ooolab_p_5 py-ooolab_p_6 rounded-lg border border-ooolab_border_logout cursor-pointer"
    >
        {d.title}
    </div>
);

const statusShadow: Record<any, string> = {
    draft: 'shadow-ooolab_lesson_status bg-ooolab_dark_50 ',
    pending: 'shadow-ooolab_lesson_status_pending bg-ooolab_warning',
    public: 'shadow-ooolab_alert_success bg-ooolab_alert_success',
};

const ViewDetail: FC<IViewDetail> = ({ data, removeCourse, canRemove }) => {
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
    const { t: translator } = useTranslation();
    const history = useHistory();
    const handleClickLesson = (id: number) => {
        history.push(`/workspace/${data.workspace_id}/lesson/${id}`);
    };

    const handleClickEdit = () =>
        history.push(`/workspace/${data.workspace_id}/course/${data.id}`);

    const handleRemoveCourse = () => removeCourse(data.id);
    return (
        <>
            <Modal
                isOpen={modalConfirmDelete}
                title={translator('MODALS.CONFIRM_DELETE_MODAL.TITLE_TEXT')}
                imgSrc={CancelChanges}
                mainBtn={
                    <button
                        onClick={() => {
                            handleRemoveCourse();
                            setTimeout(() => setModalConfirmDelete(false), 300);
                        }}
                        className="px-ooolab_p_4 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg text-ooolab_xs focus:outline-none"
                    >
                        {translator('MODALS.CONFIRM_DELETE_MODAL.YES_DO_IT')}
                    </button>
                }
                subBtn={
                    <button
                        onClick={() => setModalConfirmDelete(false)}
                        className="px-ooolab_p_4 py-ooolab_p_1 border rounded-lg text-ooolab_xs focus:outline-none"
                    >
                        {translator('MODALS.CONFIRM_DELETE_MODAL.NO_CANCEL')}
                    </button>
                }
                onClose={() => setModalConfirmDelete(false)}
            />
            <div className="flex justify-between items-center mb-ooolab_m_3">
                <p className="w-1/2 text-ooolab_base font-medium text-ooolab_dark_1 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {data.title}
                </p>
                <p className="inline-flex items-center capitalize text-ooolab_dark_2 text-ooolab_xs font-medium">
                    <span
                        className={`w-ooolab_w_2_root h-ooolab_h_2 rounded-full mr-ooolab_m_2  ${
                            statusShadow[data?.status || 'draft']
                        }`}
                    />
                   {StatusContent(translator, data?.status)}
                </p>
            </div>
            <ViewDetailActions
                status={data.status}
                canRemove={canRemove}
                deleteActions={() => setModalConfirmDelete(true)}
                editActions={() => handleClickEdit()}
            />
            {/* Author */}
            <div className="flex items-center mt-ooolab_m_4 border border-ooolab_border_logout rounded-lg ">
                <div className="border-r py-ooolab_p_1_e px-ooolab_p_3 rounded-lg text-ooolab_sm border-ooolab_bar_color">
                    {translator('COURSES.AUTHOR')}
                </div>
                <div className="flex items-center">
                    <img
                        className="w-ooolab_w_5 h-ooolab_h_5 rounded-full mx-ooolab_m_2 "
                        src={data.created_by.avatar_url}
                        alt=""
                    />
                    <p className="text-ooolab_dark_1">
                        {data.created_by.display_name}
                    </p>
                </div>
            </div>

            {/* Tag render */}
            <div className="relative min-h-ooolab_h_18 w-full mt-ooolab_m_4 border rounded-lg pb-ooolab_p_1">
                <span className="w-ooolab_w_25 border-b border-r text-ooolab_sm rounded-lg py-ooolab_p_1 absolute top-0 inline-flex justify-center items-center">
                    {translator('COURSES.DESCRIPTIONS')}
                </span>
                <p className="custom-paragraph text-ooolab_dark_1 px-ooolab_p_1_e text-ooolab_xs">
                    {data.full_description}
                </p>
            </div>
            <div className="mt-ooolab_m_4">
                <TagRender title={translator('TAGS')} data={data.tags} />
            </div>

            {/* Duration */}
            <div className="flex items-center mt-ooolab_m_4 border border-ooolab_border_logout rounded-lg">
                <span className="px-ooolab_p_3 py-ooolab_p_1 text-ooolab_sm rounded-lg border-r border-ooolab_border_logout">
                    {translator('COURSES.DURATIONS')}
                </span>
                <span className="ml-ooolab_m_2 text-ooolab_dark_1 text-ooolab_xs">
                    {data.duration}
                </span>
            </div>

            {/* Lesson */}
            <div className="mt-ooolab_m_4 py-ooolab_p_3">
                <p className="mb-ooolab_m_5">
                    {translator('LESSON.TITLE')}
                    <span className="text-ooolab_xs text-ooolab_dark_1 ml-ooolab_m_3 rounded-sub_tab py-ooolab_p_1_e px-ooolab_p_2 bg-ooolab_light_blue_0">
                        {data.lessons?.length || 0}
                    </span>
                </p>
                {data.lessons?.map((i) => (
                    <div
                        key={`course-lesson-${i.uid}`}
                        onClick={() => handleClickLesson(i.id)}
                        className="mb-ooolab_m_2"
                    >
                        <Lesson d={i} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default ViewDetail;
