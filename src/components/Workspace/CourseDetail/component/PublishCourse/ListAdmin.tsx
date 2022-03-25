import { useEffect, useState, useContext, FC } from 'react';
import { useForm } from 'react-hook-form';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { useHistory, useParams } from 'react-router-dom';

import { WorkspaceMember } from 'types/GetListOfWorkspace.type';

import './style.css';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { useTranslation } from 'react-i18next';

type ListAdminPropss = {
    close: () => void;
    onSubmitApproval: Function;
};

const formName = 'choose-admin';

const LoadingAdmin = () => {
    return (
        <div className="w-full mb-ooolab_m_4 animate-pulse">
            <input className="w-0 h-0 group-focus:" type="radio" />
            <label className="border cursor-pointer rounded-md p-ooolab_p_3 w-full inline-flex items-center">
                <span className="w-ooolab_w_10 h-ooolab_h_10 bg-gray-300 rounded-full mr-ooolab_m_5" />
                <div className="inline-flex flex-col w-ooolab_w_32">
                    <div className="w-ooolab_w_32 bg-gray-300 mb-ooolab_m_2">
                        {' '}
                        &nbsp;{' '}
                    </div>
                    <div className="w-ooolab_w_20 bg-gray-300 ">&nbsp;</div>
                </div>
            </label>
        </div>
    );
};

const ListAdmin: FC<ListAdminPropss> = ({ close, onSubmitApproval }) => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<WorkspaceMember[]>([]);
    const params: {
        id: string;
        lessonId: string;
        contentId: string;
        courseId: string;
    } = useParams();
    const { t: translator } = useTranslation();
    const {
        register,
        getValues,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const { members } = getWorkspaceDetailState;

    useEffect(() => {
        setLoading(true);
        workspaceMiddleware.getWorkspaceMembers(
            dispatch,
            {
                id: params.id,
            },
            {
                role: 'admin',
            }
        );
        return () => {
            setList([]);
            reset();
            setLoading(false);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setList(members.items);
            setLoading(false);
        }, 700);
    }, [members]);

    const onSubmit = () => {
        const values = getValues();
        const adminId = values[formName];
        onSubmitApproval(adminId, params.courseId);

        close();
    };

    return (
        <div className="w-full bg-white py-ooolab_p_4 px-ooolab_p_6 text-ooolab_dark_1">
            <p className="text-ooolab_lg_e mb-ooolab_m_2">Select Assignee</p>
            <span className="text-red-600 font-light">
                {(errors && errors['choose-admin']?.message) || null}
            </span>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-h-ooolab_h_60 h-ooolab_h_60 overflow-y-auto custom-scrollbar">
                    {loading &&
                        ((
                            <>
                                <LoadingAdmin />
                                <LoadingAdmin />
                                <LoadingAdmin />
                            </>
                        ) ||
                            null)}
                    {(!loading &&
                        list.map((i) => (
                            <div key={i.id} className="w-full mb-ooolab_m_4 ">
                                <input
                                    className="w-0 h-0 group-focus:"
                                    type="radio"
                                    id={`${i.id}`}
                                    value={i.id}
                                    {...register(formName, {
                                        required: 'Please choose one assignee',
                                    })}
                                />
                                <label
                                    className="border cursor-pointer rounded-md p-ooolab_p_3 w-full inline-flex items-center"
                                    htmlFor={`${i.id}`}
                                >
                                    <img
                                        src={i.avatar_url}
                                        alt="avatar"
                                        className="w-ooolab_w_10 h-ooolab_h_10 rounded-full mr-ooolab_m_5"
                                    />
                                    <p className="inline-flex flex-col ">
                                        <span className="text-ooolab_sm text-gray-900 font-medium">
                                            {i.display_name}
                                        </span>
                                        <span className="text-ooolab_xs text-gray-500">
                                            {i.membership.role}
                                        </span>
                                    </p>
                                </label>
                            </div>
                        ))) ||
                        null}
                </div>

                <button
                    type="submit"
                    className="px-ooolab_p_4 py-ooolab_p_1_e mt-ooolab_m_2  rounded-lg focus:outline-none  bg-ooolab_blue_1 text-white"
                >
                    {translator('COURSES.ASSIGN_APPROVAL')}
                </button>
            </form>
        </div>
    );
};

export default ListAdmin;
