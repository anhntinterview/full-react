/*eslint no-unused-vars: ["error", { "args": "none" }]*/
import * as React from 'react';
import { debounce } from 'lodash';

export interface CustomInputProps {
    asyncFunction: (inputCode: string) => void;
    classNameText: string;
    type: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
    asyncFunction,
    classNameText,
    type,
}) => {
    const [keyword, setKeyword] = React.useState<string>('');

    const debounceInput = React.useCallback(
        debounce((nextValue: string) => {
            asyncFunction(nextValue);
        }, 1000),
        []
    );

    function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;
        setKeyword(value);
        debounceInput(value);
    }

    return (
        <>
            <input
                className={classNameText}
                type={type}
                value={keyword}
                onChange={handleInputOnChange}
            />
        </>
    );
};

export default CustomInput;
