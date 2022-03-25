import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
// COMPONENT
import ContextMenu from '../../../CommonMenu';
// ASSETS
// CONST
import { DROP, MENU_ITEMS } from 'constant/menu.const';
// TYPES
import {
    FolderType,
    GoogleFiles,
    GoogleState,
    MultipleFolderType,
    NestedFolderType,
    subFolderType,
    TreeFolder,
} from 'types/GoogleType';
import { MIME_TYPE } from 'constant/google.const';
import FileView from './FileView';
import { DropzoneRootProps, useDropzone } from 'react-dropzone';
import leftMenuMiddleware from 'middleware/leftMenu.middleware';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';

import googleMiddleware from 'middleware/google.middleware';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

type TableDataType = {
    id: number;
    name: string;
    tag: string;
    last_modified: string;
    collaborator: string[];
};

type WorkspaceFolderTableProps = {
    data: GoogleFiles[];
    hasCollab?: boolean;
    hasShared?: boolean;
};

const WorkspaceFolderTable: React.FC<WorkspaceFolderTableProps> = ({
    data,
    hasCollab = false,
    hasShared = false,
}) => {
    const { t: translator } = useTranslation('', {
        keyPrefix: 'DASHBOARD.GOOGLE_DRIVE',
    });
    const [elRefs, setElRefs] = React.useState<HTMLDivElement[]>([]);
    const listData = React.useMemo(() => {
        setElRefs([]);
        return data;
    }, [data]);

    const params: { id: string; type: string; folderId: string } = useParams();

    const onRefChange = React.useCallback((node) => {
        if (node) {
            setElRefs((pre) => [...pre, node]);
        }
    }, []);

    const { dispatch: googleDispatch, googleState } = useContext(
        GoogleAPIAndServicesContext
    );

    const [
        multipleFolder,
        setMultipleFolder,
    ] = React.useState<MultipleFolderType>();
    // const [fileList, setFileList] = React.useState<(File | string)[]>([]);

    const onDrop = React.useCallback((acceptedFiles) => {
        if (acceptedFiles) {
            googleMiddleware.actionUpload(googleDispatch, DROP);
            const paths: any[] = [];
            const glob: TreeFolder = {
                name: undefined,
                children: [],
                files: acceptedFiles,
                paramId: params?.folderId ? params.folderId : 'root',
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
            <div className="-my-2 sm:-mx-6 lg:-mx-8">
                <div className="py-2   align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className=" overflow-hidden">
                        <div className="grid gap-2 grid-cols-10">
                            <div className="col-span-4">
                                {translator('NAME')}
                            </div>
                            <div className="col-span-2 text-center">
                                {translator('TAG')}
                            </div>
                            <div className="col-span-2 text-center">
                                {translator('LAST_MODIFIED')}
                            </div>
                            {hasCollab && (
                                <div className="col-span-2 text-center">
                                    {translator('COLLABORATORS')}
                                </div>
                            )}
                            {hasShared && (
                                <div className="col-span-2 text-center">
                                    {translator('SHARED_BY')}
                                </div>
                            )}
                        </div>
                        <ContextMenu menuItems={MENU_ITEMS} elRefs={elRefs} />
                    </div>
                </div>
            </div>
            <div className="mt-ooolab_m_6">
                {listData.map((d, i) => {
                    return (
                        <div
                            key={d?.id}
                            ref={onRefChange}
                            custom-id={d?.id}
                            custom-share={
                                (d?.capabilities?.canShare && '1') || ''
                            }
                            custom-copy={(d.capabilities.canCopy && '1') || ''}
                            custom-mime={d.mimeType}
                            custom-name={d.name}
                            custom-thumbnail={d.thumbnailLink}
                            custom-webviewlink={d.webViewLink}
                            className="w-full"
                            onDoubleClick={() => {
                                if (
                                    d.mimeType.includes('folder') ||
                                    d?.shortcutDetails?.targetMimeType?.includes(
                                        'folder'
                                    )
                                ) {
                                    history.push(
                                        `/workspace/${params.id}/folders/${d.id}`
                                    );
                                }
                            }}
                        >
                            <FileView
                                hasCollab={hasCollab}
                                hasShared={hasShared}
                                data={d}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkspaceFolderTable;
