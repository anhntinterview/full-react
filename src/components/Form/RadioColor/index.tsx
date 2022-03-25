import { CheckIcon } from '@heroicons/react/outline';
import { FC } from 'react';
import './style.css';

interface RadioColorProps {
    color: string;
    onClick?: (e: string) => void;
    inputName: string;
}

const RadioColor: FC<RadioColorProps> = ({ color, onClick, inputName }) => {
    return (
        <>
            <input
                name={inputName}
                className="w-0 h-0 opacity-0"
                type="radio"
                id={`${inputName}-${color}`}
                value={color}
            />
            <label
                style={{ backgroundColor: color }}
                className=" border-white mr-ooolab_m_1 w-ooolab_w_4 h-ooolab_h_4 overflow-hidden rounded-full cursor-pointer flex justify-center items-center"
                htmlFor={`${inputName}-${color}`}
                onClick={() => {
                    if (onClick) {
                        onClick(color);
                    }
                }}
            >
                <span className="hidden">Color</span>
                <CheckIcon className="w-ooolab_w_5 h-ooolab_h_5 rounded-full text-white border-none" />
            </label>
        </>
    );
};

export default RadioColor;
