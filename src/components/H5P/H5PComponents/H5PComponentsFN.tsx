import h5pService from 'services/h5p.service';
import h5pMiddlware from 'middleware/h5p.middlware';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetMemberParams, ApprovalBody, ListParam } from 'types/ApiData.type';
import React from 'react';
import { toast } from 'react-toastify';
import workspaceService from 'services/workspace.service';
import NotificationWithUndo from 'components/Notification/NotificationWIthUndo';

import DocumentCheck from 'assets/SVG/document-check.svg';
import { XIcon } from '@heroicons/react/outline';
import { IH5PPlayerArgs } from 'types/H5P.type';

export const getMemberList = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    params?: GetMemberParams
) => {
    workspaceMiddleware.getWorkspaceMembers(
        dispatch,
        {
            id: workspaceId,
        },
        params
    );
};

export const createApproval = (
    translator: Function,
    dispatch: React.Dispatch<any>,
    argsId: IH5PPlayerArgs,
    body: ApprovalBody
) => {
    const onCancel = () => cancelApproval(dispatch, argsId);

    h5pService
        .createH5PApproval(argsId.workspaceId, argsId.contentId, body)
        .then((res) => {
            if (res) {
                setTimeout(() => {
                    h5pMiddlware.getCurentH5P(dispatch, argsId);
                }, 1000);
            }
            toast(
                <NotificationWithUndo
                    onClickCancel={() => onCancel()}
                    imageContent={DocumentCheck}
                    type="warning"
                    textContent={translator('SENT_TO_ADMIN')}
                />,
                {
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeButton: false,
                    bodyStyle: {
                        padding: 0,
                    },
                    delay: 500,
                    position: 'bottom-left',
                    className: 'shadow-ooolab_box_shadow_2 min-w-ooolab_w_100',
                }
            );
        })
        .catch((err) => toast.error(err));
};

export const cancelApproval = (
    dispatch: React.Dispatch<any>,
    argsId: IH5PPlayerArgs
): Promise<boolean> => {
    return h5pService
        .cancelH5PApproval(argsId)
        .then((res) => res)
        .catch((err: Error) => {
            toast.error(
                <NotificationWithUndo
                    textContent={err.message}
                    imageContent={<XIcon className="text-white" />}
                    type="danger"
                />,
                {
                    autoClose: false,
                    hideProgressBar: true,
                    closeButton: false,
                    bodyStyle: {
                        padding: 0,
                    },
                    delay: 500,
                    position: 'bottom-left',
                    className: 'shadow-ooolab_box_shadow_2 min-w-ooolab_w_100',
                }
            );
            return false;
        })
        .finally(() => {
            setTimeout(() => {
                h5pMiddlware.getCurentH5P(dispatch, argsId);
            }, 1000);
        });
};

export const approveH5PRequest = (
    dispatch: React.Dispatch<any>,
    argsId: IH5PPlayerArgs
) => {
    h5pService
        .h5pApproveContent(argsId)
        .catch((err: Error) => {
            toast.error(
                <NotificationWithUndo
                    textContent={err.message}
                    imageContent={<XIcon className="text-white" />}
                    type="danger"
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
                    className: 'shadow-ooolab_box_shadow_2 min-w-ooolab_w_100',
                }
            );
        })
        .finally(() => {
            setTimeout(() => {
                console.log(argsId);

                h5pMiddlware.getCurentH5P(dispatch, argsId);
            }, 1000);
        });
};

export const generateStatusBg = (status?: string) => {
    let style = 'bg-ooolab_dark_50 shadow-ooolab_draft';
    switch (status) {
        case 'pending':
            return (style = ' bg-ooolab_warning shadow-ooolab_pending');

        case 'public':
            return (style = ' bg-ooolab_green_1 shadow-ooolab_publish');
        default:
            return style;
    }
};
