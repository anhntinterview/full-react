import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BarType } from 'constant/setupBars.const';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import googleService from 'services/google.service';
import { ChevronRightIcon } from '@heroicons/react/outline';
import FolderColor from 'assets/SVG/folder_color.svg';

type BreadCrumbType = {
    id: string;
    name: string;
};

const WorkspaceBreadCrumb = ({ path }: { path?: string }) => {
    const history = useHistory();
    const params: { folderId: string; id: string } = useParams();

    const [breadCrumb, setBreadCrumb] = useState<BreadCrumbType[]>([]);
    const [, setIsLoading] = useState<boolean>(false);
    const { dispatch } = useContext(GetWorkspaceContext);
    const getAndSetId = async () => {
        setIsLoading(true);
        let hasParents = !!params.folderId;
        let id = path || params.folderId;
        const tempBreadCrumb = [];
        let folderType = BarType.UploadsMyDrive;
        do {
            const res = await googleService.getGoogleDriveFile(id);
            if (!res) return { tempBreadCrumb, folderType };
            if (res.trashed) folderType = BarType.UploadsTrash;
            if (res?.parents && res.parents?.length) {
                id = res.parents[0];
                const item = {
                    id: res.id,
                    name: res.name,
                };
                tempBreadCrumb.unshift(item);
            } else {
                tempBreadCrumb.unshift({
                    id: res?.id,
                    name: res.name,
                });
                hasParents = false;
                if (res.shared && folderType !== BarType.UploadsTrash) {
                    folderType = BarType.UploadsShared;
                }
            }
        } while (hasParents);
        return { tempBreadCrumb, folderType };
    };
    const handleClickBreadCrumb = ({
        id,
        index,
    }: {
        id: number | string;
        index: number;
    }) => {
        history.push(`/workspace/${params.id}/folders/${id}`);
        const tmp = [...breadCrumb];
        const newBreadCrumb = tmp.slice(0, index + 1);

        setBreadCrumb(newBreadCrumb);
    };

    useEffect(() => {
        getAndSetId()
            .then((res) => {
                setBreadCrumb(res.tempBreadCrumb);
                workspaceMiddleware.setCurrentUploadNavigation(
                    dispatch,
                    res.folderType
                );
            })
            .finally(() => setIsLoading(false));
        return () => {
            workspaceMiddleware.setCurrentUploadNavigation(dispatch, -1);
        };
    }, [params.folderId]);

    return (
        <div className="mt-4">
            <nav
                className="flex items-center text-ooolab_base "
                aria-label="Breadcrumb"
            >
                <ol role="list" className="flex items-center">
                    <li>
                        <p className="inline-flex items-center">
                            <img src={FolderColor} alt="" />
                            <span className="ml-ooolab_m_1">All Files</span>
                        </p>
                    </li>
                    {breadCrumb.map((i, index) => (
                        <li
                            onClick={() =>
                                handleClickBreadCrumb({ id: i.id, index })
                            }
                            key={i.id}
                        >
                            <div className="flex items-center">
                                <ChevronRightIcon
                                    className="flex-shrink-0 h-5 w-5 "
                                    aria-hidden="true"
                                />
                                <a
                                    className="ml-4 text-sm font-medium"
                                    aria-current={i ? 'page' : undefined}
                                >
                                    {i.name}
                                </a>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default WorkspaceBreadCrumb;
