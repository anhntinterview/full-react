/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useContext, useRef, useState } from 'react';
// PACKAGE
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

// MIDDLEWARE
import googleMiddleware from 'middleware/google.middleware';
import { GoogleTypeFolder } from 'types/GoogleType';
import { useEffect } from 'react';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import leftMenuMiddleware from 'middleware/leftMenu.middleware';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
import { CREATE_FOLDER } from 'constant/menu.const';
import { useLocation, useParams } from 'react-router-dom';
import {
    GetListOfWorkspaceContext,
    GetWorkspaceContext,
} from 'contexts/Workspace/WorkspaceContext';

export interface CreateFolderProps {
    isCreateFolder: boolean;
    setIsCreateFolder: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateFolder: React.FC<CreateFolderProps> = ({
    isCreateFolder,
    setIsCreateFolder,
}) => {
    const cancelButtonRef = useRef(null);
    const [nameFolder, setNameFolder] = React.useState<string>('');
    const { dispatch: googleDispatch, googleState } = React.useContext(
        GoogleAPIAndServicesContext
    );

    const {
        dispatch: workspaceDispatch,
        getWorkspaceDetailState: { result: WorkspaceDetailInformation },
    } = useContext(GetWorkspaceContext);
    const param: { folderId: string } = useParams();
    const location = useLocation();

    const { dispatch: leftMenuDispatch, leftMenuState } = useContext(
        LeftMenuContext
    );
    async function onSubmit() {
        let id = 'root';
        const pathName = location.pathname;
        if (
            pathName.includes('workspace-drive') &&
            WorkspaceDetailInformation.drive_default_path
        ) {
            id = WorkspaceDetailInformation.drive_default_path;
        } else if (param.folderId) {
            id = param.folderId;
        }
        const newFolderGoogle = {
            mimeType: 'application/vnd.google-apps.folder',
            name: nameFolder,
            parents: [id],
        };
        googleMiddleware.actionUpload(googleDispatch, CREATE_FOLDER);
        googleMiddleware.uploadNewFolderGoogleDrive(
            googleDispatch,
            newFolderGoogle
        );
        leftMenuMiddleware.setFolderName(leftMenuDispatch, nameFolder);
        setIsCreateFolder(false);
    }

    function handleChangeName(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setNameFolder(value);
    }

    function onClose() {
        setIsCreateFolder(false);
    }

    return (
        <Transition.Root show={isCreateFolder} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-1 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isCreateFolder}
                onClose={setIsCreateFolder}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:items-start sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-ooolab_modal_top_1 sm:align-middle sm:w-8/12 lg:w-5/12 sm:rounded-3xl relative">
                            <button
                                onClick={onClose}
                                ref={cancelButtonRef}
                                className="absolute w-8 right-2 top-2 opacity-50 focus:outline-none"
                            >
                                <XIcon />
                            </button>
                            <form
                                className="mt-ooolab_m_3"
                                onSubmit={() => onSubmit()}
                            >
                                <div>
                                    <label className="block text-black font-bold mb-5 ml-4">
                                        Name folder
                                    </label>
                                    <input
                                        className="mx-4 w-5/6 px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        placeholder="Enter name folder"
                                        name="folder"
                                        onChange={(e) => handleChangeName(e)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="m-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ooolab_blue_3 text-base font-medium text-white hover:bg-ooolab_blue_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default CreateFolder;
