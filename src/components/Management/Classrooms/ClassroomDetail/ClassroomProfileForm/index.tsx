import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import WorkspaceAvatar from 'assets/logo512.png';

const customSelectStyle: StylesConfig<any, true> = {
    clearIndicator: (base) => ({ ...base, display: 'none' }),
    indicatorSeparator: (base) => ({ ...base, display: 'none' }),
    control: (base) => ({
        ...base,
        borderColor: '#e6e6e6',
    }),
};

const GroupProfile = () => {
    const {
        register,
        formState: { errors },
    } = useForm();

    return (
        <form className="px-ooolab_p_5">
            <div className="border-b border-ooolab_bar_color px-ooolab_p_5 py-ooolab_p_5 flex items-center justify-between">
                <div className="relative overflow-hidden w-ooolab_w_25 h-ooolab_h_25 rounded-full border border-ooolab_bar_color group hover:border-black">
                    <img
                        className="w-full h-full z-1 absolute left-0"
                        src={WorkspaceAvatar}
                        alt="group-avatar"
                    />
                    <button
                        type="button"
                        className="z-30 w-ooolab_w_25 h-ooolab_h_25 bg-ooolab_dark_50 bg-opacity-60 rounded-full border-ooolab_bar_color -left-full absolute group-hover:left-0"
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
            <div className="p-ooolab_p_5 grid grid-cols-3 gap-x-ooolab_w_8 gap-y-ooolab_w_5">
                <div className="col-span-1 text-ooolab_xs">
                    <label
                        htmlFor="group-name"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Classroom Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                        type="text"
                        id="group-name"
                        placeholder="Group Name"
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
                        name="group-name"
                        as="p"
                    />
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-1 text-ooolab_xs">
                    <label
                        htmlFor="classroom-group"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Group
                    </label>
                    <Select
                        className="lg:w-1/2 md:w-3/4 w-1/2  text-ooolab_dark_1 rounded font-normal"
                        id="classroom-group"
                        placeholder="Group Name"
                        {...register('classroom-group')}
                        styles={customSelectStyle}
                    />
                </div>
                <div className="col-span-1 text-ooolab_xs">
                    <label
                        htmlFor="size"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Occupancy Size
                    </label>
                    <Select
                        className="lg:w-1/2 md:w-3/4 w-1/2  text-ooolab_dark_1 rounded font-normal"
                        id="size"
                        placeholder="Occupancy Size"
                        {...register('size')}
                        styles={customSelectStyle}
                    />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-2 text-ooolab_xs">
                    <label
                        htmlFor="description"
                        className="text-ooolab_dark_1 font-semibold leading-ooolab_24px block"
                    >
                        Description
                    </label>
                    <input
                        className="border lg:w-full md:w-3/4 w-1/2 border-ooolab_bar_color text-ooolab_dark_1 p-ooolab_p_2 rounded font-normal"
                        type="text"
                        id="description"
                        placeholder="Description"
                        {...register('description')}
                    />
                </div>
            </div>
        </form>
    );
};

export default GroupProfile;
