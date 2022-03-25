import { H5PContext } from 'contexts/H5P/H5PContext';
import React from 'react';
import { WorkspaceService } from 'services';
import { ContentService } from 'services/h5p/ContentService';
import { ListParam } from 'types/ApiData.type';
import { IContentListEntry, IContentService } from 'types/H5P.type';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';

// MIDDLWARE
import h5pMiddleware from 'middleware/h5p.middlware';
import { toast } from 'react-toastify';
import NotificationLabel from 'components/Notification/NotificationLabel/NotificationLabel';
import { TrashIcon } from '@heroicons/react/outline';

const userInfo = getLocalStorageAuthData();

export function handleChangeView(
    setView: (value: React.SetStateAction<boolean>) => void,
    view: boolean
) {
    return () => {
        setView(!view);
    };
}

export async function updateList(
    dispatch: React.Dispatch<any>,
    workpspaceId: string,
    params?: ListParam
) {
    h5pMiddleware.h5pContentList(dispatch, workpspaceId, params);
}

export async function handleRole(workspaceId: string) {
    const userInfo = getLocalStorageAuthData();
    const res = await WorkspaceService.getWorkspaceMembers(
        {
            id: workspaceId,
        },
        {
            email: userInfo.email,
        }
    );
    const result = await res;
    if (result && result.items) {
        return result.items[0].membership;
    }
}

export function errorNoti(title: string, image: string | React.ReactElement) {
    toast(
        <NotificationLabel
            textContent={title}
            type="danger"
            imageContent={image}
        />,
        {
            autoClose: 5000,
            hideProgressBar: true,
            closeButton: false,
            bodyStyle: {
                padding: 0,
            },
            delay: 500,
            position: 'bottom-left',
            className: 'shadow-ooolab_box_shadow_2 min-w-ooolab_w_65',
        }
    );
}

export const successNoti = (
    title: string,
    image: string | React.ReactElement
) => {
    toast(
        <NotificationLabel
            textContent={title}
            type="success"
            imageContent={image}
        />,
        {
            autoClose: 5000,
            hideProgressBar: true,
            closeButton: false,
            bodyStyle: {
                padding: 0,
            },
            delay: 500,
            position: 'bottom-left',
            className:
                'shadow-ooolab_box_shadow_2 min-w-ooolab_w_65 rounded-3xl',
        }
    );
};
