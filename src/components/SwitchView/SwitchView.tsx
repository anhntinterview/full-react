import { FC } from 'react';
import { Switch } from '@headlessui/react';

interface SwitchViewProps {
    isGrid: boolean;
    onChange: (p: boolean) => void;
    textLeft: string;
    textRight: string;
}

const SwitchView: FC<SwitchViewProps> = ({
    isGrid,
    onChange,
    textLeft,
    textRight,
}) => {
    return (
        <div className="flex items-center w-full">
            <p
                className={`${
                    (!isGrid && 'text-ooolab_blue_1') || 'text-ooolab_dark_1'
                }`}
            >
                {textLeft}
            </p>
            <Switch
                checked={isGrid}
                onChange={onChange}
                style={{
                    boxShadow: 'inset 0px 0.5px 4px rgba(96, 97, 112, 0.2)',
                }}
                className={`${
                    !isGrid ? 'bg-ooolab_bg_bar' : 'bg-ooolab_blue_1'
                } relative mx-ooolab_m_2 py-2 flex items-center h-ooolab_h_8 w-ooolab_w_15 shadow-ooolab_box_shadow_container rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
                <span
                    style={{
                        boxShadow:
                            '0px 0px 2px rgba(40, 41, 61, 0.04), 0px 4px 8px rgba(96, 97, 112, 0.16)',
                    }}
                    className={`${
                        !isGrid
                            ? 'left-ooolab_inset_10'
                            : 'right-ooolab_inset_10'
                    } absolute inline-block w-ooolab_w_5 h-ooolab_h_5 transform bg-white rounded-full`}
                />
            </Switch>
            <p
                className={`${
                    (isGrid && 'text-ooolab_blue_1') || 'text-ooolab_dark_1'
                }`}
            >
                {textRight}
            </p>
        </div>
    );
};

export default SwitchView;
