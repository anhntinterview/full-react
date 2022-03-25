import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import WorkspaceAvatar from 'assets/logo512.png';
import DatePickerInput from 'components/Management/components/Form/DatePicker';

const customSelectStyle: StylesConfig<any, true> = {
    clearIndicator: (base) => ({ ...base, display: 'none' }),
    indicatorSeparator: (base) => ({ ...base, display: 'none' }),
    control: (base) => ({
        ...base,
        borderColor: '#e6e6e6',
    }),
};

const TeacherProfile = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useForm();

    return (
        <form className="px-ooolab_p_5">
            <div className="border-b border-ooolab_bar_color px-ooolab_p_5 py-ooolab_p_5 flex items-center justify-between">
                <div className="relative overflow-hidden w-ooolab_w_25 h-ooolab_h_25 rounded-full border border-ooolab_bar_color teacher hover:border-black">
                    <img
                        className="w-full h-full z-1 absolute left-0"
                        src={WorkspaceAvatar}
                        alt="teacher-avatar"
                    />
                    <button
                        type="button"
                        className="z-30 w-ooolab_w_25 h-ooolab_h_25 bg-ooolab_dark_50 bg-opacity-60 rounded-full border-ooolab_bar_color -left-full absolute teacher-hover:left-0"
                    >
                        <span className="text-ooolab_10px bg-ooolab_light_100 p-ooolab_p_1">
                            Change Avatar
                        </span>
                    </button>
                </div>

                <div className="flex items-center text-ooolab_xs font-semibold">
                    <button
                        type="submit"
                        className="mr-ooolab_m_3 px-ooolab_p_2 py-ooolab_p_1_e bg-ooolab_dark_300 text-white rounded"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="px-ooolab_p_2 py-ooolab_p_1_e border-none shadow-ooolab_box_shadow_container rounded"
                    >
                        Deactivate
                    </button>
                </div>
            </div>
            <div className="p-ooolab_p_5 grid grid-cols-7 gap-x-ooolab_w_8 gap-y-ooolab_w_5">
                <div className="col-span-2 text-ooolab_xs">
                    <label
                        htmlFor="teacher-name"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        First Name
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                        type="text"
                        id="teacher-name"
                        placeholder="First Name"
                        {...register('name', {
                            required: {
                                value: true,
                                message: 'This field is required!',
                            },
                        })}
                    />
                    <ErrorMessage
                        className="text-red-500 text-ooolab_10px"
                        errors={errors}
                        name="teacher-name"
                        as="p"
                    />
                </div>
                <div className="col-span-2 text-ooolab_xs">
                    <label
                        htmlFor="teacher-name"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Last Name
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                        type="text"
                        id="teacher-name"
                        placeholder="Last Name"
                        {...register('name', {
                            required: {
                                value: true,
                                message: 'This field is required!',
                            },
                        })}
                    />
                    <ErrorMessage
                        className="text-red-500 text-ooolab_10px"
                        errors={errors}
                        name="teacher-name"
                        as="p"
                    />
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-2 text-ooolab_xs">
                    <label
                        htmlFor="teacher-name"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Email
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                        type="email"
                        id="teacher-name"
                        placeholder="Email"
                        {...register('name', {
                            required: {
                                value: true,
                                message: 'This field is required!',
                            },
                        })}
                    />
                    <ErrorMessage
                        className="text-red-500 text-ooolab_10px"
                        errors={errors}
                        name="teacher-name"
                        as="p"
                    />
                </div>
                <div className="col-span-2 text-ooolab_xs">
                    <label
                        htmlFor="teacher-name"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Phone
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                        type="text"
                        id="teacher-name"
                        placeholder="Phone"
                        {...register('name', {
                            required: {
                                value: true,
                                message: 'This field is required!',
                            },
                        })}
                    />
                    <ErrorMessage
                        className="text-red-500 text-ooolab_10px"
                        errors={errors}
                        name="teacher-name"
                        as="p"
                    />
                </div>
                <div className="col-span-3"></div>
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
                <div className="col-span-5"></div>
                <div className="col-span-4 text-ooolab_xs">
                    <label
                        htmlFor="teacher-teachers"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block "
                    >
                        Groups <span className="text-red-500">*</span>
                    </label>
                    <Select
                        placeholder="Groups"
                        className="lg:w-full md:w-3/4 w-1/2 text-ooolab_dark_2 rounded font-normal"
                        styles={customSelectStyle}
                    />
                </div>
                <div className="col-span-4 text-ooolab_xs">
                    <label
                        htmlFor="teacher-first-name"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Address
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_2 p-ooolab_p_2 rounded font-normal"
                        type="text"
                        id="teacher-first-name"
                        placeholder="Address"
                    />
                </div>
                <div className="col-span-3"></div>
                <div className="col-span-1 text-ooolab_xs">
                    <label
                        htmlFor="teacher-teachers"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Create Date
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_2 p-ooolab_p_2 rounded font-normal"
                        type="text"
                        id="teacher-first-name"
                        placeholder="Create Date"
                    />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-1 text-ooolab_xs">
                    <label
                        htmlFor="teacher-teachers"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Status
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_2 p-ooolab_p_2 rounded font-normal"
                        type="text"
                        id="teacher-first-name"
                        placeholder="Status"
                    />
                </div>
            </div>
        </form>
    );
};

export default TeacherProfile;
