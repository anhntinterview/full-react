import { Fragment, FC, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Transition, Popover } from '@headlessui/react';
import { CheckIcon, XIcon } from '@heroicons/react/outline';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import Modal from 'components/Modal';
import ListAdmin from './ListAdmin';

import {
    approveLessonRequest,
    cancelApproval,
    createApproval,
} from '../../LessonBuilderFN';

import ConfirmChanges from 'assets/SVG/confirm-changes.svg';
import CancelChanges from 'assets/SVG/cancel.svg';
import { useTranslation } from 'react-i18next';
interface PublishLessonProps {
    status: 'draft' | 'pending' | 'public' | 'archive' | 'trash' | undefined;
    canPublish: boolean;
}

const PublishLesson: FC<PublishLessonProps> = ({ status, canPublish }) => {
    const params: { id: string; lessonId: string } = useParams();
    const { dispatch } = useContext(GetWorkspaceContext);

    const [isApprove, setIsApprove] = useState(false);
    const [isCancel, setIsCancel] = useState(false);

    const { t: translator } = useTranslation();
    
    return (
        <Popover
            as="div"
            className="relative inline-block text-ooolab_xs font-normal"
        >
            {({ open, close }) => (
                <>
                    <Popover.Button
                        as="button"
                        className={`text-ooolab_sm shadow-ooolab_login_1 px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex
                        ${
                            open
                                ? 'text-ooolab_blue_1 bg-ooolab_light_blue_0'
                                : 'bg-ooolab_blue_1 text-white'
                        } ${status !== 'draft' && 'hidden'} 
                        `}
                    >
                        {translator('LESSON.PUBLISH')}
                    </Popover.Button>

                    <Modal
                        isOpen={isApprove}
                        title={`${translator(
                            'MODALS.CONFIRM_APPROVE_MODAL.TITLE_TEXT'
                        )} ${translator('LESSON.TITLE')}`}
                        imgSrc={ConfirmChanges}
                        mainBtn={
                            <button
                                onClick={() => {
                                    approveLessonRequest(
                                        dispatch,
                                        params.id,
                                        params.lessonId
                                    );
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
                        title={translator(
                            'MODALS.CONFIRM_CANCEL_MODAL.TITLE_TEXT'
                        )}
                        imgSrc={CancelChanges}
                        mainBtn={
                            <button
                                onClick={() => {
                                    cancelApproval(
                                        dispatch,
                                        params.id,
                                        params.lessonId
                                    );
                                    setTimeout(() => setIsCancel(false), 300);
                                }}
                                className="px-ooolab_p_4 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg text-ooolab_xs focus:outline-none"
                            >
                                {translator(
                                    'MODALS.CONFIRM_CANCEL_MODAL.YES_DO_IT'
                                )}
                            </button>
                        }
                        subBtn={
                            <button
                                onClick={() => setIsCancel(false)}
                                className="px-ooolab_p_4 py-ooolab_p_1 border rounded-lg text-ooolab_xs focus:outline-none"
                            >
                                {translator(
                                    'MODALS.CONFIRM_CANCEL_MODAL.NO_CANCEL'
                                )}
                            </button>
                        }
                        onClose={() => setIsCancel(false)}
                    />

                    {status === 'pending' && !canPublish && (
                        <button className="text-ooolab_sm px-ooolab_p_3 py-ooolab_p_2 rounded-lg focus:outline-none flex items-center bg-ooolab_warning text-white">
                            <span className="mr-ooolab_m_1">
                                {translator('LESSON.PENDING_APPROVAL')}
                            </span>
                            <XIcon
                                onClick={() =>
                                    cancelApproval(
                                        dispatch,
                                        params.id,
                                        params.lessonId
                                    )
                                }
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
                                {/* <XIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_1" /> */}
                                {translator('LESSON.DECLINE_APPROVAL')}
                            </button>
                            <button
                                onClick={() => setIsApprove(true)}
                                className="shadow-ooolab_login_1 ml-ooolab_m_2 text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex items-center bg-ooolab_blue_1 text-white"
                            >
                                {/* <CheckIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_1" /> */}
                                <span>
                                    {translator('LESSON.APPROVE_APPROVAL')}
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
                            className="z-9999 bg-white shadow-ooolab_box_shadow_container origin-top-right absolute right-0 mt-2 min-w-ooolab_w_80 rounded-header_menu divide-y divide-gray-100 focus:outline-none"
                        >
                            <ListAdmin
                                close={close}
                                onSubmitApproval={createApproval}
                            />
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default PublishLesson;
