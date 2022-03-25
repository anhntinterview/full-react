import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/solid';
import ContextMenu from '../../CommonMenu';

import { DROP, MENU_ITEMS } from 'constant/menu.const';
import {
    FolderType,
    GoogleFiles,
    MultipleFolderType,
    NestedFolderType,
    ParentFile,
    TreeFolder,
} from 'types/GoogleType';
import { useDropzone } from 'react-dropzone';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
import googleMiddleware from 'middleware/google.middleware';
import FileTitleView from './FileTitleView';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import { useTranslation } from 'react-i18next';

export interface WorkspaceTitleViewFolderProps {
    data: GoogleFiles[];
}
const WorkspaceTitleViewFolder: React.FC<WorkspaceTitleViewFolderProps> = ({
    data,
}) => {
    const { t: translator } = useTranslation('', {
        keyPrefix: 'DASHBOARD.GOOGLE_DRIVE',
    });
    const [elRefs, setElRefs] = React.useState<HTMLDivElement[]>([]);
    const params: { id: string; folderId: string } = useParams();
    const listData = React.useMemo(() => {
        setElRefs([]);
        return data;
    }, [data]);

    const onRefChange = React.useCallback((node) => {
        if (node) {
            setElRefs((pre) => [...pre, node]);
        }
    }, []);
    const { dispatch: leftMenuDispatch, leftMenuState } = React.useContext(
        LeftMenuContext
    );
    const { dispatch: googleDispatch, googleState } = useContext(
        GoogleAPIAndServicesContext
    );

    const onDrop = React.useCallback((acceptedFiles, FileRejection, event) => {
        if (acceptedFiles) {
            let folderID = 'root';
            const parentFile: ParentFile = {
                files: [],
                folders: [],
            };
            if (event.target.baseURI.includes('folders')) {
                const arr = event.target.baseURI.split('/');
                folderID = arr[6];
            }
            googleMiddleware.actionUpload(googleDispatch, DROP);
            const paths: any[] = [];
            const glob: TreeFolder = {
                name: undefined,
                children: [],
                files: acceptedFiles,
                paramId: folderID,
            };
            const symbol = '/';
            const lookup = { [symbol]: glob };

            if (acceptedFiles) {
                Array.from(acceptedFiles).forEach((d: any) => {
                    paths.push(d.path);
                });

                paths.forEach(function (path) {
                    path.split('/')
                        .slice(0)
                        .reduce((dir: any, sub: any) => {
                            if (!dir[sub]) {
                                const subObj = { name: sub, children: [] };
                                dir[symbol].children.push(subObj);
                                return (dir[sub] = { [symbol]: subObj });
                            }
                            return dir[sub];
                        }, lookup);
                });
                glob.children.map((d: any) => {
                    if (d.children.length < 1) {
                        parentFile.files.push(d.name);
                    } else {
                        d.children.map((children: any) => {
                            parentFile.folders.push(children.name);
                        });
                    }
                });
                googleMiddleware.setParentDrop(googleDispatch, parentFile);
                googleMiddleware.setTreeFolder(googleDispatch, glob);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });
    const history = useHistory();

    return (
        <div
            {...getRootProps()}
            className={`${
                isDragActive && 'bg-ooolab_blue_5 border-white text-white'
            }flex flex-col `}
        >
            <div className="flex flex-col   divide-y-4 divide-gray-400 border-b-ooolab_w_2">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className=" overflow-hidden ">
                            <div className="px-6 py-3 text-left text-ooolab_xs font-medium text-gray-500 uppercase tracking-wider w-full ">
                                <span className="w-full flex items-center">
                                    {translator("NAME")}
                                    <ChevronDownIcon className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer ml-ooolab_m_1" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-flow-row grid-cols-4 gap-ooolab_w_8 gap-y-ooolab_w_5 justify-items-center mt-ooolab_m_6">
                {listData.map((d, i) => (
                    <div
                        key={d.id}
                        ref={onRefChange}
                        custom-id={d.id}
                        custom-share={(d.capabilities.canShare && '1') || ''}
                        custom-copy={(d.capabilities.canCopy && '1') || ''}
                        custom-mime={d.mimeType}
                        custom-name={d.name}
                        custom-thumbnail={d.thumbnailLink}
                        custom-webviewlink={d.webViewLink}
                        className="w-full"
                        onDoubleClick={() => {
                            if (d.mimeType.includes('folder')) {
                                history.push(
                                    `/workspace/${params.id}/folders/${d.id}`
                                );
                            }
                        }}
                    >
                        <FileTitleView data={d} />
                    </div>
                ))}

                <ContextMenu menuItems={MENU_ITEMS} elRefs={elRefs} />
            </div>
        </div>
    );
};

export default WorkspaceTitleViewFolder;
