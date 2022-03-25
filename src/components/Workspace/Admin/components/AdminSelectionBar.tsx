import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const Close = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
            className="group-hover:fill-ooolab_bg_bar"
            d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7 5.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L8.41421 7L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L7 8.41421L1.70711 13.7071C1.31658 14.0976 0.683417 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.58579 7L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
            fill="#8F90A6"
        />
    </svg>
);

const AdminSelectionBar = ({
    items,
    onClose,
    onApprove,
    onDecline,
}: {
    items: any[];
    onClose: () => void;
    onApprove: () => void;
    onDecline: () => void;
}) => {
    const { t: translator } = useTranslation();

    const data = useMemo(() => items.map((i: any) => i.title), [items]);
    return (
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
                <div
                    onClick={onClose}
                    className="flex w-ooolab_w_6 h-ooolab_h_6 justify-center items-center cursor-pointer group"
                >
                    <Close />
                </div>
                <div className="text-ooolab_gray_5 text-ooolab_xl ml-1">
                    {data.length === 1 && <span>{`${data[0]} `}</span>}
                    <span className="text-ooolab_text_bar_inactive text-ooolab_base">
                        {`${
                            data.length > 1 ? `${data.length} items ` : ''
                        }${translator('DASHBOARD.ADMIN_APPROVAL.IS_SELECTED')}`}
                    </span>
                </div>
            </div>
            <div className="flex">
                <div
                    onClick={onDecline}
                    className="cursor-pointer bg-ooolab_blue_1 text-white px-3 py-1.5 shadow-ooolab_box_shadow_container text-ooolab_sm rounded-header_menu"
                >
                    {translator('DASHBOARD.ADMIN_APPROVAL.DECLINE')}
                </div>
                <div
                    onClick={onApprove}
                    className="ml-2 cursor-pointer bg-ooolab_blue_1 text-white px-3 py-1.5 shadow-ooolab_box_shadow_container text-ooolab_sm rounded-header_menu"
                >
                    {translator('DASHBOARD.ADMIN_APPROVAL.APPROVE')}
                </div>
            </div>
        </div>
    );
};

export default AdminSelectionBar;
