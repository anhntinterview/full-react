import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import googleService from 'services/google.service';

import workspaceService from 'services/workspace.service';
import { WorkspaceMember } from 'types/GetListOfWorkspace.type';
import { GooglePermission } from 'types/GoogleType';

const listStatus: Record<string, string> = {
    active: 'deactivate',
    invite: 'deactivate',
    deactivate: 'active',
};

export const handleRemoveWorkspaceDrive = async (
    workspaceDriveId: string,
    permissionId: string
) => {
    const req = await googleService.deleteFilePermission(
        workspaceDriveId,
        permissionId
    );

    return req;
};

export const handleCreatePermissionWorkspaceDrive = async (
    fileId: string,
    body: Record<any, any>,
    email: string
) => {
    const req = await googleService.createFilePermission(fileId, body, {
        emailAddress: email,
        type: 'user',
        role: 'writer',
    });
    if (req) {
        return true;
    }
    return false;
};

export const handleUpdateMember = async (
    workspaceId: string,
    memberId: string,
    body: {
        role: string;
        status: string;
        permissionId?: string;
        workspaceDriveId?: string;
        email?: string;
    }
): Promise<boolean> => {
    let q = true;
    workspaceService
        .updateWorkspaceMembers(workspaceId, memberId, {
            role: body.role,
            status: listStatus[body.status],
        })
        .then((res) => {
            if (res) {
                q = true;
                if (
                    body.status === 'active' &&
                    body.permissionId &&
                    body.workspaceDriveId
                ) {
                    handleRemoveWorkspaceDrive(
                        body.workspaceDriveId,
                        body.permissionId
                    );
                }
                if (
                    body.status === 'deactivate' &&
                    body.workspaceDriveId &&
                    body.email
                ) {
                    handleCreatePermissionWorkspaceDrive(
                        body.workspaceDriveId,
                        {
                            fields: '*',
                        },
                        body.email
                    );
                }
            }
        })
        .catch(() => {
            q = false;
        });
    return q;
};

export const useGetListMembers = (): [
    WorkspaceMember[],
    (id: string) => Promise<void>
] => {
    const [listMembers, setListMembers] = useState<WorkspaceMember[]>([]);

    async function getListMembers(id: string) {
        // setListMembers([]);
        const listPromise = [
            workspaceService.getWorkspaceMembers(
                {
                    id,
                },
                {
                    status: 'active',
                }
            ),
            workspaceService.getWorkspaceMembers(
                {
                    id,
                },
                {
                    status: 'invite',
                }
            ),
            workspaceService.getWorkspaceMembers(
                {
                    id,
                },
                {
                    status: 'deactivate',
                }
            ),
        ];
        Promise.all(listPromise)
            .then(async (res) => {
                const listResponse = (
                    await Promise.all(
                        res.map(async (i) => {
                            if (i) {
                                return (await i.json()).items || [];
                            }
                            return [];
                        })
                    )
                ).flat();
                setListMembers(listResponse);
            })
            .catch((err) => {
                toast.error(err);
            })
            .finally(() => {
                console.log('finally');
            });
    }

    useEffect(() => {
        return () => {
            setListMembers([]);
        };
    }, []);

    return [listMembers, getListMembers];
};

export const useGetDrivePermission = (): [
    GooglePermission[],
    (id: string) => Promise<void>
] => {
    const [listPermissions, setListPermissions] = useState<GooglePermission[]>(
        []
    );

    async function getDriveListPermissions(fileId: string) {
        googleService
            .getFilePermissions(fileId)
            .then((res) => {
                if (res && res.permissions) {
                    setListPermissions(res.permissions);
                }
            })
            .catch((err) => {
                toast.error(err);
                setListPermissions([]);
            });
    }

    return [listPermissions, getDriveListPermissions];
};
