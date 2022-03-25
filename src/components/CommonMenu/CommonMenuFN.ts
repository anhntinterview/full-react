import googleService from 'services/google.service';
import { toast } from 'react-toastify';
type FileDetail = {
    name: string;
    id: string;
    parents: string;
};

const checkObjectEmptyValues = (obj: Record<any, any>) => {
    const listKeys = Object.keys(obj);
    if (listKeys.length) {
        const tmp = listKeys.filter((i) => !!i);

        return tmp.length === listKeys.length;
    }

    return false;
};

export const handleCreateShortcut = async (param: FileDetail) => {
    const { name, id, parents } = param;
    const requestBody = {
        name,
        mimeType: 'application/vnd.google-apps.shortcut',
        shortcutDetails: {
            targetId: id,
            targetMimeType: 'application/vnd.google-apps.folder',
        },
        parents: [parents],
        fields: '*',
    };

    googleService
        .updateNewFolderGoogleDrive(requestBody)
        .then((res) => {
            console.log('create successfully', res);
            toast.success(`Add to workspace drive successfully`);
        })
        .catch((err) => {
            toast.error(err);
        });
};

export const handleCopyFile = async (param: FileDetail) => {
    if (!checkObjectEmptyValues(param)) return;
    const { name, id, parents } = param;
    const requestBody = {
        name,
        parents: [parents],
        fields: '*',
    };
    googleService
        .copyFile(id, { ...requestBody })
        .then((res) => {
            if (res) {
                toast.success('Added file to workspace drive successfully');
            }
        })
        .catch((err) => {
            toast.error(err);
        });
};
