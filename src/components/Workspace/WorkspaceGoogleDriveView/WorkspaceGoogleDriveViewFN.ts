import {toast} from 'react-toastify';
import googleMiddleware from 'middleware/google.middleware';
import {GoogleResponseError} from 'types/GoogleType';
import {ToastType} from 'components/Workspace/WorkspaceHomeContent/WorkspaceHomeContentFn';
import React from "react";

export const notify = (
    {status, target, destination, action}: ToastType,
    googleDispatch: React.Dispatch<any>,
    errors: GoogleResponseError | undefined
) => {
    return () => {
        if (status === 'done' && action === 'move') {
            return toast.success(
                `You move ${
                    target.length < 10 ? target : `${target.slice(0, 10)}`
                } into ${
                    destination.length < 10
                        ? destination
                        : `${destination.slice(0, 10)}`
                } successfully!`,
                {
                    position: 'bottom-left',
                    onClose: () =>
                        googleMiddleware.resetUpdateFileToast(googleDispatch),
                }
            );
        } else if (status === 'done' && action === 'delete') {
            return toast.dark(
                `You moved ${target} to trash bin!`,
                {
                    position: 'bottom-left',
                    style: {
                        width: 'fit-content',
                    },
                    bodyStyle: {
                        whiteSpace: 'pre-line',
                    },
                    onClose: () =>
                        googleMiddleware.resetUpdateFileToast(googleDispatch),
                }
            );
        } else
            return toast.error(errors?.error.message, {
                position: 'bottom-left',
                onClose: () =>
                    googleMiddleware.resetUpdateFileToast(googleDispatch),
            });
    };
};

export function handleChangeView(
    setView: (value: React.SetStateAction<boolean>) => void,
    view: boolean
) {
    return () => {
        setView(!view);
    };
}

export interface WorkspaceFolderViewProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}