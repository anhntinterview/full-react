import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { EyeIcon, XIcon } from '@heroicons/react/outline';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';

import { getTimeFromNow } from 'utils/handleFormatTime';

import TagRender from 'components/TagRender';

import { Link } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import { CourseIcon } from 'constant/workspace.const';
import { ChevronRightIcon } from '@heroicons/react/solid';
import PublishCourse from 'components/Workspace/CourseDetail/component/PublishCourse';
import { useTranslation } from 'react-i18next';

const statusShadow: Record<any, string> = {
    draft: 'shadow-ooolab_lesson_status bg-ooolab_dark_50 ',
    pending: 'shadow-ooolab_lesson_status_pending bg-ooolab_warning',
    public: 'shadow-ooolab_alert_success bg-ooolab_alert_success',
};

const RenderActionButton = ({
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

const AdminViewDetailCourse = () => {
    const params: { courseId: string; id: string } = useParams();
    const { t: translator } = useTranslation();
    const {
        dispatch,
        getWorkspaceDetailState: { course, result: workspaceDetail },
    } = useContext(GetWorkspaceContext);

    const { detail, updateDetailStatus } = course;

    useEffect(() => {
        workspaceMiddleware.getCourseDetail(
            dispatch,
            params.id,
            params.courseId
        );
        // workspaceMiddleware.getWorkspace(dispatch, {
        //     id: params.id,
        // });
    }, []);

    useEffect(() => {
        if (updateDetailStatus === 'init') {
            return;
        }

        workspaceMiddleware.getCourseDetail(
            dispatch,
            params.id,
            params.courseId
        );
    }, [updateDetailStatus]);

    useEffect(() => {
        if (workspaceDetail.id !== -1) {
            const {
                membership: { user_id: currentUserId, role },
            } = workspaceDetail;
        }
    }, [workspaceDetail]);

    return (
        <div className="px-ooolab_p_16 w-full h-screen relative">
            <ToastContainer />
            <div className="grid auto-rows-max grid-cols-6 gap-x-ooolab_w_8 h-full">
                <div className="col-span-4 h-ooolab_top_sidebar flex items-center text-ooolab_lg font-semibold">
                    <Link to={`/workspace/${params.id}/admin`}>
                        <p className="text-ooolab_xl font-semibold text-ooolab_dark_2">
                            Admin
                        </p>
                    </Link>
                    <ChevronRightIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_1" />
                    <p className="text-ooolab_dark_1"> {detail?.title}</p>
                </div>
                <div className="col-span-2 h-ooolab_top_sidebar flex justify-end items-center ">
                    <PublishCourse canPublish={true} status={detail?.status} />
                    <Link to={`/workspace/${params.id}/admin`}>
                        <div className="w-ooolab_w_8 h-ooolab_h_8 rounded-full  ml-ooolab_m_4 flex justify-center items-center group hover:shadow-ooolab_box_shadow_2 ">
                            <XIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 cursor-pointer focus:outline-none  group-hover:text-ooolab_blue_1" />
                        </div>
                    </Link>
                </div>
                <div className="col-span-2 rounded-ooolab_h5p w-full h-ooolab_below_top_sidebar shadow-ooolab_box_shadow_container px-ooolab_p_5 py-ooolab_p_5 custom-scrollbar">
                    <div className="h-3/6 w-full">
                        {/* course image and status */}
                        <div className="flex justify-between mb-ooolab_m_4">
                            <div
                                style={
                                    (detail?.thumbnail && {
                                        backgroundImage: `url("${detail?.thumbnail}")`,
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                    }) ||
                                    {}
                                }
                                className="relative bg-gray-50 w-2/3 max-h-ooolab_h_45 min-h-ooolab_h_45 rounded-xl overflow-hidden filter group drop-shadow"
                            >
                                <div className="bg-img-course bg-no-repeat bg-cover absolute w-full bottom-0 left-0 z-20">
                                    <div className="w-full h-full px-ooolab_p_3 py-ooolab_p_2 bg-opacity-10 group-hover:bg-opacity-5 ">
                                        <p className="mb-ooolab_m_2 text-ooolab_xs text-ooolab_dark_2 opacity-0">
                                            {(detail &&
                                                getTimeFromNow(
                                                    detail.updated_on
                                                )) ||
                                                ''}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <p className="w-3/4 overflow-hidden overflow-ellipsis whitespace-nowrap text-ooolab_dark_1 font-medium text-ooolab_base">
                                                {detail?.title}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="capitalize flex items-center h-ooolab_h_4 text-ooolab_xs text-ooolab_dark_2">
                                <span
                                    className={`w-ooolab_w_2_root h-ooolab_h_2 rounded-full mr-ooolab_m_2  ${
                                        statusShadow[detail?.status || 'draft']
                                    }`}
                                />
                                {detail?.status}
                            </p>
                        </div>
                        {/* Course action */}
                        <div className={` text-ooolab_dark_2 mb-ooolab_m_4`}>
                            <RenderActionButton
                                icon={
                                    <EyeIcon className="w-ooolab_w_4 h-ooolab_h_4" />
                                }
                            />
                        </div>
                        {/* author */}
                        <div className="flex items-center mb-ooolab_m_4 border border-ooolab_border_logout rounded-lg ">
                            <div className="border-r py-ooolab_p_1_e px-ooolab_p_3 rounded-lg text-ooolab_sm border-ooolab_bar_color">
                                Author
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="w-ooolab_w_5 h-ooolab_h_5 rounded-full mx-ooolab_m_2 "
                                    src={
                                        detail?.created_by
                                            ? detail.created_by.avatar_url
                                            : ''
                                    }
                                    alt=""
                                />
                                <p className="text-ooolab_dark_1">
                                    {detail?.created_by
                                        ? detail.created_by.display_name
                                        : ''}
                                </p>
                            </div>
                        </div>

                        {(detail?.status !== 'draft' && (
                            <div className="relative mb-ooolab_m_4 min-h-ooolab_h_18 w-full mt-ooolab_m_4 border rounded-lg pb-ooolab_p_1">
                                <span className="w-ooolab_w_25 border-b border-r text-ooolab_sm rounded-lg py-ooolab_p_1 absolute top-0 inline-flex justify-center items-center">
                                    Descriptions
                                </span>
                                <p className="custom-paragraph text-ooolab_dark_1 px-ooolab_p_1_e text-ooolab_xs">
                                    {detail?.full_description}
                                </p>
                            </div>
                        )) ||
                            null}

                        <div className="mb-ooolab_m_4">
                            <TagRender
                                title={translator('TAGS')}
                                data={detail?.tags}
                            />
                        </div>

                        {/* Duration */}
                        <div className="flex items-center mb-ooolab_m_4 border border-ooolab_border_logout rounded-lg">
                            <span className="px-ooolab_p_3 py-ooolab_p_1 text-ooolab_sm rounded-lg border-r border-ooolab_border_logout">
                                Durations
                            </span>
                            <span className="ml-ooolab_m_2 text-ooolab_dark_1 text-ooolab_xs">
                                {detail?.duration}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 h-ooolab_below_top_sidebar px-ooolab_p_5 py-ooolab_p_6 shadow-ooolab_box_shadow_container rounded-3xl relative">
                    <p>
                        Lesson
                        <span className="text-ooolab_xs text-ooolab_dark_1 ml-ooolab_m_2 rounded-sub_tab py-ooolab_p_1_e px-ooolab_p_2 bg-ooolab_light_blue_0">
                            {detail?.lessons?.length || '0'}
                        </span>
                    </p>
                    <div className="h-auto max-h-full overflow-y-scroll custom-scrollbar py-ooolab_p_7">
                        <div className="">
                            {detail?.lessons?.map((i) => (
                                <div className="flex items-center bg-ooolab_light_blue_0 rounded-sub_tab group hover:bg-ooolab_bg_bar cursor-pointer mb-ooolab_m_3  duration-300 w-full">
                                    <div className="  w-full  ">
                                        <div className=" flex items-center">
                                            <div className=" w-ooolab_w_10 h-ooolab_h_10  m-ooolab_m_1">
                                                <CourseIcon active />
                                            </div>
                                            <div className=" text-ooolab_base text-ooolab_text_username w-8/12">
                                                <p className="text-ooolab_sm font-medium text-ooolab_dark_1">
                                                    {i.title}
                                                </p>
                                            </div>
                                            <div className=" text-ooolab_base text-ooolab_text_username">
                                                <p className="text-ooolab_dark_2 font-medium text-ooolab_sm">
                                                    {i.sections
                                                        ? i.sections.length > 1
                                                            ? `${i.sections.length} Sections`
                                                            : `${i.sections.length} Section`
                                                        : `0 Section`}{' '}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminViewDetailCourse;
