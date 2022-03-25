import { Popover, Transition } from '@headlessui/react';
import Modal from 'components/Modal';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { FC, Fragment, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import ConfirmChanges from 'assets/SVG/confirm-changes.svg';
import CancelChanges from 'assets/SVG/cancel.svg';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import ListAdmin from './ListAdmin';
import workspaceService from 'services/workspace.service';
import workspaceMiddleware from 'middleware/workspace.middleware';
import {
    cancelCourseApproval,
    approveCourseApproval,
    submitApproval,
} from '../../CourseDetailFN';
import { useTranslation } from 'react-i18next';

interface PublishLessonProps {
    status: 'draft' | 'pending' | 'public' | 'archive' | 'trash' | undefined;
    canPublish: boolean;
}

const PublishCourse: FC<PublishLessonProps> = ({ status, canPublish }) => {
    const params: { id: string; courseId: string } = useParams();
    const { dispatch } = useContext(GetWorkspaceContext);
    const { t: translator } = useTranslation();

    const [isApprove, setIsApprove] = useState(false);
    const [isCancel, setIsCancel] = useState(false);

    const handleSubmitApproval = (userId: number, message: string) => {
        return submitApproval(
            dispatch,
            params.id,
            params.courseId,
            userId,
            message
        );
    };

    const handleApproveApproval = () => {
        return approveCourseApproval(dispatch, params.id, params.courseId);
    };

    const handleCancelApproval = () => {
        return cancelCourseApproval(dispatch, params.id, params.courseId);
    };

    return (
        <Popover
            as="div"
            className="relative inline-block text-ooolab_xs font-normal"
        >
            {({ open, close }) => (
                <>
                    <Popover.Button
                        as="button"
                        className={`text-ooolab_sm hover:text-ooolab_blue_1 hover:bg-ooolab_light_blue_0 shadow-ooolab_login_1 px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex
                        ${
                            open
                                ? 'text-ooolab_blue_1 bg-ooolab_light_blue_0'
                                : 'bg-ooolab_blue_1 text-white'
                        } ${status !== 'draft' && 'hidden'} 
                        `}
                    >
                        {translator('COURSES.PUBLISH')}
                    </Popover.Button>

                    <Modal
                        isOpen={isApprove}
                        title={translator(
                            'MODALS.CONFIRM_APPROVE_MODAL.TITLE_TEXT'
                        )}
                        imgSrc={ConfirmChanges}
                        mainBtn={
                            <button
                                onClick={() => {
                                    handleApproveApproval();
                                    setTimeout(() => setIsApprove(false), 300);
                                }}
                                className="px-ooolab_p_4 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg text-ooolab_xs focus:outline-none"
                            >
                                {translator(
                                    'MODALS.CONFIRM_APPROVE_MODAL.YES_DO_IT'
                                )}
                            </button>
                        }
                        subBtn={
                            <button
                                onClick={() => setIsApprove(false)}
                                className="px-ooolab_p_4 py-ooolab_p_1 border rounded-lg text-ooolab_xs focus:outline-none"
                            >
                                {translator(
                                    'MODALS.CONFIRM_APPROVE_MODAL.NO_CANCEL'
                                )}
                            </button>
                        }
                        onClose={() => setIsApprove(false)}
                    />

                    <Modal
                        isOpen={isCancel}
                        title={translator("MODALS.CONFIRM_CANCEL_MODAL.TITLE_TEXT")}
                        imgSrc={CancelChanges}
                        mainBtn={
                            <button
                                onClick={() => {
                                    handleCancelApproval();
                                    setTimeout(() => setIsCancel(false), 300);
                                }}
                                className="px-ooolab_p_4 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg text-ooolab_xs focus:outline-none"
                            >
                                {translator("MODALS.CONFIRM_CANCEL_MODAL.YES_DO_IT")}
                            </button>
                        }
                        subBtn={
                            <button
                                onClick={() => setIsCancel(false)}
                                className="px-ooolab_p_4 py-ooolab_p_1 border rounded-lg text-ooolab_xs focus:outline-none"
                            >
                                {translator("MODALS.CONFIRM_CANCEL_MODAL.NO_CANCEL")}
                            </button>
                        }
                        onClose={() => setIsCancel(false)}
                    />

                    {status === 'pending' && !canPublish && (
                        <button className="text-ooolab_sm px-ooolab_p_3 py-ooolab_p_2 rounded-lg focus:outline-none flex items-center bg-ooolab_warning text-white">
                            <span className="mr-ooolab_m_1">
                                {translator('COURSES.PENDING_APPROVAL')}
                            </span>
                            <XIcon
                                onClick={() => handleCancelApproval()}
                                className="w-ooolab_w_4 h-ooolab_h_4"
                            />
                        </button>
                    )}
                    {status === 'pending' && canPublish && (
                        <div className="flex">
                            <button
                                onClick={() => setIsCancel(true)}
                                className="shadow-ooolab_login_1 text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex items-center bg-ooolab_blue_1 text-white"
                            >
                                <XIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_1" />
                                {translator('COURSES.DECLINE_APPROVAL')}
                            </button>
                            <button
                                onClick={() => setIsApprove(true)}
                                className="shadow-ooolab_login_1 ml-ooolab_m_2 text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex items-center bg-ooolab_blue_1 text-white"
                            >
                                <CheckIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_1" />
                                <span>
                                    {translator('COURSES.APPROVE_APPROVAL')}
                                </span>
                            </button>
                        </div>
                    )}
                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel
                            unmount
                            className="z-9999 bg-white shadow-ooolab_box_shadow_container origin-top-right absolute right-0 mt-2 min-w-ooolab_w_80 rounded-2xl overflow-hidden divide-y divide-gray-100 focus:outline-none"
                        >
                            <ListAdmin
                                close={close}
                                onSubmitApproval={handleSubmitApproval}
                            />
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default PublishCourse;
