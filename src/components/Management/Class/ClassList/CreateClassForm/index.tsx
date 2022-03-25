import { useContext, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useParams } from 'react-router';
import { ErrorMessage } from '@hookform/error-message';
import Timezone from 'dayjs/plugin/timezone';

import { UserContext } from 'contexts/User/UserContext';

// import 'slick-carousel/slick/slick-theme.css';
// import 'slick-carousel/slick/slick.css';
import { useBoolean } from 'hooks/custom';
import FormCreateSession from 'components/Management/components/FormCreateSession';
import ModalUploadImage from 'components/Management/components/UploadImage';
import './style.css';
import { createNewClass } from './CreateClassFormFN';
import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline';
import { NormalResponseError } from 'types/Common.type';
import { useTranslation } from 'react-i18next';
import { isValidURL } from 'utils/handleString';
import userService from 'services/user.service';
import classService from 'services/class.service';

dayjs.extend(Timezone);

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    rtl: false,
    adaptiveHeight: true,
};

interface CreateClassFormProps {
    onSuccessCreate: () => void;
    closeModal: () => void;
    callbackWhenDirty?: (v: boolean) => void;
}

const CreateClassForm: React.FC<CreateClassFormProps> = ({
    onSuccessCreate,
    callbackWhenDirty,
}) => {
    const { userState } = useContext(UserContext);
    const { result } = userState;
    const { t: translator } = useTranslation();
    const listErr: Record<string, string> = {
        INVALID_TIME_RANGE: translator('FORM_CONST.INVALID_TIME_RANGE'),
    };
    const {
        booleanValue: isUploadImage,
        toggleBooleanValue: toggleUploadImage,
    } = useBoolean();
    const [createErr, setCreateErr] = useState<NormalResponseError>();
    const [tmpAvatar, setTmpAvatar] = useState<{
        file: File;
        canvas: HTMLCanvasElement;
    }>();

    const [createStatus, setCreateStatus] = useState<
        'success' | 'error' | 'init'
    >('init');
    const refSlider = useRef(null);
    const params: { id: string; classId: string } = useParams();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        control,
        trigger,
        getValues,
        watch,
    } = useForm();
    // const {
    //     booleanValue: loadingCreate,
    //     toggleBooleanValue: toggleLoadingCreate,
    // } = useBoolean();
    useEffect(() => {
        if (isDirty || !!tmpAvatar) {
            callbackWhenDirty(true);
        }
    }, [isDirty, tmpAvatar]);
    const [loadingCreate, setLoadingCreate] = useState(false);

    const toggleLoadingCreate = (val?: boolean) => {
        if (val !== undefined) {
            setLoadingCreate(val);
        } else setLoadingCreate(!loadingCreate);
    };

    const {
        userState: { result: UserInformation },
    } = useContext(UserContext);

    const submitForm = async (val) => {
        toggleLoadingCreate();
        setCreateStatus('init');
        const formatTimeRage = [];
        const timeRangeValue = getValues('time_range');
        timeRangeValue.forEach((item) => {
            formatTimeRage.push({
                ...item,
                start_time: dayjs(item.start_time).format('HH:mm'),
                end_time: dayjs(item.end_time).format('HH:mm'),
            });
        });

        const submitData = {
            name: val['class-name'],
            start_date: dayjs(val['class_start_date']).format('YYYY-MM-DD'),
            end_date: dayjs(val['class_end_date']).format('YYYY-MM-DD'),
            time_range: formatTimeRage,
            vc_link: val['vc_link'],
            description: val['description'],
            time_zone: result.time_zone,
        };
        if (!submitData.description) {
            delete submitData.description;
        }
        if (submitData.time_range.length === 0) {
            delete submitData.time_range;
        }

        createNewClass(params.id, submitData)
            .then((res) => {
                setCreateStatus('success');
                return res;
            })
            .then(async (res) => {
                if (tmpAvatar && res && res.id) {
                    await userService.uploadImage(
                        tmpAvatar.file,
                        (resUpload) => {
                            classService
                                .updatePartialClass(params.id, res.id, {
                                    avatar: resUpload,
                                })
                                .finally(() => onSuccessCreate());
                        },
                        () => {},
                        tmpAvatar.canvas
                    );
                } else onSuccessCreate();
            })
            .catch((err: NormalResponseError) => {
                setCreateStatus('error');
                setCreateErr(err);
            })
            .finally(() => {
                setTimeout(() => toggleLoadingCreate(false), 300);
            });
    };
    const nextSlide = () => {
        refSlider.current.slickNext();
    };
    const prevSlide = () => {
        refSlider.current.slickPrev();
    };

    return (
        <form className="relative" onSubmit={handleSubmit(submitForm)}>
            <ModalUploadImage
                isOpen={isUploadImage}
                onClose={() => {
                    toggleUploadImage();
                }}
                onSubmitImage={(f, c) => {
                    setTmpAvatar({
                        file: f,
                        canvas: c,
                    });
                }}
            />
            <Slider
                ref={(slider) => {
                    refSlider.current = slider;
                }}
                autoplay={false}
                {...settings}
            >
                <div className="relative h-full">
                    <div className="grid grid-cols-2 px-ooolab_p_2 gap-x-10 gap-y-5 ">
                        <div className="col-span-2 flex items-center justify-center py-ooolab_p_6 w-full">
                            <div className="relative rounded-full overflow-hidden w-ooolab_w_30 h-ooolab_h_30 group hover:shadow transition-shadow duration-200">
                                {tmpAvatar && (
                                    <img
                                        src={tmpAvatar.canvas.toDataURL()}
                                        className="w-full h-full object-cover"
                                    />
                                )}

                                <svg
                                    width="120"
                                    height="120"
                                    viewBox="0 0 120 120"
                                    onClick={toggleUploadImage}
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="cursor-pointer w-full h-full"
                                >
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="60"
                                        fill="#FAFAFC"
                                    />
                                    <path
                                        d="M48.0473 75L48.014 75.0333L47.979 75H44.9873C44.5487 74.9996 44.1281 74.825 43.8181 74.5147C43.5081 74.2043 43.334 73.7836 43.334 73.345V46.655C43.337 46.2173 43.5122 45.7984 43.8215 45.4887C44.1309 45.179 44.5496 45.0035 44.9873 45H75.014C75.9273 45 76.6673 45.7417 76.6673 46.655V73.345C76.6643 73.7827 76.4892 74.2016 76.1798 74.5113C75.8704 74.821 75.4517 74.9965 75.014 75H48.0473V75ZM73.334 65V48.3333H46.6673V71.6667L63.334 55L73.334 65ZM73.334 69.7133L63.334 59.7133L51.3807 71.6667H73.334V69.7133ZM53.334 58.3333C52.4499 58.3333 51.6021 57.9821 50.977 57.357C50.3518 56.7319 50.0007 55.8841 50.0007 55C50.0007 54.1159 50.3518 53.2681 50.977 52.643C51.6021 52.0179 52.4499 51.6667 53.334 51.6667C54.218 51.6667 55.0659 52.0179 55.691 52.643C56.3161 53.2681 56.6673 54.1159 56.6673 55C56.6673 55.8841 56.3161 56.7319 55.691 57.357C55.0659 57.9821 54.218 58.3333 53.334 58.3333Z"
                                        fill="#8F90A6"
                                    />
                                </svg>
                                <svg
                                    width="120"
                                    height="120"
                                    viewBox="0 0 120 120"
                                    onClick={toggleUploadImage}
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`cursor-pointer top-0 left-0 opacity-0 ${
                                        tmpAvatar?.file
                                            ? 'group-hover:absolute group-hover:opacity-70'
                                            : ''
                                    }   z-20 w-full h-full transition-all duration-300`}
                                >
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="60"
                                        fill="#FAFAFC"
                                    />
                                    <path
                                        d="M48.0473 75L48.014 75.0333L47.979 75H44.9873C44.5487 74.9996 44.1281 74.825 43.8181 74.5147C43.5081 74.2043 43.334 73.7836 43.334 73.345V46.655C43.337 46.2173 43.5122 45.7984 43.8215 45.4887C44.1309 45.179 44.5496 45.0035 44.9873 45H75.014C75.9273 45 76.6673 45.7417 76.6673 46.655V73.345C76.6643 73.7827 76.4892 74.2016 76.1798 74.5113C75.8704 74.821 75.4517 74.9965 75.014 75H48.0473V75ZM73.334 65V48.3333H46.6673V71.6667L63.334 55L73.334 65ZM73.334 69.7133L63.334 59.7133L51.3807 71.6667H73.334V69.7133ZM53.334 58.3333C52.4499 58.3333 51.6021 57.9821 50.977 57.357C50.3518 56.7319 50.0007 55.8841 50.0007 55C50.0007 54.1159 50.3518 53.2681 50.977 52.643C51.6021 52.0179 52.4499 51.6667 53.334 51.6667C54.218 51.6667 55.0659 52.0179 55.691 52.643C56.3161 53.2681 56.6673 54.1159 56.6673 55C56.6673 55.8841 56.3161 56.7319 55.691 57.357C55.0659 57.9821 54.218 58.3333 53.334 58.3333Z"
                                        fill="#8F90A6"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="col-span-1 text-ooolab_xs">
                            <label
                                htmlFor="class-name"
                                className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                            >
                                {translator('CLASSES.CLASS_NAME')}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                                type="text"
                                id="class-name"
                                placeholder={translator('CLASSES.CLASS_NAME')}
                                maxLength={255}
                                {...register('class-name', {
                                    required: {
                                        value: true,
                                        message: translator(
                                            'FORM_CONST.REQUIRED_FIELD'
                                        ),
                                    },
                                    validate: {
                                        shouldNotContainSpace: (value) =>
                                            !!value.trim()
                                                ? true
                                                : `${translator(
                                                      'FORM_CONST.REQUIRED_FIELD'
                                                  )}`,
                                    },
                                })}
                            />
                            <ErrorMessage
                                className="text-red-500 text-ooolab_10px"
                                errors={errors}
                                name="class-name"
                                as="p"
                            />
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-2 text-ooolab_xs">
                            <label
                                htmlFor="vc_link"
                                className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                            >
                                {translator('CLASSES.CLASSROOM_LINK')}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                                type="text"
                                id="vc_link"
                                placeholder={translator('CLASSES.VC_URL')}
                                {...register('vc_link', {
                                    required: {
                                        value: true,
                                        message: translator(
                                            'FORM_CONST.REQUIRED_FIELD'
                                        ),
                                    },

                                    validate: {
                                        shouldNotContainSpace: (val) =>
                                            val.split(' ').length === 1
                                                ? true
                                                : `${translator(
                                                      'FORM_CONST.INVALID_URL_SPACE'
                                                  )}`,
                                        shouldBeValidURL: (val) => {
                                            const isValid = isValidURL(val);

                                            return isValid
                                                ? true
                                                : `${translator(
                                                      'FORM_CONST.INVALID_URL'
                                                  )}`;
                                        },
                                    },
                                })}
                            />
                            <ErrorMessage
                                className="text-red-500 text-ooolab_10px"
                                errors={errors}
                                name="vc_link"
                                as="p"
                            />
                        </div>
                        <div className="col-span-2 text-ooolab_xs">
                            <label
                                htmlFor="class-group"
                                className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                            >
                                {translator('CLASSES.DESCRIPTION')}
                            </label>
                            <textarea
                                className="text-ooolab_dark_1 rounded font-normal w-full border border-ooolab_bar_color leading-ooolab_24px pl-ooolab_p_2 py-ooolab_p_1 focus:outline-none"
                                rows={5}
                                maxLength={255}
                                id="class-description"
                                placeholder={translator(
                                    'CLASSES.DESCRIPTION_CLASS'
                                )}
                                {...register('description', {
                                    validate: {
                                        shouldHaveTenCharacters: (value) =>
                                            value.trim().length > 10 || !value
                                                ? true
                                                : `${translator(
                                                      'CLASSES.DECRIPTION_REQUIRED'
                                                  )}`,
                                    },
                                })}
                            />
                            <ErrorMessage
                                className="text-red-500 text-ooolab_10px"
                                errors={errors}
                                name="description"
                                as="p"
                            />
                        </div>
                        <div className="col-span-2 w-full flex justify-center text-center pt-ooolab_p_1">
                            <button
                                type="button"
                                onClick={async () => {
                                    const result = await trigger([
                                        'class-name',
                                        'vc_link',
                                        'description',
                                    ]);
                                    if (result) {
                                        nextSlide();
                                    }
                                }}
                                className="px-ooolab_p_2 py-ooolab_p_1_e bg-ooolab_dark_300 text-white rounded text-ooolab_xs "
                            >
                                {translator('CLASSES.CONTINUE')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* step 2 */}
                <div className="relative ">
                    <div className="flex flex-col justify-between min-h-ooolab_h_150 h-full">
                        <div className="px-ooolab_p_5 pt-ooolab_p_5 grid grid-cols-2 text-ooolab_xs gap-5">
                            <FormCreateSession
                                control={control}
                                watch={watch}
                                errors={errors}
                            />
                        </div>
                        <div className="w-full inline-flex flex-col">
                            <ul className="text-center list-disc ">
                                {createStatus === 'error' &&
                                    createErr?.error?.body_params &&
                                    createErr?.error?.body_params.map((i) => (
                                        <li className="text-ooolab_sxs text-red-500 flex items-center justify-center">
                                            <XIcon className="w-ooolab_w_3 h-ooolab_h_3 mr-ooolab_m_1" />
                                            <span>
                                                {listErr[i.msg] || i.msg}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    disabled={loadingCreate}
                                    onClick={prevSlide}
                                    className="px-ooolab_p_2 py-ooolab_p_1_e bg-ooolab_dark_300 text-white rounded text-ooolab_xs "
                                >
                                    <ArrowLeftIcon className="w-ooolab_w_4 h-ooolab_h_4" />
                                </button>
                                <button
                                    disabled={loadingCreate}
                                    type="submit"
                                    className="px-ooolab_p_2 flex items-center justify-center text-center py-ooolab_p_1_e bg-ooolab_dark_300 text-white rounded text-ooolab_xs min-w-ooolab_h_20"
                                >
                                    {loadingCreate ? (
                                        <svg
                                            className="animate-spin text-white w-ooolab_w_5 h-ooolab_h_5"
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
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <span className="transition-all">
                                            {translator('CLASSES.ADD_CLASS')}
                                        </span>
                                    )}
                                </button>
                                <span className="block"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </Slider>
        </form>
    );
};

export default CreateClassForm;
