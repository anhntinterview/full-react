import googleService from 'services/google.service';

export const handleRemoveWorkspaceDrive = async (
    workspaceId: string,
    permissionId: string
) => {
    const req = await googleService.deleteFilePermission(
        workspaceId,
        permissionId
    );

    return req;
};
