import { useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline';

import { useTranslation } from 'react-i18next';

interface AdminMenuBarProps {
    onSubmit: (content: string) => void;
}

const AdminMenuBar: React.FC<AdminMenuBarProps> = ({ onSubmit, children }) => {
    const { t: translator } = useTranslation();
    const [inputValue, setInputValue] = useState<string>();

    const onChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="flex justify-between w-full">
            <div className="flex items-center">
                <div className=''> {children}</div>

                {/* <p className="text-xl">{translator('ADMIN')}</p> */}
                <div
                    style={{ width: 2 }}
                    className="bg-ooolab_gray_10 h-8 mr-ooolab_m_1"
                />
                <div className="relative">
                    <input
                        className={`  border-2 border-ooolab_border_logout rounded-sub_tab pl-ooolab_p_3 overflow-hidden ease-linear transition-transform duration-500 w-full h-ooolab_h_10 focus:outline-none pr-ooolab_p_9`}
                        type="text"
                        placeholder={translator('SEARCH')}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                onSubmit(e.target.value);
                            }
                        }}
                        onChange={(e) => onChange(e)}
                    />
                    <SearchIcon
                        className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 absolute cursor-pointer top-ooolab_inset_22 right-ooolab_inset_5"
                        onClick={() => onSubmit(inputValue)}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminMenuBar;
