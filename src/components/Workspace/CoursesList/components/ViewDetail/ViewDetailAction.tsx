import {
    EyeIcon,
    PencilAltIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import React, { FC } from 'react';
import { StatusType } from 'types/ApiData.type';
import { CopyIcon, InviteIcon, ShareIcon } from '../../../../../assets/icon';

const RenderButton = ({
    icon,
    onclick,
}: {
    icon: React.ReactNode;
    onclick?: () => void;
}) => {
    return (
        <button
            onClick={() => {
                if (onclick) onclick();
            }}
            className="w-ooolab_w_8 h-ooolab_h_8 mr-ooolab_m_1 p-ooolab_p_2 hover:bg-ooolab_light_blue_0 hover:text-ooolab_blue_7 active:bg-ooolab_blue_1 active:text-white focus:outline-none rounded-full group"
        >
            {icon}
        </button>
    );
};

type ViewDetailActionProps = {
    deleteActions: Function;
    editActions: Function;
    status: StatusType;
    canRemove: boolean;
};

const ViewDetailActions: FC<ViewDetailActionProps> = (props) => {
    const { deleteActions, editActions, status, canRemove } = props;

    return (
        <div className="flex text-ooolab_dark_2">
            {/*<RenderButton
                icon={<EyeIcon className="w-ooolab_w_4 h-ooolab_h_4" />}
            /><RenderButton
                icon={<PencilAltIcon className="w-ooolab_w_4 h-ooolab_h_4 " />}
            />
            
            <RenderButton icon={<CopyIcon />} />
            <RenderButton icon={<InviteIcon />} />
            <RenderButton icon={<ShareIcon />} /> */}
            {status === 'draft' ? (
                <RenderButton
                    onclick={() => editActions()}
                    icon={<PencilIcon className="w-ooolab_w_4 h-ooolab_h_4 " />}
                />
            ) : (
                <RenderButton
                    onclick={() => editActions()}
                    icon={<EyeIcon className="w-ooolab_w_4 h-ooolab_h_4" />}
                />
            )}
            {(canRemove && (
                <RenderButton
                    onclick={() => deleteActions()}
                    icon={<TrashIcon className="w-ooolab_w_4 h-ooolab_h_4 " />}
                />
            )) ||
                null}
        </div>
    );
};

export default ViewDetailActions;
