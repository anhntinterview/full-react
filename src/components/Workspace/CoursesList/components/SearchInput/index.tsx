import { SearchIcon } from '@heroicons/react/outline';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
    onSubmit: (e: string) => void;
    defaultValue?: string;
}

const SearchInput: FC<SearchInputProps> = ({ onSubmit, defaultValue }) => {
    const [open, setOpen] = useState(true);
    const { t: translator } = useTranslation();

    const [inputValue, setInputValue] = useState<string>();

    const onChange = (e) => {
        setInputValue(e.target.value);
    };
    return (
        <div className="relative w-ooolab_w_64">
            <input
                defaultValue={defaultValue || ''}
                className={`${
                    !open
                        ? 'w-ooolab_w_8 border-none h-ooolab_h_8'
                        : 'w-full border-2 border-ooolab_border_logout rounded-sub_tab pl-ooolab_p_3'
                } overflow-hidden ease-linear transition-transform duration-500 w-full h-ooolab_h_10 focus:outline-none pr-ooolab_p_9`}
                type="text"
                placeholder={translator('SEARCH')}
                // onBlur={() => setOpen(false)}
                onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                        onSubmit(e.target.value);
                    }
                }}
                onChange={(e) => onChange(e)}
            />
            <SearchIcon
                onClick={() => onSubmit(inputValue)}
                style={{ top: 10, right: 10 }}
                className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 absolute cursor-pointer"
            />
        </div>
    );
};

export default SearchInput;
