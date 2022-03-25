import { Controller, useForm } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { ErrorMessage } from '@hookform/error-message';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import DatePickerInput from 'components/Management/components/Form/DatePicker';

const customSelectStyle: StylesConfig<any, true> = {
    clearIndicator: (base) => ({ ...base, display: 'none' }),
    indicatorSeparator: (base) => ({ ...base, display: 'none' }),
    control: (base) => ({
        ...base,
        borderColor: '#e6e6e6',
    }),
};


const CreateTeacherFrom = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const submitForm = (val) => console.log(val);
    return (
        <form
            onSubmit={handleSubmit(submitForm)}
            className="grid grid-cols-2 px-ooolab_p_2 gap-x-8 gap-y-5"
        >
            <div className="col-span-2 flex items-center justify-center py-ooolab_p_6">
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="60" cy="60" r="60" fill="#FAFAFC" />
                    <path
                        d="M46.666 76.666C46.666 73.1298 48.0708 69.7384 50.5713 67.2379C53.0717 64.7374 56.4631 63.3327 59.9993 63.3327C63.5356 63.3327 66.927 64.7374 69.4274 67.2379C71.9279 69.7384 73.3327 73.1298 73.3327 76.666H69.9993C69.9993 74.0139 68.9458 71.4703 67.0704 69.5949C65.1951 67.7196 62.6515 66.666 59.9993 66.666C57.3472 66.666 54.8036 67.7196 52.9283 69.5949C51.0529 71.4703 49.9993 74.0139 49.9993 76.666H46.666ZM59.9993 61.666C54.4743 61.666 49.9993 57.191 49.9993 51.666C49.9993 46.141 54.4743 41.666 59.9993 41.666C65.5243 41.666 69.9993 46.141 69.9993 51.666C69.9993 57.191 65.5243 61.666 59.9993 61.666ZM59.9993 58.3327C63.6827 58.3327 66.666 55.3493 66.666 51.666C66.666 47.9827 63.6827 44.9993 59.9993 44.9993C56.316 44.9993 53.3327 47.9827 53.3327 51.666C53.3327 55.3493 56.316 58.3327 59.9993 58.3327Z"
                        fill="#8F90A6"
                    />
                </svg>
            </div>
            <div className="col-span-1 text-ooolab_xs">
                <label
                    htmlFor="teacher-email"
                    className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                >
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_2 p-ooolab_p_2 rounded font-normal"
                    type="email"
                    id="teacher-email"
                    placeholder="Teacher Email"
                    {...register('teacher-email', {
                        required: {
                            value: true,
                            message: 'This field is required!',
                        },
                    })}
                />
                <ErrorMessage
                    className="text-red-500 text-ooolab_10px"
                    errors={errors}
                    name="teacher-email"
                    as="p"
                />
            </div>
            <div className="col-span-1"></div>
            <div className="col-span-1 text-ooolab_xs">
                <label
                    htmlFor="teacher-first-name"
                    className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                >
                    First Name <span className="text-red-500">*</span>
                </label>
                <input
                    className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_2 p-ooolab_p_2 rounded font-normal"
                    type="text"
                    id="teacher-first-name"
                    placeholder="First Name"
                />
            </div>
            <div className="col-span-1 text-ooolab_xs">
                <label
                    htmlFor="teacher-last-name"
                    className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                >
                    Last Name
                </label>
                <input
                    className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_2 p-ooolab_p_2 rounded font-normal"
                    type="text"
                    id="teacher-last-name"
                    placeholder="Last Name"
                />
            </div>
            <div className="col-span-2 text-ooolab_xs">
                <label
                    htmlFor="teacher-teachers"
                    className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                >
                    Groups <span className="text-red-500">*</span>
                </label>
                <Select
                    placeholder="Groups"
                    className="lg:w-full md:w-3/4 w-1/2 text-ooolab_dark_2 rounded font-normal"
                    styles={customSelectStyle}
                />
            </div>
            <div className="col-span-1 text-ooolab_xs">
                <label
                    htmlFor="teacher-phone"
                    className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                >
                    Date of Birth
                </label>
                <div className="w-full h-ooolab_h_8 relative">
                    <DatePickerInput
                        control={control}
                        name="teacher_dob"
                        placeholderText="Date of Birth"
                    />
                </div>
            </div>
            <div className="col-span-1 text-ooolab_xs">
                <label
                    htmlFor="teacher-phone"
                    className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                >
                    Phone
                </label>
                <input
                    className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_2 p-ooolab_p_2 rounded font-normal"
                    type="text"
                    id="teacher-phone"
                    placeholder="Phone"
                />
            </div>
            <div className="col-span-2 flex justify-center items-center pt-ooolab_p_3">
                <button className="bg-ooolab_dark_300 text-white px-ooolab_p_2 py-ooolab_p_1_e rounded text-ooolab_xs font-semibold leading-ooolab_24px">
                    Add Teacher
                </button>
            </div>
        </form>
    );
};

export default CreateTeacherFrom;
