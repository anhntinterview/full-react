import { TrashIcon } from '@heroicons/react/outline';
import NotificationWithUndo from 'components/Notification/NotificationWIthUndo';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { toast } from 'react-toastify';
import workspaceService from 'services/workspace.service';

export const handleRecoverCourse = async (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    courseId: number
): Promise<boolean> => {
    workspaceService
        .recoverCourseFromTrash(workspaceId, courseId)
        .then((res) => {
            if (res) {
                setTimeout(
                    () =>
                        workspaceMiddleware.getCoursesList(
                            dispatch,
                            workspaceId
                        ),
                    1000
                );
                return true;
            }
        });
    return false;
};

export const removeCourse = async (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    courseId: number
) => {
    workspaceService.moveCourseToTrash(workspaceId, courseId).then((res) => {
        if (res) {
            setTimeout(() => {
                workspaceMiddleware.getCoursesList(dispatch, workspaceId);
                toast(
                    <NotificationWithUndo
                        onClickCancel={() =>
                            handleRecoverCourse(dispatch, workspaceId, courseId)
                        }
                        imageContent={
                            <TrashIcon className="bg-ooolab_blue_1 text-white" />
                        }
                        textContent="Course was moved to Trash"
                        type="success"
                    />,
                    {
                        closeOnClick: false,
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeButton: false,
                        bodyStyle: {
                            padding: 0,
                        },
                        delay: 500,
                        position: 'bottom-left',
                        className:
                            'shadow-ooolab_box_shadow_2 min-w-ooolab_w_80',
                    }
                );
            }, 1000);
        }
    });
};
