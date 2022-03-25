import * as React from 'react';
// PACKAGE
import { ArrowSmRightIcon, CheckIcon, XIcon } from '@heroicons/react/outline';
import { Link, useHistory } from 'react-router-dom';
// CONTEXT
import {
    CreateWorkspaceContext,
    GetListOfWorkspaceContext,
    GetWorkspaceContext,
} from 'contexts/Workspace/WorkspaceContext';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
// LOGIC
import { MyWorkspaceProps } from './MyWorkspaceFormFn';
// CONTEXT
import { AuthContext } from 'contexts/Auth/AuthContext';
// UTILS
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { handleLogout } from 'utils/handleLogout';
import { WorkspaceItem } from 'types/GetListOfWorkspace.type';
import { useTranslation } from 'react-i18next';
import { AUTH_CONST } from 'constant/auth.const';

const SkeletonItem = () => {
    let items = [];
    for (let index of new Array(3)) {
        items.push(
            <div className="w-ooolab_w_125 group flex items-center p-ooolab_p_2 justify-between border border-ooolab_border_logout rounded-sub_tab transition-all">
                <div className="flex items-center flex-row">
                    <div
                        className={
                            'w-ooolab_w_11 h-ooolab_h_11 bg-ooolab_gray_2 flex items-center justify-center rounded-ooolab_circle'
                        }
                    />
                    <div className=" ml-ooolab_m_3 text-ooolab_base text-ooolab_dark_1 w-ooolab_w_44 h-ooolab_h_4 bg-ooolab_gray_2 rounded-ooolab_radius_4px" />
                </div>

                <div
                    className={
                        'flex flex-row justify-ends space-x-6 items-center'
                    }
                >
                    {/*<label*/}
                    {/*    className={'text-ooolab_dark_2 leading-ooolab_22px font-medium text-ooolab_base'}>member{'s'}</label>*/}
                    <div className="rounded-ooolab_circle shadow-ooolab_sub_item w-ooolab_w_11 h-ooolab_h_11 flex items-center justify-center"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="animate-pulse flex flex-col space-y-1 overflow-y-scroll">
            {items.map((value) => value)}
        </div>
    );
};

const MyWorkspaceForm: React.FC<MyWorkspaceProps> = ({ setAuthStorage }) => {
    const { t: translator } = useTranslation();
    const userInfo = getLocalStorageAuthData();
    const history = useHistory();
    const [apiSuccessMsg] = React.useState<string>();
    const [memberListMsg, setMemberListMsg] = React.useState<string>();
    const [apiErrorMsg, setApiErrorMsg] = React.useState<string>();

    const { createWorkspaceState, dispatch } = React.useContext(
        CreateWorkspaceContext
    );
    const {
        result,
        err,
        isLoading,
        status,
        // validateErr,
    } = createWorkspaceState;
    const { access_token } = userInfo;

    const {
        getListOfWorkspaceState,
        dispatch: dispatchList,
    } = React.useContext(GetListOfWorkspaceContext);

    const { dispatch: GetWorkspaceDispatch } = React.useContext(
        GetWorkspaceContext
    );

    const {
        result: { items: listData },
        err: listWorkspaceErr,
        isLoading: isLoadingWorkspaceItems,
    } = getListOfWorkspaceState;

    const inviteMemberList =
        (listData?.length &&
            listData.filter((item) => item.membership.status === 'invite')) ||
        [];

    const memberActive =
        (listData?.length &&
            listData.filter((item) => item.membership.status === 'active')) ||
        [];

    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;

    React.useEffect(() => {
        if (err) {
            setApiErrorMsg(err.error.description);
        }
        // if (validateErr) {
        //     setApiErrorMsg(validateErr.validation_error.body_params[0].msg);
        // }
    }, [err]);

    React.useEffect(() => {
        if (listWorkspaceErr?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
            handleLogout(authDispatch, setAuthStorage);
        }
    }, [listWorkspaceErr]);

    React.useEffect(() => {
        workspaceMiddleware.getListOfWorkspace(dispatchList);
        workspaceMiddleware.resetWorkspaceDetailError(GetWorkspaceDispatch);
    }, []);

    React.useEffect(() => {
        if (status === 'done' && !isLoading && access_token) {
            workspaceMiddleware.getListOfWorkspace(dispatchList);
        }
    }, [status, isLoading]);

    return (
        <>
            <div className="contents sm:justify-center items-center flex-col h-ooolab_body_3 mt-12 ooolab_ipad_portrait:h-ooolab_body_1 h-full">
                <div className="flex flex-col items-center w-full mt-ooolab_m_8">
                    <label
                        className={
                            'leading-ooolab_44px text-ooolab_dark_1 font-semibold text-ooolab_32px'
                        }
                    >
                        {translator('AUTHENTICATION.WORKSPACE.MY_WORKSPACES')}
                    </label>
                    <div
                        className={
                            'flex flex-col items-start mt-ooolab_m_8 w-ooolab_w_129 mb-ooolab_m_10'
                        }
                    >
                        <div
                            className={
                                'flex flex-col w-full pb-ooolab_p_3 justify-start items-center'
                            }
                        >
                            {isLoadingWorkspaceItems ? (
                                <SkeletonItem />
                            ) : (
                                <div
                                    className={
                                        'flex flex-col w-full animate-ooolab_fade_in'
                                    }
                                >
                                    {listData && listData.length > 0 && (
                                        <ActivatedWorkspaceList
                                            items={listData}
                                        />
                                    )}
                                    {inviteMemberList &&
                                        inviteMemberList.length > 0 && (
                                            <PendingInvitedWorkspaceList
                                                inviteMemberList={
                                                    inviteMemberList
                                                }
                                            />
                                        )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => history.push('/workspace/create')}
                            className={
                                'font-medium text-ooolab_blue_1 text-ooolab_base'
                            }
                        >
                            {translator(
                                'AUTHENTICATION.WORKSPACE.ADD_ANOTHER_WORKSPACE'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const PendingInvitedWorkspaceList: React.FC<{
    inviteMemberList: WorkspaceItem[];
}> = ({ inviteMemberList }) => {
    return (
        <div className="mt-ooolab_m_1 w-full space-y-1">
            {inviteMemberList.map((item) => (
                <div
                    key={item.id}
                    className="w-full group flex flex-row items-center p-ooolab_p_2 justify-between border border-ooolab_border_logout rounded-sub_tab border-dashed hover:shadow-lg transition-all"
                >
                    <div className="flex items-center flex-row">
                        <img
                            alt={'avatar'}
                            src={
                                item.avatar_url ??
                                `https://ui-avatars.com/api?name=${item.name}&size=44`
                            }
                            className={
                                'w-ooolab_w_11 h-ooolab_h_11 bg-ooolab_gray_2 flex items-center justify-center rounded-ooolab_circle'
                            }
                        />
                        <label className=" ml-ooolab_m_3 text-ooolab_base text-ooolab_dark_1 group-hover:text-ooolab_dark_1">
                            {item.name}
                        </label>
                    </div>
                    <div className={'flex flex-row justify-ends items-center'}>
                        <label
                            className={
                                'text-ooolab_dark_2 leading-ooolab_22px font-medium text-ooolab_base'
                            }
                        >
                            invited
                        </label>
                        <Link
                            to={`/workspace/${item.id}`}
                            className="ml-ooolab_m_5 rounded-ooolab_circle shadow-ooolab_sub_item w-ooolab_w_11 h-ooolab_h_11 flex items-center justify-center"
                        >
                            <CheckIcon className="group-hover:text-ooolab_green_2 w-ooolab_w_6 lg:w-ooolab_w_5 text-ooolab_green_2" />
                        </Link>
                        {/*todo comment for temporary as this feature is not available*/}
                        {/*<button*/}
                        {/*    className="rounded-ooolab_circle shadow-ooolab_sub_item w-ooolab_w_11 h-ooolab_h_11 flex items-center justify-center">*/}
                        {/*    <XIcon*/}
                        {/*        className="group-hover:text-ooolab_error w-ooolab_w_6 lg:w-ooolab_w_5 text-ooolab_error"*/}
                        {/*        onClick={() => {*/}
                        {/*        }}/>*/}
                        {/*</button>*/}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ActivatedWorkspaceList: React.FC<{ items: WorkspaceItem[] }> = ({
    items,
}) => {
    return (
        <div className="w-full flex flex-col space-y-1 items-center">
            {items
                .filter((item) => item.membership.status === 'active')
                .map((item) => (
                    <div className="w-ooolab_w_125 group flex items-center p-ooolab_p_2 justify-between border border-ooolab_border_logout rounded-sub_tab hover:shadow-lg transition-all">
                        <div className="flex items-center flex-row">
                            <img
                                alt={'avatar'}
                                src={
                                    item.avatar_url ??
                                    `https://ui-avatars.com/api?name=${item.name}&size=44`
                                }
                                className={
                                    'w-ooolab_w_11 h-ooolab_h_11 bg-ooolab_gray_2 flex items-center justify-center rounded-ooolab_circle'
                                }
                            />
                            <label className=" ml-ooolab_m_3 text-ooolab_base text-ooolab_dark_1 group-hover:text-ooolab_dark_1">
                                {item.name}
                            </label>
                        </div>

                        <div
                            className={
                                'flex flex-row justify-ends space-x-6 items-center'
                            }
                        >
                            {/*<label*/}
                            {/*    className={'text-ooolab_dark_2 leading-ooolab_22px font-medium text-ooolab_base'}>member{'s'}</label>*/}
                            <Link
                                to={{
                                    pathname: `/workspace/${item.id}/h5p-content`,
                                    state: item,
                                }}
                                className="rounded-ooolab_circle shadow-ooolab_sub_item w-ooolab_w_11 h-ooolab_h_11 flex items-center justify-center"
                            >
                                <ArrowSmRightIcon className="group-hover:text-ooolab_blue_1 w-ooolab_w_6 lg:w-ooolab_w_5 text-ooolab_blue_1" />
                            </Link>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default MyWorkspaceForm;
