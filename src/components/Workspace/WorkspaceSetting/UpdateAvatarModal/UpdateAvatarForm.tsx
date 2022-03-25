import * as React from 'react';
// PACKAGE
import { useForm } from 'react-hook-form';
// MIDDLWARE
import userMiddlware from 'middleware/user.middleware';
// CONTEXT
import { UploadAvatarContext } from 'contexts/User/UserContext';
// UTILS
import { updateLocalStorageUserInfoFields } from 'utils/handleLocalStorage';
import { MESSAGE } from 'constant/message.const';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import Photo from 'assets/SVG/photo.svg';
import { CONFIRM_SAVE_PHOTO_CHANGE_MODAL } from 'constant/modal.const';
import ConfirmChanges from 'assets/SVG/confirm-changes.svg';
import Modal from 'components/Modal';
import userService from 'services/user.service';
// import SavingChangesModal from '../SavingChangesModal/SavingChangesModal';

import { useTranslation } from 'react-i18next';

export interface UpdateAvatarFormProps {
    titleText: string;
    access_token: string | undefined;
    avatar_url: string | undefined;
    onCancel: () => void;
    onUpdatedAvatar: (avatar: string) => void;
}

export function handleChangeAvatar(
    setAvatar: React.Dispatch<React.SetStateAction<File | undefined>>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList) return;
        setAvatar(fileList[0]);
    };
}

const UpdateAvatarForm: React.FC<UpdateAvatarFormProps> = ({
    titleText,
    access_token,
    avatar_url,
    onCancel,
    onUpdatedAvatar,
}) => {
    const { t: translator } = useTranslation();
    const form: FormData = new FormData();
    const [errorMsg, setErrorMsg] = React.useState<string>();
    const [successMsg, setSuccessMsg] = React.useState<string>();
    const { uploadAvatarState, dispatch } = React.useContext(
        UploadAvatarContext
    );
    // Step 1: get info file
    // const uploadAvatarStateError = uploadAvatarState.err;
    // const uploadAvatarStateValidateError = uploadAvatarState.errVal;

    // Step 2: upload to AWS
    const uploadAvatarStateFormDataResult = uploadAvatarState.path;
    const uploadAvatarStateAvatarFinalResult =
        uploadAvatarState.avatarFinalResult;
    // Step 3: save and get avatar_url
    const uploadAvatarStateAvatarFinalError = uploadAvatarState.avatarFinalErr;
    const uploadAvatarStateAvatarFinalValidateError =
        uploadAvatarState.avatarFinalValidateErr;
    const isLoading = uploadAvatarState.isLoading;
    const [avatar, setAvatar] = React.useState<File | undefined>();
    const [
        croppedAvatar,
        setCroppedAvatar,
    ] = React.useState<HTMLCanvasElement>();
    const [isCropImage, showCropImage] = React.useState(false);
    const [isShowConfirmChangeModal, showConfirmChangeModal] = React.useState(
        false
    );

    // Step 1: get info file
    function onSave() {
        if (avatar) {
            // userMiddlware.uploadAvatarFormData(
            //     dispatch,
            //     avatar,
            //     access_token,
            //     croppedAvatar
            // );
            userService.uploadImage(
                avatar,
                onUpdatedAvatar, //success cb
                () => {}, //error cb
                croppedAvatar
            );
        }
    }

    return (
        <>
            <div className={'space-y-6 flex flex-col'}>
                <label
                    htmlFor="_editProfile"
                    className="font-normal text-ooolab_sm text-ooolab_dark_1 leading-ooolab_24px ml-ooolab_m_8 mt-ooolab_m_8"
                >
                    {titleText}
                </label>
                <div className={'bg-ooolab_gray_11 w-full h-ooolab_h_79'}>
                    {!isCropImage ? (
                        <DragAndDropImageComponent
                            onSelectImage={(image) => setAvatar(image)}
                        />
                    ) : (
                        <CropImageComponent
                            image={avatar!}
                            onCroppingImage={setCroppedAvatar}
                        />
                    )}
                </div>
                <div className="flex flex-row justify-between mx-ooolab_m_8">
                    {isCropImage ? (
                        <button
                            className={
                                'rounded-ooolab_radius_8px bg-white border border-ooolab_dark_2 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-ooolab_dark_1 font-medium mb-ooolab_m_6'
                            }
                            onClick={() => onCancel()}
                        >
                            {translator('ACCOUNT_SETTING.CANCEL')}
                        </button>
                    ) : (
                        <div />
                    )}
                    <div className={'flex flex-row space-x-4 mb-ooolab_m_6'}>
                        <button
                            className={`rounded-ooolab_radius_8px ${
                                avatar ? 'bg-white' : 'bg-ooolab_gray_12'
                            } border ${
                                avatar
                                    ? 'border-ooolab_dark_2'
                                    : 'ooolab_dark_1'
                            } px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px ${
                                avatar ? 'text-ooolab_dark_1' : 'text-white'
                            } font-medium`}
                            onClick={() => {
                                if (avatar) {
                                    if (!isCropImage) {
                                        showCropImage(true);
                                    } else {
                                        setAvatar(undefined);
                                        showCropImage(false);
                                    }
                                }
                            }}
                        >
                            {translator('ACCOUNT_SETTING.SELECT_AN_IMAGE')}
                        </button>
                        {isCropImage && (
                            <button
                                className="rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium"
                                onClick={(event) => {
                                    if (!isShowConfirmChangeModal) {
                                        showConfirmChangeModal(true);
                                    }
                                }}
                            >
                                {translator(
                                    'ACCOUNT_SETTING.USE_THIS_AS_PROFILE_PICTURE'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* <SavingChangesModal isLoading={isLoading} /> */}
            {isShowConfirmChangeModal && (
                <Modal
                    isOpen={true}
                    onClose={() => showConfirmChangeModal(false)}
                    title={CONFIRM_SAVE_PHOTO_CHANGE_MODAL.titleText}
                    imgSrc={ConfirmChanges}
                    contentText={CONFIRM_SAVE_PHOTO_CHANGE_MODAL.contentText}
                    subBtn={
                        <button
                            className={
                                'rounded-ooolab_radius_8px bg-white border border-ooolab_dark_2 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-ooolab_dark_1 font-medium'
                            }
                            onClick={() => showConfirmChangeModal(false)}
                        >
                            {translator(
                                'MODALS.CONFIRM_SAVE_CHANGE_MODAL.NO_CANCEL'
                            )}
                        </button>
                    }
                    mainBtn={
                        <button
                            className={
                                'rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1_half text-ooolab_sm leading-ooolab_24px text-white font-medium'
                            }
                            onClick={() => {
                                onSave();
                                showConfirmChangeModal(false);
                            }}
                        >
                            {translator('MODALS.YES_CHANGE_IT')}
                        </button>
                    }
                />
            )}
        </>
    );
};

const DragAndDropImageComponent: React.FC<{
    onSelectImage: (image: File) => void;
}> = ({ onSelectImage }) => {
    const [image, setImage] = React.useState<File | undefined>();

    useEffect(() => {
        if (image) {
            onSelectImage(image);
        }
    }, [image]);
    const { t: translator } = useTranslation();
    return (
        <Dropzone
            onDrop={(acceptedFiles) => {
                if (acceptedFiles && acceptedFiles.length > 0) {
                    setImage(acceptedFiles[0]);
                }
            }}
        >
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                    {...getRootProps()}
                    className={
                        'justify-center flex flex-col w-full h-full text-ooolab_xl text-ooolab_dark_2 font-medium leading-ooolab_28px items-center'
                    }
                >
                    <input {...getInputProps()} />
                    {image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            alt={image.name}
                            className={
                                'h-full px-ooolab_p_20 mt-ooolab_m_8 mb-ooolab_m_11'
                            }
                        />
                    ) : (
                        <div
                            className={
                                'justify-center flex flex-col items-center'
                            }
                        >
                            <label>
                                {isDragActive
                                    ? translator(
                                          'ACCOUNT_SETTING.DROP_THE_FILES_HERE'
                                      )
                                    : translator(
                                          'ACCOUNT_SETTING.DRAG_OR_DROP_IMAGE_HERE'
                                      )}
                            </label>
                            {!isDragActive && (
                                <label className={'italic text-ooolab_base'}>
                                    {translator(
                                        'ACCOUNT_SETTING.ONLY_JPG_JPEG_PNG_IMAGES_WILL_BE_ACCEPTED'
                                    )}
                                </label>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Dropzone>
    );
};

const CropImageComponent: React.FC<{
    image: File;
    onCroppingImage: (image: HTMLCanvasElement) => void;
}> = ({ image, onCroppingImage }) => {
    const [scale, setScale] = useState(1);
    let editor: AvatarEditor;
    const setEditorRef = (avatarEditor: AvatarEditor) =>
        (editor = avatarEditor);
    useEffect(() => {
        if (editor) {
            try {
                onCroppingImage(editor.getImage());
            } catch (e) {}
        }
    }, [scale]);
    return (
        <div
            className={
                'w-full flex flex-col justify-center items-center h-full'
            }
        >
            <AvatarEditor
                ref={setEditorRef}
                image={image}
                borderRadius={150}
                width={300}
                height={300}
                scale={scale}
                onPositionChange={() => {
                    onCroppingImage(editor.getImage());
                }}
                className={'items-center justify-center'}
                border={0}
            />

            <div
                className={'flex flex-row space-x-1 items-center mt-ooolab_m_4'}
            >
                <img
                    src={Photo}
                    alt={'_large'}
                    className={'w-ooolab_w_2_root h-ooolab_h_2'}
                />
                <input
                    type={'range'}
                    min={100}
                    max={200}
                    step={1}
                    onChange={(event) => {
                        setScale(Number(event.target.value) / 100);
                    }}
                    className={''}
                />
                <img
                    src={Photo}
                    alt={'_large'}
                    className={'w-ooolab_w_4 h-ooolab_h_4'}
                />
            </div>
        </div>
    );
};

export default UpdateAvatarForm;
