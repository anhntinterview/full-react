import React from 'react';
// PACKAGES
import { useHistory } from 'react-router-dom';
// CONTEXT
import { GetListOfWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { AuthContext } from 'contexts/Auth/AuthContext';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
// UTILS
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { handleLogout } from 'utils/handleLogout';
// TYPE
import { GetListOfWorkspaceType } from 'types/GetListOfWorkspace.type';
import { Menu, Transition } from '@headlessui/react';
// ASSETS
import avatar from 'assets/SVG/workspace_avatar.svg';
import lock from 'assets/SVG/lock.svg';
// LOGIC
import { handleSelectedWorkspace } from './ListWorkspaceFn';
import { AUTH_CONST } from 'constant/auth.const';

export interface ListWorkspaceProps {
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const ListWorkspace: React.FC<ListWorkspaceProps> = ({ setAuthStorage }) => {
    const getListOfWorkspaceCtx = React.useContext(GetListOfWorkspaceContext);
    const [
        currentWorkspace,
        setCurrentWorkspace,
    ] = React.useState<GetListOfWorkspaceType>();
    const [
        selectedWorkspaceId,
        setSelectedWorkspaceId,
    ] = React.useState<string>();
    const history = useHistory();

    const { getListOfWorkspaceState } = getListOfWorkspaceCtx;
    const getListOfWorkspaceDispatch = getListOfWorkspaceCtx.dispatch;
    const {
        dispatch,
        getWorkspaceDetailState: { err },
    } = React.useContext(GetWorkspaceContext);

    const getListOfWorkspaceStateResult = getListOfWorkspaceState.result;

    const userInfo = getLocalStorageAuthData();
    const access_token = userInfo.access_token;

    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;

    // HANDLE EXPIRED
    React.useEffect(() => {
        if (err?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
            if (setAuthStorage) {
                handleLogout(authDispatch, setAuthStorage);
            }
        }
    }, [err]);

    React.useEffect(() => {
        if (access_token) {
            workspaceMiddleware.getListOfWorkspace(getListOfWorkspaceDispatch);
        }
    }, []);

    React.useEffect(() => {
        setCurrentWorkspace(getListOfWorkspaceStateResult);
    }, [getListOfWorkspaceStateResult]);

    // React.useEffect(() => {
    //     if (access_token && selectedWorkspaceId) {
    //         workspaceMiddleware.getWorkspace(dispatch, {
    //             id: selectedWorkspaceId,
    //         });
    //     }
    // }, [selectedWorkspaceId]);

    // function handleSelectedWorkspace(e: any) {
    //     const { value } = e.target;
    //     setSelectedWorkspaceId(value);
    //     if (e.currentTarget.value !== 'Workspace') {
    //         return history.push(`/workspace/${e.currentTarget.value}`);
    //     }
    // }
    return (
        <>
            {/* <div className="w-full ">
                <select
                    className="text-gray-600"
                    onChange={(e) => handleSelectedWorkspace(e)}
                >
                    <option className="font-bold">Workspace</option>
                    {currentWorkspace?.items.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div> */}
            <Menu as="div" className="w-full relative inline-block text-left">
                {({ open }) => (
                    <>
                        <div className="flex h-full">
                            <Menu.Button className="px-4 inline-flex justify-center items-center w-full rounded-md border-none bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0 appearance-none focus:ring-offset-0 focus:ring-offset-gray-100 focus:ring-indigo-500">
                                <img
                                    className="mr-ooolab_m_3"
                                    src={lock}
                                    alt=""
                                />
                                <p className="flex text-sm py-2  justify-start cursor-pointer w-full text-gray-900">
                                    Switch Workspace
                                </p>
                            </Menu.Button>
                        </div>

                        <Transition
                            show={open}
                            as={React.Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                static
                                className="w-56 z-70 absolute right-ooolab_w_2 top-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <div className="py-1">
                                    {currentWorkspace?.items.map((item) => (
                                        <Menu.Item key={item.id}>
                                            {({ active }) => (
                                                <button
                                                    value={item.id}
                                                    onClick={(e) =>
                                                        handleSelectedWorkspace(
                                                            setSelectedWorkspaceId,
                                                            history,
                                                            e
                                                        )
                                                    }
                                                    className={`${classNames(
                                                        active
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'text-gray-700',
                                                        'block px-4 py-2 text-sm'
                                                    )} flex items-center justify-start cursor-pointer w-full focus:outline-none`}
                                                >
                                                    <img
                                                        src={avatar}
                                                        className="w-ooolab_w_8 h-ooolab_h_8 pr-ooolab_p_3"
                                                    />
                                                    {item.name}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </>
    );
};

export default ListWorkspace;
