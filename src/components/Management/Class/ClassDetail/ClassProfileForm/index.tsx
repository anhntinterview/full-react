import { useCallback, useContext, useEffect, useState } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import lodash, { toInteger } from 'lodash';
import Select, { StylesConfig } from 'react-select';
import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/timezone';
import {
    ExclamationCircleIcon,
    ExclamationIcon,
} from '@heroicons/react/outline';
import 'react-datepicker/dist/react-datepicker.css';

import { getDayOfWeekInRange } from 'utils/handleFormatTime';
import { ListWeekDay, WeekDay } from 'constant/util.const';
import DatePickerInput from 'components/Management/components/Form/DatePicker';
import CustomCheckbox from 'components/Management/components/Form/CustomCheckbox';
import TimePickerInput from 'components/Management/components/Form/TimePicker';
import ModalUploadImage from 'components/Management/components/UploadImage';
import Modal from 'components/Modal';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

import userService from 'services/user.service';
import { useBoolean } from 'hooks/custom';
import classService from 'services/class.service';
import { UserContext } from 'contexts/User/UserContext';
import ModalCreateClass from './ModalCreateClass';
import { isValidURL } from 'utils/handleString';
import { timezone } from 'constant/timezone.const';
import { CLASS_DATE_FORMAT } from 'constant/ui.const';
import { formatTimezone } from 'components/User/AccountSettingForm/AccountSettingFormFn';

import ArrowDown from 'assets/SVG/arrow_down.svg';

dayjs.extend(Timezone);

const customSelectStyle: StylesConfig<any, true> = {
    clearIndicator: (base) => ({ ...base, display: 'none' }),
    indicatorSeparator: (base) => ({ ...base, display: 'none' }),
    control: (base, { selectProps }) => ({
        ...base,
        border: 'none',
        boxShadow: 'none',
        cursor: 'pointer',
        ':focus': {
            border: 'none',
            boxShadow: 'none',
        },
        ':active': {
            border: 'none',
            boxShadow: 'none',
        },
        ':hover': {
            border: 'none',
            boxShadow: 'none',
        },
    }),
    indicatorsContainer: (base, { selectProps }) => ({
        ...base,
        // display: 'none',
    }),
    singleValue: (base) => ({
        ...base,
        color: 'rgba(16, 185, 129)',
    }),
};

const DropdownIndicator = () => (
    <img
        className="w-ooolab_w_5 h-ooolab_h_5 leading-ooolab_24px"
        src={ArrowDown}
        alt=""
    />
);

const GroupProfile = () => {
    const params = useParams<{ id: string; classId: string }>();
    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );
    const {
        dispatch: userDispatch,
        userState: { result },
    } = useContext(UserContext);
    const {
        detail,
        getDetailStatus,
        getDetailError,
    } = getWorkspaceDetailState.class;
    const {
        membership: { role },
    } = getWorkspaceDetailState.result;

    const [canUpdate, setCanUpdate] = useState(false);
    const {
        booleanValue: isUpload,
        toggleBooleanValue: toggleIsUpload,
    } = useBoolean();

    const {
        booleanValue: confirmUpdate,
        toggleBooleanValue: toggleConfirmUpdate,
    } = useBoolean();

    const {
        booleanValue: confirmDeactivateClass,
        toggleBooleanValue: toggleDeactivateClass,
    } = useBoolean();

    const [tmpAvatar, setTmpAvatar] = useState('');

    const { t: translator } = useTranslation();
    const {
        register,
        formState: { errors, dirtyFields, isDirty },
        getValues,
        handleSubmit,
        control,
        watch,
        reset,
        setError,
        clearErrors,
    } = useForm({});
    const formWatch = watch();

    //watch field state of form
    const startDateWatch = watch('start_date');
    const endDateWatch = watch('end_date');
    const timeslotWatch = watch('time_range');
    const timeZoneWatch = watch('time_zone');

    const confirmSubmit = async () => {
        const validationState = customValidate();
        if (validationState) {
            toggleConfirmUpdate();
        }
    };

    const customValidate = () => {
        const formVal = getValues();
        if (!!formVal.description && formVal.description.length < 10) {
            setError('description', {
                type: 'required',
                message: translator('CLASSES.DECRIPTION_REQUIRED'),
            });
            return false;
        } else {
            clearErrors('description');
        }

        return true;
    };

    const onSubmit = () => {
        const data = getValues();
        const tmpData = {
            ...data,
            time_range: data.time_range.length
                ? data.time_range.map((item) => ({
                      ...item,
                      start_time: dayjs(item.start_time)
                          .set('second', 0)
                          .format('HH:mm:ss'),
                      end_time: dayjs(item.end_time)
                          .set('second', 0)
                          .format('HH:mm:ss'),
                  }))
                : null,
            start_date: dayjs(data.start_date).format('YYYY-MM-DD'),
            end_date: dayjs(data.end_date).format('YYYY-MM-DD'),
            time_zone: data.time_zone.value,
        };
        if (!tmpData['description']) tmpData['description'] = null;
        const listUpdateKeys = Object.keys(dirtyFields);
        const submitData = {};
        listUpdateKeys.forEach((i) => {
            if (!lodash.isEqual(tmpData[i], detail[i]))
                submitData[i] = tmpData[i];
        });
        workspaceMiddleware.updateClass(dispatch, {
            classId: params.classId,
            workspaceId: params.id,
            updateParams: submitData,
        });
    };

    //Watch some fields to display warning to user
    //START
    const isTimerangeChanged = lodash.isEqual(
        formWatch.time_range && formWatch.time_range.length
            ? formWatch.time_range.map((item) => {
                  return {
                      ...item,
                      start_time: dayjs(item.start_time)
                          .set('seconds', 0)
                          .format('HH:mm:ss'),
                      end_time: dayjs(item.end_time)
                          .set('seconds', 0)
                          .format('HH:mm:ss'),
                  };
              })
            : [],
        detail?.time_range || []
    );

    const isStartDateChange =
        dayjs(detail?.start_date).format('YYYY-MM-DD') ===
        dayjs(startDateWatch).format('YYYY-MM-DD');

    const isEndDateChange =
        dayjs(detail?.end_date).format('YYYY-MM-DD') ===
        dayjs(endDateWatch).format('YYYY-MM-DD');

    const isTimezoneChange =
        detail?.time_zone && !!timeZoneWatch
            ? lodash.isEqual(timeZoneWatch.value, detail.time_zone)
            : false;
    //END

    useEffect(() => {
        const listKeys = detail ? Object.keys(detail) : [];

        if (detail && dirtyFields && listKeys.length > 0) {
            const copiedDirtyFields = { ...dirtyFields };
            const copiedFormWatch = { ...formWatch };

            if (copiedFormWatch['time_range']) {
                copiedFormWatch['time_range'] = copiedFormWatch[
                    'time_range'
                ].map((item) => {
                    return {
                        ...item,
                        start_time: dayjs(item.start_time)
                            .set('seconds', 0)
                            .format('HH:mm:ss'),
                        end_time: dayjs(item.end_time)
                            .set('seconds', 0)
                            .format('HH:mm:ss'),
                    };
                });
            }
            if (copiedFormWatch['time_zone']) {
                copiedFormWatch['time_zone'] =
                    copiedFormWatch['time_zone'].value;
            }

            listKeys.forEach((i) => {
                const copyDetailItem =
                    i === 'end_date' || i === 'start_date'
                        ? dayjs(detail[i]).startOf('day').toDate()
                        : detail[i];
                const copyFormItem =
                    i === 'end_date' || i === 'start_date'
                        ? dayjs(copiedFormWatch[i]).startOf('day').toDate()
                        : copiedFormWatch[i];

                if (lodash.isEqual(copyDetailItem, copyFormItem)) {
                    delete copiedDirtyFields[i];
                }
            });
            setCanUpdate(Object.keys(copiedDirtyFields).length > 0);
        } else setCanUpdate(false);
    }, [formWatch, dirtyFields, detail]);

    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: 'time_range', // unique name for your Field Array
        // keyName: "id", default to "id", you can change the key name
        shouldUnregister: true,
    });

    const resetTimeslots = useCallback(() => {
        const listAllowWeekday = getDayOfWeekInRange(
            startDateWatch,
            endDateWatch
        );
        const listRemoveValue = timeslotWatch
            ?.filter((i) => !listAllowWeekday.includes(i['weekday']))
            .map((j) => j['weekday']);

        const listRemoveIndex = [];

        fields.forEach((j, index) => {
            if (listRemoveValue.includes(j['weekday'])) {
                listRemoveIndex.push(index);
            }
        });

        remove(listRemoveIndex);

        const listInputsDocument = document.getElementsByClassName(
            'custom-input'
        );
        if (listInputsDocument?.length) {
            for (let i = 0; i < listInputsDocument.length; i++) {
                const inputFields = listInputsDocument[i] as HTMLInputElement;
                if (
                    inputFields &&
                    !listAllowWeekday.includes(toInteger(inputFields.value))
                )
                    inputFields.checked = false;
            }
        }
    }, [timeslotWatch]);

    const handleChangeTimeSlot = useCallback(
        (checked: boolean, fieldsValue: number) => {
            if (checked) {
                append({
                    weekday: fieldsValue,
                    start_time: null,
                    end_time: null,
                });
            } else {
                const targetIndex = fields.findIndex(
                    (i) => i['weekday'] === fieldsValue
                );
                if (targetIndex > -1) {
                    remove(targetIndex);
                }
            }
        },
        [fields, remove, append]
    );

    const sortedTimeslots = Array.from(fields)
        .map((i, index) => ({ ...i, originalIndex: index }))
        .sort((a, b) => a['weekday'] - b['weekday']);
    const listActiveDay = getDayOfWeekInRange(startDateWatch, endDateWatch);

    const handleUpdateImage = async (
        image: File,
        canvas?: HTMLCanvasElement | undefined
    ) => {
        userService.uploadImage(
            image,
            (e) => {
                classService
                    .updatePartialClass(params.id, params.classId, {
                        avatar: e,
                    })
                    .then(() => {
                        setTmpAvatar(canvas.toDataURL());
                    })
                    .catch(() => setTmpAvatar(''));
            },
            () => {},
            canvas
        );
    };

    const handleUpdateClassStatus = (param: 'active' | 'deactivate') => {
        classService
            .updateClassStatus(params.id, params.classId, param)
            .then(() => {
                workspaceMiddleware.getClassDetail(dispatch, {
                    classId: params.classId,
                    workspaceId: params.id,
                });
            });
    };

    const customTimeZone: { value: string; label: string }[] = [];
    timezone.map((item) => {
        customTimeZone.push({
            label: item.text,
            value: item.utc[0],
        });
    });

    useEffect(() => {
        if (
            fields.length === 0 ||
            !startDateWatch ||
            !endDateWatch ||
            dayjs(startDateWatch).format('YYYY-MM-DD') !== detail?.start_date ||
            dayjs(endDateWatch).format('YYYY-MM-DD') !== detail?.end_date
        ) {
            resetTimeslots();
        }
    }, [startDateWatch, endDateWatch]);

    useEffect(() => {
        workspaceMiddleware.getClassDetail(dispatch, {
            classId: params.classId,
            workspaceId: params.id,
        });
    }, [params.id]);

    useEffect(() => {
        if (detail && getDetailStatus === 'done') {
            reset(
                {
                    name: detail.name,
                    description: detail.description,
                    vc_link: detail.vc_link,
                    start_date: new Date(detail.start_date),
                    end_date: new Date(detail.end_date),
                    time_zone: formatTimezone(detail.time_zone),
                    time_range: detail?.time_range
                        ? detail.time_range.map((i) => {
                              const [
                                  iHourStart,
                                  iMinuteStart,
                              ] = i.start_time.split(':');
                              const [iHourEnd, iMinuteEnd] = i.end_time.split(
                                  ':'
                              );
                              const convertStartTime = dayjs()
                                  .set('hour', toInteger(iHourStart))
                                  .set('minute', toInteger(iMinuteStart));
                              const convertEndTime = dayjs()
                                  .set('hour', toInteger(iHourEnd))
                                  .set('minute', toInteger(iMinuteEnd));

                              return {
                                  weekday: i.weekday,
                                  start_time: new Date().setHours(
                                      convertStartTime.get('hour'),
                                      convertStartTime.get('minute')
                                  ),

                                  end_time: new Date().setHours(
                                      convertEndTime.get('hour'),
                                      convertEndTime.get('minute')
                                  ),
                              };
                          })
                        : [],
                },
                {
                    keepDirty: false,
                }
            );

            const listWeekdayChecked = detail?.time_range
                ? detail?.time_range.map((i) => i.weekday)
                : [];
            const listInputsDocument = document.getElementsByClassName(
                'custom-input'
            );
            if (listInputsDocument?.length) {
                for (let i = 0; i < listInputsDocument.length; i++) {
                    const inputFields = listInputsDocument[
                        i
                    ] as HTMLInputElement;
                    if (
                        inputFields &&
                        listWeekdayChecked.includes(
                            toInteger(inputFields.value)
                        )
                    ) {
                        inputFields.checked = true;
                    }
                }
            }
            // breadcrumb
            workspaceMiddleware.setCurrentRouteDetail(dispatch, [
                {
                    name: detail.name,
                    routeId: 'classId',
                },
            ]);
            workspaceMiddleware.resetClassStatus(dispatch);
        }
    }, [detail, getDetailStatus]);
    return (
        <form
            onSubmit={handleSubmit(confirmSubmit)}
            className={`px-ooolab_p_5 relative ${detail ? '' : 'hidden'}`}
        >
            <ModalCreateClass
                isOpen={confirmUpdate}
                onClose={() => {
                    toggleConfirmUpdate();
                    setTimeout(
                        () => workspaceMiddleware.resetClassStatus(dispatch),
                        200
                    );
                }}
                submitData={{}}
                onSave={onSubmit}
                createStatus={getDetailStatus}
                createError={getDetailError}
            />
            <Modal
                isOpen={confirmDeactivateClass}
                onClose={toggleDeactivateClass}
                title={translator('CLASSES.CONFIRM_DEACTIVE')}
                contentText={translator('CLASSES.SUB_TITLE_MODAL')}
                imgSrc={
                    <ExclamationIcon className="text-red-500 w-ooolab_w_10 h-ooolab_h_10" />
                }
                subBtn={
                    <button
                        className="px-ooolab_p_2 py-ooolab_p_1_e bg-gray-700 text-white border-none rounded"
                        onClick={toggleDeactivateClass}
                        type="button"
                    >
                        {translator('CLASSES.CANCEL')}
                    </button>
                }
                mainBtn={
                    <button
                        className="px-ooolab_p_2 py-ooolab_p_1_e bg-red-500 text-white border-none rounded"
                        type="button"
                        onClick={() => {
                            handleUpdateClassStatus('deactivate');
                            setTimeout(() => toggleDeactivateClass(), 200);
                        }}
                    >
                        {translator('CLASSES.DEACTIVE')}
                    </button>
                }
            />
            <ModalUploadImage
                isOpen={isUpload}
                onClose={toggleIsUpload}
                onSubmitImage={handleUpdateImage}
            />
            <div className="border-b border-ooolab_bar_color px-ooolab_p_5 py-ooolab_p_5 flex items-center justify-between">
                <div className="relative overflow-hidden w-ooolab_w_25 h-ooolab_h_25 rounded-full border z-1 group hover:border-black">
                    <img
                        className="w-full h-full z-1 absolute left-0"
                        src={tmpAvatar || detail?.avatar}
                        alt="group-avatar"
                    />
                    {detail?.status === 'active' && role === 'admin' ? (
                        <button
                            type="button"
                            onClick={toggleIsUpload}
                            className="z-30 w-ooolab_w_25 h-ooolab_h_25 bg-ooolab_dark_50 bg-opacity-60 rounded-full border-ooolab_bar_color -left-full absolute group-hover:left-0"
                        >
                            <span className="text-ooolab_10px bg-ooolab_light_100 p-ooolab_p_1">
                                {translator('CLASSES.CHANGE_AVATAR')}
                            </span>
                        </button>
                    ) : null}
                </div>

                <div
                    className={`flex items-center text-ooolab_xs font-semibold ${
                        role !== 'admin' && 'hidden'
                    }`}
                >
                    {detail?.status !== 'active' ? (
                        <button
                            type="button"
                            onClick={() => handleUpdateClassStatus('active')}
                            className="px-ooolab_p_2 py-ooolab_p_1_e border-none shadow-ooolab_box_shadow_container rounded"
                        >
                            {translator('CLASSES.ACTIVATE')}
                        </button>
                    ) : (
                        <>
                            <button
                                disabled={!canUpdate}
                                type="submit"
                                className="disabled:cursor-not-allowed disabled:bg-gray-400 mr-ooolab_m_3 px-ooolab_p_2 py-ooolab_p_1_e bg-ooolab_dark_300 text-white rounded"
                            >
                                {translator('CLASSES.SAVE')}
                            </button>
                            <button
                                onClick={toggleDeactivateClass}
                                type="button"
                                className="px-ooolab_p_2 py-ooolab_p_1_e border-none shadow-ooolab_box_shadow_container rounded"
                            >
                                {translator('CLASSES.DEACTIVATE')}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="p-ooolab_p_5 grid grid-cols-6 gap-x-ooolab_w_8 gap-y-ooolab_w_5">
                <div className="col-span-2 text-ooolab_xs">
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
                        maxLength={255}
                        disabled={detail?.status !== 'active'}
                        placeholder={translator('CLASSES.CLASS_NAME')}
                        {...register('name', {
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
                        name="name"
                        as="p"
                    />
                </div>
                <div className="col-span-4"></div>
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
                        disabled={detail?.status !== 'active'}
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
                                              'FORM_CONST.INVALID_URL'
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
                <div className="col-span-4"></div>
                <div className="col-span-4 text-ooolab_xs">
                    <label
                        htmlFor="description"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        {translator('CLASSES.DESCRIPTION')}
                    </label>
                    <textarea
                        className="border focus:outline-none lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                        rows={5}
                        maxLength={255}
                        disabled={detail?.status !== 'active'}
                        id={translator('CLASSES.DESCRIPTION_CLASS')}
                        placeholder={
                            detail?.status === 'active' ? 'Description' : null
                        }
                        {...register('description', {
                            // validate: (value) =>
                            //     (value && value.trim().length > 10) || !value
                            //         ? true
                            //         : 'Description must be at least 10 characters!',
                        })}
                    />
                    <ErrorMessage
                        className="text-red-500 text-ooolab_10px"
                        errors={errors}
                        name="description"
                        as="p"
                    />
                </div>
                <div className="col-span-6 mt-ooolab_m_5"></div>
                <div className="col-span-1">
                    <label
                        className="text-ooolab_dark_1 text-ooolab_xs font-semibold leading-ooolab_24px block"
                        htmlFor="start_date"
                    >
                        {translator('CLASSES.START_DATE')}
                    </label>
                    <div className="w-full h-ooolab_h_8 relative">
                        <DatePickerInput
                            control={control}
                            name="start_date"
                            placeholderText={CLASS_DATE_FORMAT}
                            maxDate={endDateWatch}
                            isRequired
                            disabled={detail?.status !== 'active'}
                        />
                    </div>
                    <ErrorMessage
                        className="text-red-500 text-ooolab_10px"
                        errors={errors}
                        name="start_date"
                        as="p"
                    />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-1">
                    <label
                        className="text-ooolab_dark_1 text-ooolab_xs font-semibold leading-ooolab_24px block"
                        htmlFor="end_date"
                    >
                        {translator('CLASSES.END_DATE')}
                    </label>
                    <div className="w-full h-ooolab_h_8 relative">
                        <DatePickerInput
                            control={control}
                            name="end_date"
                            placeholderText={CLASS_DATE_FORMAT}
                            minDate={startDateWatch || null}
                            isRequired
                            disabled={detail?.status !== 'active'}
                        />
                    </div>
                    <ErrorMessage
                        className="text-red-500 text-ooolab_10px"
                        errors={errors}
                        name="end_date"
                        as="p"
                    />
                </div>
                <div className="col-span-6 border-t border-ooolab_gray_6 mt-ooolab_m_5"></div>
                {detail?.status === 'active' && (
                    <>
                        <div className="col-span-2 text-ooolab_dark_1">
                            <p className="text-ooolab_xs font-semibold mb-ooolab_m_5">
                                {translator('CLASSES.CLASS_DAYS')}
                            </p>
                            <div className="grid grid-cols-7">
                                {ListWeekDay(translator).map((i, index) => {
                                    return (
                                        <CustomCheckbox
                                            key={`class-slot-${i.name}`}
                                            className="flex col-span-1 items-center text-ooolab_10px font-semibold leading-ooolab_24px"
                                            value={i.value}
                                            title={i.name}
                                            onChange={handleChangeTimeSlot}
                                            disabled={
                                                !listActiveDay.includes(i.value)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div className="col-span-3 flex items-end">
                            {(!isTimerangeChanged ||
                                !isStartDateChange ||
                                !isEndDateChange ||
                                !isTimezoneChange) && (
                                <p className="text-red-500 text-ooolab_xs inline-flex items-center">
                                    <ExclamationCircleIcon className="w-ooolab_w_5 h-ooolab_h_5 " />
                                    <span>
                                        {translator(
                                            'CLASSES.CHANGE_WILL_REMOVE'
                                        )}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-4 text-ooolab_xs">
                            <div className="font-bold mb-ooolab_m_2 mt-ooolab_m_1 flex items-center">
                                <p>{translator('CLASSES.TIME_SLOT')}</p>
                                <div className="text-ooolab_xs font-medium inline-flex items-center">
                                    <ExclamationCircleIcon className="w-ooolab_w_5 h-ooolab_h_5 mx-ooolab_m_1 text-green-500 " />
                                    <span className="text-green-500">
                                        {' '}
                                        {translator(
                                            'CLASSES.TIME_SLOT_IN_TIME_ZONE'
                                        )}
                                    </span>{' '}
                                    <Controller
                                        control={control}
                                        name="time_zone"
                                        render={({ field, formState }) => {
                                            return (
                                                <Select
                                                    {...field}
                                                    {...formState}
                                                    className="text-ooolab_xs min-w-ooolab_h_40 cursor-pointer"
                                                    styles={customSelectStyle}
                                                    options={customTimeZone}
                                                    menuPlacement="top"
                                                />
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-3 mb-ooolab_m_2 text-ooolab_xs">
                            {sortedTimeslots.map((field) => {
                                const fieldValue = timeslotWatch.find(
                                    (i) => i.weekday === field['weekday']
                                );

                                const filterPassedTime = (time) => {
                                    return fieldValue['start_time']
                                        ? dayjs(time).isAfter(
                                              fieldValue['start_time']
                                          )
                                        : true;
                                };
                                const filterMinTime = (time) => {
                                    return fieldValue['end_time']
                                        ? dayjs(time)
                                              .set('milliseconds', 0)
                                              .isBefore(
                                                  dayjs(
                                                      fieldValue['end_time']
                                                  ).set('milliseconds', 0)
                                              )
                                        : true;
                                };
                                return (
                                    <div
                                        className="grid grid-cols-5 mb-ooolab_m_2 items-center gap-x-3"
                                        key={`${field.id}`}
                                    >
                                        <label
                                            className="col-span-1 inline-flex align-middle capitalize text-ooolab_dark_2 font-semibold"
                                            htmlFor={field.id}
                                        >
                                            {
                                                WeekDay(translator)[
                                                    field['weekday']
                                                ]
                                            }
                                        </label>
                                        <input
                                            className="col-span-2 hidden"
                                            defaultValue={field['weekday']}
                                            {...register(
                                                `time_range.${field.originalIndex}.weekday`
                                            )}
                                        />
                                        <div className="col-span-2">
                                            <TimePickerInput
                                                control={control}
                                                name={`time_range.${field.originalIndex}.start_time`}
                                                placeholderText={translator(
                                                    'CLASSES.START_DATE'
                                                )}
                                                defaultValue={
                                                    field['start_time'] &&
                                                    new Date(
                                                        field['start_time']
                                                    )
                                                }
                                                filter={filterMinTime}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <TimePickerInput
                                                control={control}
                                                name={`time_range.${field.originalIndex}.end_time`}
                                                placeholderText={translator(
                                                    'CLASSES.END_DATE'
                                                )}
                                                filter={filterPassedTime}
                                                defaultValue={
                                                    field['end_time'] &&
                                                    new Date(field['end_time'])
                                                }
                                            />
                                        </div>
                                        <div className="col-span-1"></div>
                                        <div className="col-span-2">
                                            <ErrorMessage
                                                className="text-red-500 text-ooolab_10px min-h-button"
                                                errors={errors}
                                                name={`time_range.${field.originalIndex}.start_time`}
                                                as="p"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <ErrorMessage
                                                className="text-red-500 text-ooolab_10px min-h-button"
                                                errors={errors}
                                                name={`time_range.${field.originalIndex}.end_time`}
                                                as="p"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </form>
    );
};

export default GroupProfile;
