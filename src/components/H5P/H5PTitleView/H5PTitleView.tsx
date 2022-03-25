import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';

const H5PTitleView: React.FC<{}> = () => {
    return (
        <div>
            <div className="overflow-x-auto">
                <div className="py-ooolab_p_3 align-middle inline-block min-w-full px-ooolab_p_2 ">
                    <div className=" overflow-hidden">
                        <div className="grid gap-2 grid-cols-10 mb-ooolab_m_3">
                            <div className="col-span-4 font-medium text-ooolab_gray_10  flex items-center">
                                <p className="text-ooolab_1xs">Name</p>
                                <ChevronDownIcon className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer ml-ooolab_m_1" />
                            </div>
                            <div className="col-span-2 text-center font-medium text-ooolab_gray_10">
                                <p className="text-ooolab_1sx"> Tag</p>
                            </div>
                            <div className="col-span-2 justify-center font-medium text-ooolab_gray_10  flex items-center">
                                <p className="text-ooolab_1sx">Last modified</p>
                                <ChevronDownIcon className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer ml-ooolab_m_1" />
                            </div>
                            <div className="col-span-2 text-center font-medium text-ooolab_gray_10">
                                <p className="text-ooolab_1sx">Content type</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default H5PTitleView;
