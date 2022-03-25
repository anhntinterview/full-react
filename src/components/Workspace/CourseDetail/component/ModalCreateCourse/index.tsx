import { Transition, Dialog } from '@headlessui/react';
import { FC, useRef, useState, Fragment, useEffect } from 'react';
import SaveChanges from 'assets/SVG/save-changes.svg';
import CancelChanges from 'assets/SVG/cancel.svg';
import { CourseReducerType } from '../../reducers';
import workspaceService from 'services/workspace.service';
import { useHistory, useParams } from 'react-router';
import userService from 'services/user.service';
import { CourseDetailType } from 'types/Courses.type';
import { Link } from 'react-router-dom';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    data: CourseReducerType;
};

const ModalCreateCourse: FC<ModalProps> = ({ isOpen, onClose, data }) => {
    const params: { id: string } = useParams();
    const history = useHistory();
    const cancelButtonRef = useRef(null);
    const courseRef = useRef<CourseDetailType | undefined>();
    const [status, setStatus] = useState<
        'creating' | 'done' | 'error_upload' | 'error_create' | 'error_update'
    >('creating');

    const handleUpdateCourse = async (e: string, courseId: number) => {
        workspaceService
            .updateCourseDetail(params.id, courseId, {
                thumbnail: e,
            })
            .then(() => setStatus('done'))
            .catch(() => setStatus('error_update'));
    };

    const handleUploadImage = async (e: CourseDetailType | undefined) => {
        if (data.courseBackgroundImage?.file && e) {
            userService.uploadImage(
                data.courseBackgroundImage?.file,
                (res) => handleUpdateCourse(res, e.id),
                () => setStatus('error_upload'),
                data.courseBackgroundImage?.canvas
            );
        } else setStatus('done');
    };

    useEffect(() => {
        if (isOpen) {
            // setStatus('error_update');
            const tmpData = { ...data.params };
            if (data.tags.length) {
                tmpData.tags = data.tags.map((i) => ({ tag_id: i.id }));
            }
            workspaceService
                .createNewCourse(params.id, { ...tmpData })
                .then((res) => {
                    courseRef.current = res;
                    handleUploadImage(res);
                })
                .catch(() => setTimeout(() => setStatus('error_create'), 500));
        } else {
            setStatus('creating');
        }
    }, [isOpen]);

    useEffect(() => {
        if (status === 'done') {
            setTimeout(
                () => history.push(`/workspace/${params.id}/courses`),
                2000
            );
        }
    }),
        [status];

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={() => {
                    if (status === 'error_create') {
                        onClose();
                    }
                }}
            >
                <div className="flex justify-center h-screen text-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-700"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-ooolab_gray_4 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <div className="w-2/5 h-2/5 p-ooolab_p_5 bg-white rounded-ooolab_card text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle relative">
                            <div className="flex justify-center items-center h-full">
                                {status === 'creating' &&
                                    ((
                                        <p className="inline-flex flex-col items-center">
                                            <span className="text-ooolab_dark_1">
                                                Creating Course
                                            </span>
                                            <svg
                                                className="animate-spin -ml-1 mt-1 mr-3 w-ooolab_w_8 h-ooolab_h_8 opacity-100"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="red"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        </p>
                                    ) ||
                                        null)}
                                <div
                                    className={`flex flex-col justify-center items-center w-full h-full ${
                                        status !== 'creating' &&
                                        status !== 'done'
                                            ? ''
                                            : 'hidden'
                                    }`}
                                >
                                    <img
                                        className="w-ooolab_w_142px"
                                        src={CancelChanges}
                                        alt=""
                                    />
                                    {status === 'error_create' && (
                                        <>
                                            <p>
                                                Something went wrong when create
                                                course, please try again!
                                            </p>
                                            <button
                                                onClick={() => onClose()}
                                                className="mt-ooolab_m_2 rounded-lg bg-red-500 text-white px-ooolab_p_3 py-ooolab_p_1_e"
                                            >
                                                Close
                                            </button>
                                        </>
                                    )}
                                    {status === 'error_update' && (
                                        <>
                                            <p className="text-center px-ooolab_p_10">
                                                Something went wrong when update
                                                course background image, please
                                                try again!
                                            </p>
                                            <Link
                                                to={`/workspace/${params.id}/courses`}
                                            >
                                                <button className="mt-ooolab_m_2 rounded-lg bg-ooolab_blue_1 text-white px-ooolab_p_3 py-ooolab_p_1_e">
                                                    Back to Course List
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                    {status === 'error_upload' && (
                                        <>
                                            <p className="text-center px-ooolab_p_10">
                                                Cannot upload image, please try
                                                again!
                                            </p>
                                            <Link
                                                to={`/workspace/${params.id}/courses`}
                                            >
                                                <button className="mt-ooolab_m_2 rounded-lg bg-ooolab_blue_1 text-white px-ooolab_p_3 py-ooolab_p_1_e">
                                                    Back to Course List
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center w-full h-full ${
                                        status !== 'done' && 'hidden'
                                    }`}
                                >
                                    <img
                                        className="w-ooolab_w_142px"
                                        src={SaveChanges}
                                        alt=""
                                    />
                                    <p>Course Created Successfully!</p>
                                    <p className="text-ooolab_dark_2 text-ooolab_xs mt-ooolab_m_2">
                                        Redirect to Course List in 2 second
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalCreateCourse;
