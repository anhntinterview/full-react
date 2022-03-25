import { TrashIcon } from '@heroicons/react/outline';
import NotificationWithUndo from 'components/Notification/NotificationWIthUndo';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { type } from 'os';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import userService from 'services/user.service';
import workspaceService from 'services/workspace.service';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { handleRecoverCourse } from '../CoursesList/CourseListFN';
import { data } from '../Lesson/mockData';

export const cancelCourseApproval = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    courseId: string | number
) => {
    workspaceService.declineCourse(workspaceId, courseId).then((res) => {
        if (res) {
            setTimeout(() => {
                workspaceMiddleware.getCourseDetail(
                    dispatch,
                    workspaceId,
                    courseId
                );
            }, 1000);
        }
    });
};

export const approveCourseApproval = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    courseId: string | number
) => {
    workspaceService.approveCourse(workspaceId, courseId).then((res) => {
        if (res) {
            setTimeout(() => {
                workspaceMiddleware.getCourseDetail(
                    dispatch,
                    workspaceId,
                    courseId
                );
            }, 1000);
        }
    });
};

export const submitApproval = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    courseId: string | number,
    userId: number,
    message: string
) => {
    workspaceService
        .createCourseApproval(workspaceId, courseId, {
            message,
            user_id: userId,
        })
        .then((res) => {
            if (res) {
                setTimeout(() => {
                    workspaceMiddleware.getCourseDetail(
                        dispatch,
                        workspaceId,
                        courseId
                    );
                }, 1000);
            }
        });
};

export const removeCourse = async (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    courseId: number,
    onSuccess: () => void
) => {
    workspaceService.moveCourseToTrash(workspaceId, courseId).then((res) => {
        if (res) {
            setTimeout(() => {
                onSuccess();
            }, 1000);
        }
    });
};

export const uploadImage = async (
    file: File,
    canvas: HTMLCanvasElement,
    successCallback: (e: string) => void,
    errorCallback: () => void
) => {
    userService.uploadImage(file, successCallback, errorCallback, canvas);
};
