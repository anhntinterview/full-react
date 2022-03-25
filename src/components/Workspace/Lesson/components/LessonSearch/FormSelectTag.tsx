import React from 'react';
import { useForm } from 'react-hook-form';

const FormSelectTag = () => {
    return (
        <form className="mt-ooolab_m_5">
            <div className="flex mb-ooolab_m_5 items-center">
                <input
                    className="w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_3 border-ooolab_dark_1 rounded-header_menu"
                    type="checkbox"
                    name="tag1"
                    id=""
                />
                <label htmlFor="tag1" className="text-ooolab_xs">
                    Onboarding
                </label>
            </div>
            <div className="flex mb-ooolab_m_5 items-center">
                <input
                    className="w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_3 border-ooolab_dark_1 rounded-header_menu"
                    type="checkbox"
                    name="tag1"
                    id=""
                />
                <label htmlFor="tag1" className="text-ooolab_xs">
                    Onboarding
                </label>
            </div>
            <div className="flex mb-ooolab_m_5 items-center">
                <input
                    className="w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_3 border-ooolab_dark_1 rounded-header_menu"
                    type="checkbox"
                    name="tag1"
                    id=""
                />
                <label htmlFor="tag1" className="text-ooolab_xs">
                    Onboarding
                </label>
            </div>
        </form>
    );
};

export default FormSelectTag;
