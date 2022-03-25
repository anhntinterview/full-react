import {
    Dispatch,
    FC,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { useParams } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MembersClassesType } from 'types/Class.type';

import './style.css';
import OptionPeopleCLasses from '../OptionPeopleCLasses/OptionPeopleCLasses';
import TeacherList from 'components/Management/Teacher/TeacherList';

interface ModalInfiniteClassesProps {
    typeUser: 'teacher' | 'student';
    setDataTeachers?: Dispatch<SetStateAction<MembersClassesType>>;
    dataTeachers?: MembersClassesType;
    setDataStudents?: Dispatch<SetStateAction<MembersClassesType>>;
    dataStudents?: MembersClassesType;
}

interface RenderItemProps extends ModalInfiniteClassesProps {
    dataRender: MembersClassesType;
    role: string;
}

const RenderItem: FC<RenderItemProps> = ({ dataRender, typeUser, role }) => {
    return (
        <>
            {dataRender?.items.map((i, index) => (
                <div key={index} className="flex py-ooolab_p_1_e">
                    <div className="flex w-3/4 items-center text-ooolab_sm">
                        <img
                            src={i.avatar_url}
                            className="w-ooolab_w_8 h-ooolab_h_8 p-ooolab_p_1 rounded-ooolab_circle mr-ooolab_m_2"
                        />
                        {i.email}
                    </div>
                    <div className="relative w-1/4 flex justify-end">
                        {role === 'admin' && (
                            <OptionPeopleCLasses
                                itemOptions={i}
                                typeUser={typeUser}
                            />
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

const InfiniteClasses: FC<ModalInfiniteClassesProps> = ({
    typeUser,
    setDataStudents,
    setDataTeachers,
    dataStudents,
    dataTeachers,
}) => {
    const {
        dispatch: dispatchWorkspace,
        getWorkspaceDetailState: { class: classes, result },
    } = useContext(GetWorkspaceContext);

    const {
        membership: { role },
    } = result;

    const { listStudent, listTeacher, loading } = classes;

    const params: { id: string; classId: string } = useParams();

    function getData() {
        if (typeUser === 'student') {
            workspaceMiddleware.getStudentClasses(
                dispatchWorkspace,
                params.id,
                params.classId
            );
        } else {
            workspaceMiddleware.getTeacherClasses(
                dispatchWorkspace,
                params.id,
                params.classId
            );
        }
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         if (inviteEmailClassesStatus === 'done') {
    //             if (typeInvite === 'student') {
    //                 workspaceService
    //                     .getClassesMembers(params.id, params.classId, {
    //                         type: 'student',
    //                     })
    //                     .then((res) => {
    //                         if (res) {
    //                             setDataStudents(res);
    //                         }
    //                     });
    //             }
    //             if (typeInvite === 'teacher') {
    //                 workspaceService
    //                     .getClassesMembers(params.id, params.classId, {
    //                         type: 'teacher',
    //                     })
    //                     .then((res) => {
    //                         if (res) {
    //                             setDataTeachers(res);
    //                         }
    //                     });
    //             }
    //         }
    //     }, 1000);
    // }, [inviteEmailClassesStatus]);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        console.log(listStudent)
        if (listStudent?.page != 1) {
            setDataStudents({
                items: dataStudents?.items.concat(listStudent.items),
                order: listStudent?.order,
                page: listStudent?.page,
                per_page: listStudent?.per_page,
                sort_by: listStudent?.sort_by,
                total: listStudent?.total,
            });
        } else {
            setDataStudents({
                items: listStudent.items,
                order: listStudent?.order,
                page: listStudent?.page,
                per_page: listStudent?.per_page,
                sort_by: listStudent?.sort_by,
                total: listStudent?.total,
            });
        }
    }, [listStudent]);
    useEffect(() => {
        if (listTeacher?.page != 1) {
            setDataTeachers({
                items: dataTeachers?.items.concat(listTeacher.items),

                order: listTeacher?.order,
                page: listTeacher?.page,
                per_page: listTeacher?.per_page,
                sort_by: listTeacher?.sort_by,
                total: listTeacher?.total,
            });
        } else {
            setDataTeachers({
                items: listTeacher.items,

                order: listTeacher?.order,
                page: listTeacher?.page,
                per_page: listTeacher?.per_page,
                sort_by: listTeacher?.sort_by,
                total: listTeacher?.total,
            });
        }
    }, [listTeacher]);

    const handlePagination = () => {
        console.log('here');

        if (typeUser === 'student') {
            workspaceMiddleware.getStudentClasses(
                dispatchWorkspace,
                params.id,
                params.classId,
                listStudent.page + 1
            );
        } else {
            workspaceMiddleware.getTeacherClasses(
                dispatchWorkspace,
                params.id,
                params.classId,
                listTeacher.page + 1
            );
        }
    };

    // useEffect(() => {
    //     if (statusRemoveMember === 'done') {
    //         if (propertiesRemove.typeOption === 'teacher') {
    //             setDataTeachers({
    //                 ...dataTeachers,
    //                 items: dataTeachers?.items?.filter(
    //                     (c) => c.id != propertiesRemove.userId
    //                 ),
    //             });
    //         } else if (propertiesRemove.typeOption === 'student') {
    //             setDataStudents({
    //                 ...dataStudents,
    //                 items: dataStudents?.items?.filter(
    //                     (c) => c.id != propertiesRemove.userId
    //                 ),
    //             });
    //         }
    //     }
    // }, [statusRemoveMember]);

    return (
        <div className="mt-ooolab_m_3 w-full text-left" id="scrollableDiv">
            {(typeUser === 'student' && (
                <InfiniteScroll
                    dataLength={dataStudents.items?.length}
                    next={handlePagination}
                    hasMore={dataStudents.items.length !== dataStudents.total}
                    loader={loading && <h4>Loading...</h4>}
                    height={'calc(280*(100vw/1440))'}
                    scrollableTarget="scrollableDiv"
                    className="custom-style-scrollbar"
                >
                    <RenderItem
                        dataRender={dataStudents}
                        typeUser={typeUser}
                        role={role}
                    />
                </InfiniteScroll>
            )) || (
                    <InfiniteScroll
                        dataLength={dataTeachers.items?.length}
                        next={handlePagination}
                        hasMore={dataTeachers.items.length !== dataTeachers.total}
                        loader={loading && <h4>Loading...</h4>}
                        height={'calc(128*(100vw/1440))'}
                        scrollableTarget="scrollableDiv"
                        className="custom-style-scrollbar"
                    >
                        <RenderItem
                            dataRender={dataTeachers}
                            typeUser={typeUser}
                            role={role}
                        />
                    </InfiniteScroll>
                )}
        </div>
    );
};

export default InfiniteClasses;
