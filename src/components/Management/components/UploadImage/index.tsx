import React, { Fragment, FC, useRef, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline';
import { toInteger } from 'lodash';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    isOpen: boolean;
    onSubmitImage: (file: File, canvas: HTMLCanvasElement) => void;
    onClose: Function;
}

const DragAndDropImageComponent: React.FC<{
    onSelectImage: (image: File) => void;
}> = ({ onSelectImage }) => {
    const { t: translator } = useTranslation();
    return (
        <Dropzone
            onDrop={(acceptedFiles) => {
                if (acceptedFiles && acceptedFiles.length > 0) {
                    onSelectImage(acceptedFiles[0]);
                }
            }}
            accept="image/jpeg, image/png"
        >
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                    {...getRootProps()}
                    className={
                        'cursor-pointer justify-center flex flex-col w-full h-full text-ooolab_xl text-ooolab_dark_2 font-medium leading-ooolab_28px items-center'
                    }
                >
                    <input {...getInputProps()} />
                    <label>
                        {isDragActive ? (
                            translator('UPLOAD_IMG.DRAG_THE_FILES')
                        ) : (
                            <div className="text-center cursor-pointer">
                                <p>
                                    {translator('UPLOAD_IMG.DRAG_DROP_IMAGE')}
                                </p>
                                <em className="text-ooolab_xs">
                                    {translator('UPLOAD_IMG.ONLY_IMAGES')}
                                </em>
                            </div>
                        )}
                    </label>
                </div>
            )}
        </Dropzone>
    );
};

const ModalSelectImage: FC<ModalProps> = ({
    isOpen,
    onSubmitImage,
    onClose,
}) => {
    const { t: translator } = useTranslation();

    const cancelButtonRef = useRef(null);
    const [imagePath, setImagePath] = useState<File | undefined>();
    const [scale, setScale] = useState(1);
    let editor: AvatarEditor;
    const setEditorRef = (avatarEditor: AvatarEditor) =>
        (editor = avatarEditor);

    const onSaveImage = () => {
        if (editor && imagePath) {
            const canvas = editor.getImageScaledToCanvas();
            onSubmitImage(imagePath, canvas);
            onClose();
        }
    };

    const handleClose = () => {
        setImagePath(undefined);
        setScale(1);
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setImagePath(undefined);
            setScale(1);
        }
    }, [isOpen]);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-9999 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={handleClose}
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
                        <div
                            className={`bg-white rounded-ooolab_card text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle relative
                             ${!imagePath && 'w-2/5 h-3/5'}
                        `}
                        >
                            {imagePath ? (
                                <div className="w-full h-full relative flex flex-col items-center justify-center px-ooolab_p_16 py-ooolab_p_16">
                                    <div className="absolute w-full items-center top-0 left-0 px-ooolab_p_5 py-ooolab_p_5 flex justify-between">
                                        {translator('UPLOAD_IMG.UPDATE_AVATAR')}
                                        <XIcon
                                            onClick={handleClose}
                                            className="w-ooolab_w_4 h-ooolab_h_4"
                                        />
                                    </div>
                                    <div className="absolute w-full items-center bottom-0 left-0 px-ooolab_p_5 py-ooolab_p_5 flex justify-between">
                                        <ArrowLeftIcon
                                            onClick={() =>
                                                setImagePath(undefined)
                                            }
                                            className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer"
                                        />
                                        <button
                                            onClick={() => onSaveImage()}
                                            className="px-ooolab_p_3 py-ooolab_p_1 rounded-lg text-white bg-ooolab_blue_1 focus:outline-none border"
                                        >
                                            {translator('UPLOAD_IMG.SAVE')}
                                        </button>
                                    </div>

                                    <AvatarEditor
                                        ref={setEditorRef}
                                        style={{
                                            width: 'calc(300*(100vw/1440))',
                                            height: 'calc(300*(100vw/1440))',
                                        }}
                                        image={imagePath}
                                        border={20}
                                        color={[255, 225, 225, 0.6]} // RGBA
                                        scale={scale}
                                        rotate={0}
                                    />
                                    <div className="flex justify-center">
                                        <label htmlFor="course-background">
                                            {translator('UPLOAD_IMG.SCALE')}
                                        </label>
                                        <input
                                            onChange={(e) =>
                                                setScale(
                                                    toInteger(e.target.value)
                                                )
                                            }
                                            step={0.1}
                                            min={1}
                                            max={3}
                                            className="w-ooolab_w_142px"
                                            type="range"
                                            name=""
                                            id="course-background"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <DragAndDropImageComponent
                                    onSelectImage={(e) => setImagePath(e)}
                                />
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalSelectImage;
