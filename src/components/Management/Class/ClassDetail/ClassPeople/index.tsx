import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    CheckIcon,
    ExclamationCircleIcon,
    PlusIcon,
} from '@heroicons/react/outline';
import { useBoolean } from 'hooks/custom';
import ModalInviteClass from 'components/Management/components/ModalInviteClass';
import InfiniteClasses from 'components/Management/components/InfiniteClasses';
import { ToastContainer } from 'react-toastify';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { errorNoti, successNoti } from 'components/H5P/H5PFN';
import { MembersClassesType } from 'types/Class.type';
import workspaceService from 'services/workspace.service';
import { useParams } from 'react-router-dom';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { useTranslation } from 'react-i18next';
import { CLASSES_INVITE } from 'actions/workspace.action';

interface ClassPeopleInterface { }

const ClassPeople: React.FC<ClassPeopleInterface> = ({ }) => {
    const { t: translator } = useTranslation();

    const {
        booleanValue: modalInviteTeacher,
        toggleBooleanValue: toggleModalInviteTeacher,
    } = useBoolean();
    const {
        booleanValue: modalInviteStudent,
        toggleBooleanValue: toggleModalInviteStudent,
    } = useBoolean();

    const [dataStudents, setDataStudents] = useState<MembersClassesType>({
        items: [],
        page: 1,
        per_page: 10,
        total: 0,
        sort_by: '',
        order: '',
    });
    const [dataTeachers, setDataTeachers] = useState<MembersClassesType>({
        items: [],
        page: 1,
        per_page: 10,
        total: 0,
        sort_by: '',
        order: '',
    });
    const params: { id: string; classId: string } = useParams();

    const {
        dispatch: dispatchWorkspace,
        getWorkspaceDetailState: { class: classes, result },
    } = useContext(GetWorkspaceContext);
    const {
        membership: { role },
    } = result;
    const {
        inviteEmailClassesStatus,
        statusRemoveMember,
        propertiesRemove,
        typeInvite,
    } = classes;

    useEffect(() => {
        setDataTeachers({
            items: [],
            page: 1,
            per_page: 10,
            total: 0,
            sort_by: '',
            order: '',
        });
        setDataStudents({
            items: [],
            page: 1,
            per_page: 10,
            total: 0,
            sort_by: '',
            order: '',
        });
        console.log("gg")
        workspaceMiddleware.resetInviteClasses(dispatchWorkspace);
    }, []);

    useEffect(() => {
        if (inviteEmailClassesStatus === 'done') {
            setTimeout(() => {
                if (typeInvite === 'student') {
                    workspaceService
                        .getClassesMembers(params.id, params.classId, {
                            type: 'student',
                        })
                        .then((res) => {
                            if (res) {
                                setDataStudents(res);
                                dispatchWorkspace({
                                    type: CLASSES_INVITE.REQ_GET_STUDENT_FINISH,
                                    value: res,
                                });
                            }
                        });
                }
                if (typeInvite === 'teacher') {
                    workspaceService
                        .getClassesMembers(params.id, params.classId, {
                            type: 'teacher',
                        })
                        .then((res) => {
                            if (res) {
                                setDataTeachers(res);
                                dispatchWorkspace({
                                    type: CLASSES_INVITE.REQ_GET_TEACHER_FINISH,
                                    value: res,
                                });
                            }
                        });
                }
            }, 1000);
            successNoti(translator('CLASSES.INVITE_SUCCESS'), <CheckIcon />);
        }
        if (inviteEmailClassesStatus === 'error') {
            errorNoti(
                translator('CLASSES.INVITE_FAIL'),
                <ExclamationCircleIcon />
            );
        } else if (inviteEmailClassesStatus === 'invalid_error') {
            errorNoti(
                translator('CLASSES.INVALID_MEMBER_TYPE'),
                <ExclamationCircleIcon />
            );
        }
        workspaceMiddleware.resetStatusClasses(dispatchWorkspace);
    }, [inviteEmailClassesStatus]);

    useEffect(() => {
        if (statusRemoveMember === 'done') {
            if (propertiesRemove.typeOption === 'teacher') {
                setDataTeachers({
                    ...dataTeachers,
                    items: dataTeachers?.items?.filter(
                        (c) => c.membership.id != propertiesRemove.userId
                    ),
                    total: dataTeachers.total - 1,
                });
            } else if (propertiesRemove.typeOption === 'student') {
                setDataStudents({
                    ...dataStudents,
                    items: dataStudents?.items?.filter(
                        (c) => c.membership.id != propertiesRemove.userId
                    ),
                    total: dataStudents.total - 1,
                });
            }
            successNoti(translator('CLASSES.REMOVE_SUCCESS'), <CheckIcon />);
        }
        if (statusRemoveMember === 'error') {
            errorNoti(
                translator('CLASSES.REMOVE_FAILED'),
                <ExclamationCircleIcon />
            );
        }
        workspaceMiddleware.resetStatusClasses(dispatchWorkspace);
    }, [statusRemoveMember]);

    return (
        <div className="px-ooolab_p_32 text-center mt-ooolab_m_10 outline-none">
            <ToastContainer />
            <div className="flex border-b border-ooolab_bar_color pb-ooolab_p_4">
                <div className="w-9/12 text-left ">
                    <div className="text-ooolab_sm text-ooolab_dark_1 flex font-semibold">
                        {translator('CLASSES.TEACHERS')}
                        <div className="bg-ooolab_gray_11 rounded-full ml-ooolab_m_1 w-ooolab_w_6 h-ooolab_h_6 text-center">
                            <span className="text-ooolab_xs">
                                {dataTeachers.total === -1
                                    ? 0
                                    : dataTeachers.total}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-3/12 flex justify-end">
                    {role === 'admin' && (
                        <div
                            className="h-ooolab_h_7 w-ooolab_w_9 bg-ooolab_dark_300 rounded-ooolab_radius_4px flex justify-center items-center shadow-ooolab_sched_button cursor-pointer"
                            onClick={toggleModalInviteTeacher}
                        >
                            <PlusIcon className="text-white h-ooolab_h_5 w-ooolab_w_5" />
                        </div>
                    )}
                </div>
            </div>
            <div className="h-ooolab_h_25">
                <InfiniteClasses
                    typeUser="teacher"
                    setDataTeachers={setDataTeachers}
                    dataTeachers={dataTeachers}
                    setDataStudents={setDataStudents}
                    dataStudents={dataStudents}
                />
            </div>
            <div className="flex border-b border-ooolab_bar_color pb-ooolab_p_4 mt-ooolab_m_12">
                <div className="w-9/12 text-left ">
                    <div className="text-ooolab_sm text-ooolab_dark_1 flex font-semibold">
                        {translator('CLASSES.STUDENTS')}
                        <div className="bg-ooolab_gray_11 rounded-full ml-ooolab_m_1 w-ooolab_w_6 h-ooolab_h_6 text-center">
                            <span className="text-ooolab_xs">
                                {dataStudents.total === -1
                                    ? 0
                                    : dataStudents.total}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-3/12 flex justify-end">
                    {role === 'admin' && (
                        <div
                            className="h-ooolab_h_7 w-ooolab_w_9 bg-ooolab_dark_300 rounded-ooolab_radius_4px flex justify-center items-center shadow-ooolab_sched_button cursor-pointer"
                            onClick={toggleModalInviteStudent}
                        >
                            <PlusIcon className="text-white h-ooolab_h_5 w-ooolab_w_5" />
                        </div>
                    )}
                </div>
            </div>
            <div className="h-ooolab_h_79">
                <InfiniteClasses
                    typeUser="student"
                    setDataTeachers={setDataTeachers}
                    dataTeachers={dataTeachers}
                    setDataStudents={setDataStudents}
                    dataStudents={dataStudents}
                />
            </div>

            {modalInviteTeacher && (
                <div className="min-h-ooolab_h_60">
                    <ModalInviteClass
                        isOpen={modalInviteTeacher}
                        onClose={toggleModalInviteTeacher}
                        title={translator('CLASSES.INVTE_TEACHERS')}
                        inviteType="teacher"
                    />
                </div>
            )}

            {modalInviteStudent && (
                <div className="min-h-ooolab_h_60">
                    <ModalInviteClass
                        isOpen={modalInviteStudent}
                        onClose={toggleModalInviteStudent}
                        title={translator('CLASSES.INVTE_STUDENTS')}
                        inviteType="student"
                    />
                </div>
            )}
        </div>
    );
};

export default ClassPeople;
