import { ReactNode } from 'react';
import Plus from 'assets/SVG/Plus.svg';
import File from 'assets/SVG/File.svg';
import Folder from 'assets/SVG/Folder.svg';
import H5PUpload from 'assets/SVG/H5PUpload.svg';
import Invite from 'assets/SVG/Invite.svg';
import Logout from 'assets/SVG/logout.svg';
import { Menu } from '@headlessui/react';
import WorkspaceMenu from 'components/MasterPage/LeftNavigation/WorkspaceMenu/WorkspaceMenu';

export interface IBarItem {
    readonly type: BarType;
    readonly title: string;
    readonly activeIcon: ReactNode;
    readonly inactiveIcon: ReactNode;
    readonly subTabs: { title: string; url: string }[];
}

export interface NewIBarItem {
    readonly type: NewBarType;
    readonly title: string;
    readonly icon: ReactNode;
    readonly tab: { name: string; current: string; subtabs: [] };
}

export interface IMenu {
    readonly title: string;
    readonly icon: any;
    readonly widthHeightClass: string;
}

interface IconProps {
    readonly active: boolean;
}

const DashboardIcon = ({ active }: IconProps) => (
    <svg className="w-ooolab_w_4 h-ooolab_h_4" viewBox="0 0 16 16" fill="none">
        <path
            d="M0.5 2.16667C0.5 1.24619 1.24619 0.5 2.16667 0.5H5.5C6.42047 0.5 7.16667 1.24619 7.16667 2.16667V5.5C7.16667 6.42047 6.42047 7.16667 5.5 7.16667H2.16667C1.24619 7.16667 0.5 6.42047 0.5 5.5V2.16667ZM5.5 2.16667H2.16667V5.5H5.5V2.16667ZM8.83333 2.16667C8.83333 1.24619 9.57953 0.5 10.5 0.5H13.8333C14.7538 0.5 15.5 1.24619 15.5 2.16667V5.5C15.5 6.42047 14.7538 7.16667 13.8333 7.16667H10.5C9.57953 7.16667 8.83333 6.42047 8.83333 5.5V2.16667ZM13.8333 2.16667H10.5V5.5H13.8333V2.16667ZM0.5 10.5C0.5 9.57953 1.24619 8.83333 2.16667 8.83333H5.5C6.42047 8.83333 7.16667 9.57953 7.16667 10.5V13.8333C7.16667 14.7538 6.42047 15.5 5.5 15.5H2.16667C1.24619 15.5 0.5 14.7538 0.5 13.8333V10.5ZM5.5 10.5H2.16667V13.8333H5.5V10.5ZM8.83333 10.5C8.83333 9.57953 9.57953 8.83333 10.5 8.83333H13.8333C14.7538 8.83333 15.5 9.57953 15.5 10.5V13.8333C15.5 14.7538 14.7538 15.5 13.8333 15.5H10.5C9.57953 15.5 8.83333 14.7538 8.83333 13.8333V10.5ZM13.8333 10.5H10.5V13.8333H13.8333V10.5Z"
            fill={active ? 'white' : '#8F90A6'}
            className="group-hover:fill-item_bar_hover transition-fill duration-300"
        />
    </svg>
);

export const LibraryIcon = ({ active }: IconProps) => (
    <svg
        className="w-ooolab_w_4_e h-ooolab_h_3_e"
        viewBox="0 0 18 14"
        fill="none"
    >
        <path
            d="M2.33341 2.52791C2.44996 2.4808 2.59008 2.42876 2.75248 2.37627C3.32686 2.19061 4.17759 2 5.25008 2C6.32257 2 7.17331 2.19061 7.74768 2.37627C7.91008 2.42876 8.0502 2.4808 8.16675 2.52791V11.5941C7.4574 11.3738 6.46688 11.1667 5.25008 11.1667C4.03328 11.1667 3.04276 11.3738 2.33341 11.5941V2.52791ZM9.00008 1.07106C8.81198 0.987657 8.56386 0.888515 8.26029 0.790393C7.54561 0.559384 6.52134 0.333332 5.25008 0.333332C3.97882 0.333332 2.95456 0.559384 2.23987 0.790393C1.88255 0.90589 1.60204 1.0228 1.40582 1.1138C1.30767 1.15932 1.23046 1.19843 1.1751 1.22774C1.14741 1.2424 1.12518 1.25463 1.1085 1.26399L1.08767 1.27584L1.0804 1.28006L1.07756 1.28172L1.07634 1.28244C1.0747 1.28341 0.871001 1.40412 1.07525 1.28309C0.822025 1.43315 0.666748 1.70566 0.666748 2V12.8333C0.666748 13.1327 0.827375 13.4091 1.08752 13.5574C1.3475 13.7055 1.66692 13.7029 1.92442 13.5505C1.92215 13.5518 1.92072 13.5527 1.92072 13.5527L1.92182 13.5521L1.92312 13.5513L1.92442 13.5505C1.92949 13.5477 1.93973 13.5421 1.95507 13.534C1.98577 13.5177 2.03673 13.4917 2.10703 13.4591C2.24773 13.3939 2.46527 13.3024 2.75248 13.2096C3.32686 13.0239 4.17759 12.8333 5.25008 12.8333C6.32257 12.8333 7.17331 13.0239 7.74768 13.2096C8.0349 13.3024 8.25243 13.3939 8.39313 13.4591C8.46343 13.4917 8.51439 13.5177 8.54509 13.534C8.56044 13.5421 8.5707 13.5478 8.57577 13.5506C8.57806 13.5519 8.57944 13.5527 8.57944 13.5527M8.57944 13.5527L8.57834 13.5521L8.57704 13.5513L8.57577 13.5506C8.83739 13.7052 9.16288 13.7053 9.42442 13.5505C9.42949 13.5477 9.43973 13.5421 9.45507 13.534C9.48577 13.5177 9.53673 13.4917 9.60703 13.4591C9.74773 13.3939 9.96527 13.3024 10.2525 13.2096C10.8269 13.0239 11.6776 12.8333 12.7501 12.8333C13.8226 12.8333 14.6733 13.0239 15.2477 13.2096C15.5349 13.3024 15.7524 13.3939 15.8931 13.4591C15.9634 13.4917 16.0144 13.5177 16.0451 13.534C16.0604 13.5421 16.0707 13.5478 16.0758 13.5506L16.0767 13.5511C16.334 13.7029 16.653 13.7053 16.9126 13.5574C17.1728 13.4091 17.3334 13.1327 17.3334 12.8333V2C17.3334 1.70566 17.1781 1.43315 16.9249 1.28309L16.9238 1.28244L16.9226 1.28172L16.9198 1.28006L16.9125 1.27584L16.8917 1.26399C16.875 1.25463 16.8528 1.2424 16.8251 1.22774C16.7697 1.19843 16.6925 1.15932 16.5943 1.1138C16.3981 1.0228 16.1176 0.90589 15.7603 0.790393C15.0456 0.559384 14.0213 0.333332 12.7501 0.333332C11.4788 0.333332 10.4546 0.559384 9.73987 0.790393C9.43631 0.888515 9.18819 0.987657 9.00008 1.07106M15.6667 2.52791V11.5941C14.9574 11.3738 13.9669 11.1667 12.7501 11.1667C11.5333 11.1667 10.5428 11.3738 9.83342 11.5941V2.52791C9.94997 2.4808 10.0901 2.42876 10.2525 2.37627C10.8269 2.19061 11.6776 2 12.7501 2C13.8226 2 14.6733 2.19061 15.2477 2.37627C15.4101 2.42876 15.5502 2.4808 15.6667 2.52791ZM16.0758 2.71729C16.078 2.71857 16.0794 2.71937 16.0794 2.71937L16.0783 2.71873L16.0758 2.71729ZM16.0758 13.5506L16.0785 13.5522L16.0767 13.5511"
            fill={active ? 'white' : '#8F90A6'}
            className="group-hover:fill-item_bar_hover transition-fill duration-300"
        />
    </svg>
);

const UploadIcon = ({ active }: IconProps) => (
    <svg
        className="w-ooolab_w_4_e h-ooolab_h_3_e"
        viewBox="0 0 18 14"
        fill="none"
    >
        <path
            d="M3.1665 5.33337C3.1665 2.57195 5.40508 0.333374 8.1665 0.333374C10.3557 0.333374 12.2149 1.73958 12.8926 3.69765C15.3907 3.97575 17.3332 6.09438 17.3332 8.66671C17.3332 11.4281 15.0946 13.6667 12.3332 13.6667H4.83317C2.53198 13.6667 0.666504 11.8012 0.666504 9.50004C0.666504 7.78635 1.70044 6.31562 3.17805 5.67533C3.17039 5.56225 3.1665 5.44822 3.1665 5.33337ZM8.1665 2.00004C6.32556 2.00004 4.83317 3.49242 4.83317 5.33337C4.83317 5.58577 4.86107 5.83065 4.91364 6.06547C5.01414 6.51445 4.73176 6.95993 4.28282 7.06063C3.16663 7.311 2.33317 8.30918 2.33317 9.50004C2.33317 10.8808 3.45246 12 4.83317 12H12.3332C14.1741 12 15.6665 10.5077 15.6665 8.66671C15.6665 6.82576 14.1741 5.33337 12.3332 5.33337C12.3108 5.33337 12.2886 5.33359 12.2663 5.33403C11.8638 5.34191 11.5133 5.06098 11.4333 4.66647C11.1248 3.145 9.77841 2.00004 8.1665 2.00004Z"
            fill={active ? 'white' : '#8F90A6'}
            className="group-hover:fill-item_bar_hover transition-fill duration-300"
        />
    </svg>
);

const AnalyticIcon = ({ active }: IconProps) => (
    <svg
        className="w-ooolab_w_2_e h-ooolab_h_3_e"
        viewBox="0 0 10 14"
        fill="none"
    >
        <path
            d="M5 0.333374C5.46024 0.333374 5.83333 0.70647 5.83333 1.16671V12.8334C5.83333 13.2936 5.46024 13.6667 5 13.6667C4.53976 13.6667 4.16667 13.2936 4.16667 12.8334V1.16671C4.16667 0.70647 4.53976 0.333374 5 0.333374ZM9.16667 3.66671C9.6269 3.66671 10 4.0398 10 4.50004V12.8334C10 13.2936 9.6269 13.6667 9.16667 13.6667C8.70643 13.6667 8.33333 13.2936 8.33333 12.8334V4.50004C8.33333 4.0398 8.70643 3.66671 9.16667 3.66671ZM0.833333 7.00004C1.29357 7.00004 1.66667 7.37314 1.66667 7.83337V12.8334C1.66667 13.2936 1.29357 13.6667 0.833333 13.6667C0.373096 13.6667 0 13.2936 0 12.8334V7.83337C0 7.37314 0.373096 7.00004 0.833333 7.00004Z"
            fill={active ? 'white' : '#8F90A6'}
            className="group-hover:fill-item_bar_hover transition-fill duration-300"
        />
    </svg>
);

const ManageIcon = ({ active }: IconProps) => (
    <svg
        className="w-ooolab_w_4_e h-ooolab_h_4_e"
        viewBox="0 0 18 18"
        fill="none"
    >
        <path
            d="M7.33317 2.33329C5.49222 2.33329 3.99984 3.82568 3.99984 5.66663C3.99984 7.50758 5.49222 8.99996 7.33317 8.99996C9.17412 8.99996 10.6665 7.50758 10.6665 5.66663C10.6665 3.82568 9.17412 2.33329 7.33317 2.33329ZM2.33317 5.66663C2.33317 2.9052 4.57175 0.666626 7.33317 0.666626C10.0946 0.666626 12.3332 2.9052 12.3332 5.66663C12.3332 8.42805 10.0946 10.6666 7.33317 10.6666C4.57175 10.6666 2.33317 8.42805 2.33317 5.66663ZM13.0235 2.13109C13.349 1.80566 13.8766 1.80566 14.202 2.13109C16.1547 4.08371 16.1547 7.24954 14.202 9.20216C13.8766 9.5276 13.349 9.5276 13.0235 9.20216C12.6981 8.87672 12.6981 8.34909 13.0235 8.02365C14.3253 6.7219 14.3253 4.61135 13.0235 3.3096C12.6981 2.98417 12.6981 2.45653 13.0235 2.13109ZM13.6081 12.9645C13.7197 12.518 14.1721 12.2466 14.6186 12.3582C15.7252 12.6348 16.4257 13.3424 16.8285 14.1481C17.2183 14.9277 17.3332 15.7976 17.3332 16.5C17.3332 16.9602 16.9601 17.3333 16.4998 17.3333C16.0396 17.3333 15.6665 16.9602 15.6665 16.5C15.6665 15.9524 15.573 15.3638 15.3378 14.8935C15.1157 14.4492 14.7745 14.1151 14.2144 13.9751C13.7679 13.8635 13.4964 13.411 13.6081 12.9645ZM4.4165 14C3.36696 14 2.33317 15.0112 2.33317 16.5C2.33317 16.9602 1.96007 17.3333 1.49984 17.3333C1.0396 17.3333 0.666504 16.9602 0.666504 16.5C0.666504 14.3068 2.24439 12.3333 4.4165 12.3333H10.2498C12.422 12.3333 13.9998 14.3068 13.9998 16.5C13.9998 16.9602 13.6267 17.3333 13.1665 17.3333C12.7063 17.3333 12.3332 16.9602 12.3332 16.5C12.3332 15.0112 11.2994 14 10.2498 14H4.4165Z"
            fill={active ? 'white' : '#8F90A6'}
            className="group-hover:fill-item_bar_hover transition-fill duration-300"
        />
    </svg>
);

export const CreateBarMenu = (translator: Function): IMenu[] => {
    return [
        {
            title: translator('DASHBOARD.SIDEBAR.CREATE_COURSE'),
            icon: Plus,
            widthHeightClass: 'w-ooolab_w_2_i h-ooolab_h_2_i',
        },
        {
            title: translator('DASHBOARD.SIDEBAR.CREATE_LESSON'),
            icon: Plus,
            widthHeightClass: 'w-ooolab_w_2_i h-ooolab_h_2_i',
        },
        {
            title: translator('DASHBOARD.SIDEBAR.CREATE_H5P'),
            icon: Plus,
            widthHeightClass: 'w-ooolab_w_2_i h-ooolab_h_2_i',
        },
        {
            title: translator('DASHBOARD.SIDEBAR.CREATE_NEW_FOLDER'),
            icon: Plus,
            widthHeightClass: 'w-ooolab_w_2_i h-ooolab_h_2_i',
        },
    ];
};

export const UploadBarMenu = (translator: Function): IMenu[] => {
    return [
        {
            title: translator('DASHBOARD.SIDEBAR.UPLOAD_FILE'),
            icon: File,
            widthHeightClass: 'w-ooolab_w_2_i h-ooolab_h_3_i',
        },
        {
            title: translator('DASHBOARD.SIDEBAR.UPLOAD_FOLDER'),
            icon: Folder,
            widthHeightClass: 'w-ooolab_w_3_i h-ooolab_h_2_i',
        },
        {
            title: translator('DASHBOARD.SIDEBAR.UPLOAD_H5P'),
            icon: H5PUpload,
            widthHeightClass: 'w-ooolab_w_3_i h-ooolab_h_3_i',
        },
    ];
};

export const WorkspaceBarMenu = (
    translator: Function
): Array<IMenu | ReactNode> => {
    return [
        {
            title: translator('DASHBOARD.SIDEBAR.INVITE_MEMBERS'),
            icon: Invite,
            widthHeightClass: 'w-ooolab_w_3_i h-ooolab_h_3_i',
        },
        <Menu as="div">{({ open }) => <WorkspaceMenu open={open} />}</Menu>,
        {
            title: translator('DASHBOARD.SIDEBAR.NEW_WOKSPACE'),
            icon: Plus,
            widthHeightClass: 'w-ooolab_w_2_i h-ooolab_h_2_i',
        },
        {
            title: translator('DASHBOARD.SIDEBAR.LOG_OUT'),
            icon: Logout,
            widthHeightClass: 'w-ooolab_w_9px h-ooolab_h_2',
        },
    ];
};

export enum BarType {
    Dashboard,
    Library,
    Uploads,
    Analytics,
    Manage,
    LibraryH5P,
    UploadsShared,
    UploadsTrash,
    DashboardLesson,
}

export enum NewBarType {
    Dashboard,
    Calendar,
    Academics,
    Drive,
    Management,
    Report,
}

export function generateAppBars(
    workspaceId: string,
    isAdmin: boolean,
    translator: Function
): IBarItem[] {
    return [
        {
            title: 'Dashboard',
            activeIcon: <DashboardIcon active />,
            inactiveIcon: <DashboardIcon active={false} />,
            type: BarType.Dashboard,
            subTabs: [
                {
                    title: translator('HOME'),
                    url: `/workspace/${workspaceId}`,
                },
            ],
        },
        {
            title: translator('DASHBOARD.SIDEBAR.LIBRARY'),
            activeIcon: <LibraryIcon active />,
            inactiveIcon: <LibraryIcon active={false} />,
            type: BarType.Library,
            subTabs: [
                ...(isAdmin
                    ? [
                          {
                              title: 'Admin Approval',
                              url: `/workspace/${workspaceId}/admin`,
                          },
                      ]
                    : []),
                {
                    title: translator('DASHBOARD.SIDEBAR.COURSES'),
                    url: `/workspace/${workspaceId}/courses`,
                },
                {
                    title: translator('DASHBOARD.SIDEBAR.LESSONS'),
                    url: `/workspace/${workspaceId}/lesson`,
                },
                {
                    title: translator('DASHBOARD.H5P_CONTENTS.H5P_CONTENTS'),
                    url: `/workspace/${workspaceId}/h5p-content`,
                },
                {
                    title: translator('DASHBOARD.SIDEBAR.TRASH'),
                    url: `/workspace/${workspaceId}/trash`,
                },
            ],
        },
        {
            title: translator('DASHBOARD.SIDEBAR.UPLOADS'),
            activeIcon: <UploadIcon active />,
            inactiveIcon: <UploadIcon active={false} />,
            type: BarType.Uploads,
            subTabs: [
                {
                    title: translator('DASHBOARD.SIDEBAR.CONNECT_GOOGLE'),
                    url: `/workspace/${workspaceId}/connect-drive`,
                },
                {
                    title: translator('DASHBOARD.SIDEBAR.MY_DRIVE'),
                    url: `/workspace/${workspaceId}/my-drive`,
                },
                {
                    title: translator('DASHBOARD.SIDEBAR.SHARED_WITH_ME'),
                    url: `/workspace/${workspaceId}/shared-with-me`,
                },
                {
                    title: translator('DASHBOARD.SIDEBAR.WORKSPACE_DRIVE'),
                    url: `/workspace/${workspaceId}/workspace-drive`,
                },
            ],
        },
        {
            title: translator('DASHBOARD.SIDEBAR.ANALYTICS'),
            activeIcon: <AnalyticIcon active />,
            inactiveIcon: <AnalyticIcon active={false} />,
            type: BarType.Analytics,
            subTabs: [],
        },
        {
            title: translator('DASHBOARD.SIDEBAR.MANAGE'),
            activeIcon: <ManageIcon active />,
            inactiveIcon: <ManageIcon active={false} />,
            type: BarType.Manage,
            subTabs: [
                {
                    title: translator('DASHBOARD.SIDEBAR.ACCOUNT_SETTING'),
                    url: `/workspace/${workspaceId}/user-setting`,
                },
                {
                    title: translator('DASHBOARD.SIDEBAR.USERS'),
                    url: '#',
                },
                {
                    title: translator('DASHBOARD.SIDEBAR.CLASSES'),
                    url: '#',
                },
                {
                    title: translator('DASHBOARD.SIDEBAR.REPORTS'),
                    url: '#',
                },
            ],
        },
    ];
}

export const HiddenMenuIcon = () => (
    <svg
        className="w-ooolab_w_4 h-ooolab_h_3_e"
        viewBox="0 0 17 14"
        fill="none"
    >
        <path
            d="M16.4993 12.0006V13.6672H1.49935V12.0006H16.4993ZM4.49602 0.253906L5.67435 1.43224L3.02268 4.08391L5.67435 6.73557L4.49602 7.91391L0.666016 4.08391L4.49602 0.253906ZM16.4993 6.16724V7.83391H8.99935V6.16724H16.4993ZM16.4993 0.333906V2.00057H8.99935V0.333906H16.4993Z"
            fill="#2E3A59"
        />
    </svg>
);

const NewDashboardIcon = () => (
    <svg
        className="w-ooolab_w_3_i h-ooolab_h_3_i"
        viewBox="0 0 14 14"
        fill="none"
    >
        <path
            d="M3.49935 0.666016C3.87143 0.666016 4.23986 0.739302 4.58362 0.88169C4.92738 1.02408 5.23972 1.23278 5.50282 1.49588C5.76592 1.75898 5.97462 2.07132 6.11701 2.41508C6.2594 2.75884 6.33268 3.12727 6.33268 3.49935V6.33268H3.49935C2.7479 6.33268 2.02723 6.03417 1.49588 5.50282C0.964528 4.97147 0.666017 4.2508 0.666017 3.49935C0.666017 2.7479 0.964528 2.02723 1.49588 1.49588C2.02723 0.964527 2.7479 0.666016 3.49935 0.666016V0.666016ZM4.99935 4.99935V3.49935C4.99935 3.20268 4.91138 2.91267 4.74655 2.66599C4.58173 2.41932 4.34746 2.22706 4.07338 2.11353C3.79929 2 3.49769 1.97029 3.20671 2.02817C2.91574 2.08605 2.64847 2.22891 2.43869 2.43869C2.22891 2.64847 2.08605 2.91574 2.02817 3.20671C1.97029 3.49768 2 3.79929 2.11353 4.07337C2.22706 4.34746 2.41932 4.58173 2.66599 4.74655C2.91267 4.91138 3.20268 4.99935 3.49935 4.99935H4.99935ZM3.49935 7.66602H6.33268V10.4993C6.33268 11.0597 6.16651 11.6075 5.85518 12.0735C5.54385 12.5394 5.10134 12.9026 4.58362 13.117C4.0659 13.3315 3.49621 13.3876 2.94659 13.2782C2.39698 13.1689 1.89213 12.8991 1.49588 12.5028C1.09963 12.1066 0.829783 11.6017 0.720459 11.0521C0.611134 10.5025 0.667243 9.9328 0.881692 9.41508C1.09614 8.89736 1.4593 8.45485 1.92523 8.14352C2.39117 7.83219 2.93897 7.66602 3.49935 7.66602V7.66602ZM3.49935 8.99935C3.20268 8.99935 2.91267 9.08732 2.66599 9.25214C2.41932 9.41697 2.22706 9.65123 2.11353 9.92532C2 10.1994 1.97029 10.501 2.02817 10.792C2.08605 11.083 2.22891 11.3502 2.43869 11.56C2.64847 11.7698 2.91574 11.9126 3.20671 11.9705C3.49769 12.0284 3.79929 11.9987 4.07338 11.8852C4.34746 11.7716 4.58173 11.5794 4.74655 11.3327C4.91138 11.086 4.99935 10.796 4.99935 10.4993V8.99935H3.49935ZM10.4993 0.666016C11.2508 0.666016 11.9715 0.964527 12.5028 1.49588C13.0342 2.02723 13.3327 2.7479 13.3327 3.49935C13.3327 4.2508 13.0342 4.97147 12.5028 5.50282C11.9715 6.03417 11.2508 6.33268 10.4993 6.33268H7.66602V3.49935C7.66602 2.7479 7.96453 2.02723 8.49588 1.49588C9.02723 0.964527 9.7479 0.666016 10.4993 0.666016V0.666016ZM10.4993 4.99935C10.796 4.99935 11.086 4.91138 11.3327 4.74655C11.5794 4.58173 11.7716 4.34746 11.8852 4.07337C11.9987 3.79929 12.0284 3.49768 11.9705 3.20671C11.9126 2.91574 11.7698 2.64847 11.56 2.43869C11.3502 2.22891 11.083 2.08605 10.792 2.02817C10.501 1.97029 10.1994 2 9.92532 2.11353C9.65124 2.22706 9.41697 2.41932 9.25215 2.66599C9.08732 2.91267 8.99935 3.20268 8.99935 3.49935V4.99935H10.4993ZM7.66602 7.66602H10.4993C11.0597 7.66602 11.6075 7.83219 12.0735 8.14352C12.5394 8.45485 12.9026 8.89736 13.117 9.41508C13.3315 9.9328 13.3876 10.5025 13.2782 11.0521C13.1689 11.6017 12.8991 12.1066 12.5028 12.5028C12.1066 12.8991 11.6017 13.1689 11.0521 13.2782C10.5025 13.3876 9.9328 13.3315 9.41508 13.117C8.89736 12.9026 8.45485 12.5394 8.14352 12.0735C7.83219 11.6075 7.66602 11.0597 7.66602 10.4993V7.66602ZM8.99935 8.99935V10.4993C8.99935 10.796 9.08732 11.086 9.25215 11.3327C9.41697 11.5794 9.65124 11.7716 9.92532 11.8852C10.1994 11.9987 10.501 12.0284 10.792 11.9705C11.083 11.9126 11.3502 11.7698 11.56 11.56C11.7698 11.3502 11.9126 11.083 11.9705 10.792C12.0284 10.501 11.9987 10.1994 11.8852 9.92532C11.7716 9.65123 11.5794 9.41697 11.3327 9.25214C11.086 9.08732 10.796 8.99935 10.4993 8.99935H8.99935Z"
            fill="#8F90A6"
            className="group-hover:fill-ooolab_bg_dark"
        />
    </svg>
);

const NewCalendarIcon = () => (
    <svg
        className="w-ooolab_w_3_i h-ooolab_h_3_i"
        viewBox="0 0 14 14"
        fill="none"
    >
        <path
            d="M10.334 1.99935H13.0007C13.1775 1.99935 13.347 2.06959 13.4721 2.19461C13.5971 2.31964 13.6673 2.4892 13.6673 2.66602V13.3327C13.6673 13.5095 13.5971 13.6791 13.4721 13.8041C13.347 13.9291 13.1775 13.9993 13.0007 13.9993H1.00065C0.82384 13.9993 0.654271 13.9291 0.529246 13.8041C0.404222 13.6791 0.333984 13.5095 0.333984 13.3327V2.66602C0.333984 2.4892 0.404222 2.31964 0.529246 2.19461C0.654271 2.06959 0.82384 1.99935 1.00065 1.99935H3.66732V0.666016H5.00065V1.99935H9.00065V0.666016H10.334V1.99935ZM9.00065 3.33268H5.00065V4.66602H3.66732V3.33268H1.66732V5.99935H12.334V3.33268H10.334V4.66602H9.00065V3.33268ZM12.334 7.33268H1.66732V12.666H12.334V7.33268Z"
            fill="#8F90A6"
            className="group-hover:fill-ooolab_bg_dark"
        />
    </svg>
);

const NewAcademicsIcon = () => (
    <svg
        className="w-ooolab_w_3_i h-ooolab_h_3_i"
        viewBox="0 0 79 109"
        fill="none"
    >
        <path
            d="M56.7911 91.6862C53.5247 99.5091 47.3127 105.729 39.5 109C31.6873 105.729 25.4753 99.5091 22.2089 91.6862H33.3676C34.9773 94.1038 37.0559 96.1951 39.5 97.8315C41.9441 96.2 44.0228 94.1038 45.6373 91.6862H56.7911ZM69.125 66.0022L79 77.2151V86.7422H0V77.2151L9.875 66.0022V37.3024C9.875 20.0825 22.2385 5.42849 39.5 0C56.7615 5.42849 69.125 20.0825 69.125 37.3024V66.0022ZM65.5206 76.8542L59.25 69.7349V37.3024C59.25 25.8422 51.4981 15.4005 39.5 10.506C27.5019 15.4005 19.75 25.8373 19.75 37.3024V69.7349L13.4794 76.8542H65.5206ZM39.5 47.1903C36.881 47.1903 34.3692 46.1486 32.5173 44.2942C30.6654 42.4398 29.625 39.9248 29.625 37.3024C29.625 34.6799 30.6654 32.1649 32.5173 30.3105C34.3692 28.4562 36.881 27.4144 39.5 27.4144C42.119 27.4144 44.6308 28.4562 46.4827 30.3105C48.3346 32.1649 49.375 34.6799 49.375 37.3024C49.375 39.9248 48.3346 42.4398 46.4827 44.2942C44.6308 46.1486 42.119 47.1903 39.5 47.1903Z"
            fill="#8F90A6"
            className="group-hover:fill-ooolab_bg_dark"
        />
    </svg>
);

const NewDriveIcon = () => (
    <svg
        className="w-ooolab_w_3_i h-ooolab_h_3_i"
        viewBox="0 0 14 12"
        fill="none"
    >
        <path
            d="M5.06532 2.09961L1.87398 7.62828L3.04398 9.64961L6.23398 4.12294L5.06532 2.09961ZM4.19865 10.3156H10.5773L11.7447 8.29294H5.36732L4.19932 10.3156H4.19865ZM11.7413 6.95961L8.55065 1.43294H6.22065L9.41198 6.95961H11.742H11.7413ZM4.68065 0.0996094H9.32065L13.6673 7.62894L11.3473 11.6489H2.66065L0.333984 7.62894L4.68065 0.0996094ZM7.00398 5.45694L6.13598 6.95961H7.87132L7.00398 5.45694Z"
            fill="#8F90A6"
            className="group-hover:fill-ooolab_bg_dark"
        />
    </svg>
);

const NewManagementIcon = () => (
    <svg
        className="w-ooolab_w_3_i h-ooolab_h_3_i"
        viewBox="0 0 16 17"
        fill="none"
    >
        <path
            d="M2.16667 8.41667C2.16667 8.6775 2.55083 9.13167 3.44167 9.5775C4.595 10.1542 6.23083 10.5 8 10.5C9.76917 10.5 11.405 10.1542 12.5583 9.5775C13.4492 9.13167 13.8333 8.6775 13.8333 8.41667V6.6075C12.4583 7.4575 10.3558 8 8 8C5.64417 8 3.54167 7.45667 2.16667 6.6075V8.41667ZM13.8333 10.7742C12.4583 11.6242 10.3558 12.1667 8 12.1667C5.64417 12.1667 3.54167 11.6233 2.16667 10.7742V12.5833C2.16667 12.8442 2.55083 13.2983 3.44167 13.7442C4.595 14.3208 6.23083 14.6667 8 14.6667C9.76917 14.6667 11.405 14.3208 12.5583 13.7442C13.4492 13.2983 13.8333 12.8442 13.8333 12.5833V10.7742ZM0.5 12.5833V4.25C0.5 2.17917 3.85833 0.5 8 0.5C12.1417 0.5 15.5 2.17917 15.5 4.25V12.5833C15.5 14.6542 12.1417 16.3333 8 16.3333C3.85833 16.3333 0.5 14.6542 0.5 12.5833ZM8 6.33333C9.76917 6.33333 11.405 5.9875 12.5583 5.41083C13.4492 4.965 13.8333 4.51083 13.8333 4.25C13.8333 3.98917 13.4492 3.535 12.5583 3.08917C11.405 2.5125 9.76917 2.16667 8 2.16667C6.23083 2.16667 4.595 2.5125 3.44167 3.08917C2.55083 3.535 2.16667 3.98917 2.16667 4.25C2.16667 4.51083 2.55083 4.965 3.44167 5.41083C4.595 5.9875 6.23083 6.33333 8 6.33333Z"
            fill="#8F90A6"
            className="group-hover:fill-ooolab_bg_dark"
        />
    </svg>
);

const NewReportIcon = () => (
    <svg
        className="w-ooolab_w_3_i h-ooolab_h_3_i"
        viewBox="0 0 14 12"
        fill="none"
    >
        <path
            d="M1.00065 0H13.0007C13.1775 0 13.347 0.0702379 13.4721 0.195262C13.5971 0.320286 13.6673 0.489856 13.6673 0.666667V11.3333C13.6673 11.5101 13.5971 11.6797 13.4721 11.8047C13.347 11.9298 13.1775 12 13.0007 12H1.00065C0.82384 12 0.654271 11.9298 0.529246 11.8047C0.404222 11.6797 0.333984 11.5101 0.333984 11.3333V0.666667C0.333984 0.489856 0.404222 0.320286 0.529246 0.195262C0.654271 0.0702379 0.82384 0 1.00065 0V0ZM1.66732 1.33333V10.6667H12.334V1.33333H1.66732ZM3.66732 6.66667H5.00065V9.33333H3.66732V6.66667ZM6.33398 2.66667H7.66732V9.33333H6.33398V2.66667ZM9.00065 4.66667H10.334V9.33333H9.00065V4.66667Z"
            fill="#8F90A6"
            className="group-hover:fill-ooolab_bg_dark"
        />
    </svg>
);

const tabDashboard = (workspaceId: string) => {
    return [
        {
            name: 'Dashboard',
            current: false,
            subtabs: [
                { name: 'Overview', href: '#' },
                { name: 'Members', href: '#' },
                { name: 'Calendar', href: '#' },
                { name: 'Settings', href: '#' },
            ],
        },
    ];
};
const tabCalendar = (workspaceId: string) => {
    return [
        {
            name: 'Calendar',
            current: false,
            subtabs: [
                { name: 'tab 1', href: '#' },
                { name: 'tab 2', href: '#' },
                { name: 'tab 3', href: '#' },
            ],
        },
    ];
};
const tabAcademics = (
    workspaceId: string,
    isAdmin: boolean,
    translator: Function
) => {
    return [
        ...(isAdmin
            ? [
                  {
                      name: translator('ADMIN'),
                      current: false,
                      href: `/workspace/${workspaceId}/admin`,
                  },
              ]
            : []),

        {
            name: translator('DASHBOARD.SIDEBAR.COURSES'),
            current: false,
            href: `/workspace/${workspaceId}/courses`,
        },
        {
            name: translator('DASHBOARD.SIDEBAR.LESSONS'),
            current: false,
            href: `/workspace/${workspaceId}/lesson`,
        },
        {
            name: 'H5P',
            current: false,
            href: `/workspace/${workspaceId}/h5p-content`,
        },
        {
            name: translator('DASHBOARD.SIDEBAR.TRASH'),
            current: false,
            href: `/workspace/${workspaceId}/trash`,
        },
    ];
};

const tabDrive = (workspaceId: string) => {
    return [
        {
            name: 'My Drive',
            current: false,
            subtabs: [
                {
                    name: 'My Drive',
                    href: `/workspace/${workspaceId}/my-drive`,
                },
                { name: 'Create Folder', onFetch: 'createFolder' },
                { name: 'Upload Folder', onFetch: 'uploadFolder' },
                { name: 'Upload File', onFetch: 'uploadFile' },
                {
                    name: 'Connect Google Drive',
                    href: `/workspace/${workspaceId}/connect-drive`,
                },
            ],
        },
        {
            name: 'Share with me',
            current: false,
            href: ` /workspace/${workspaceId}/shared-with-me`,
        },
        {
            name: 'Trash',
            current: false,
            href: `/workspace/${workspaceId}/my-drive/trash`,
        },
    ];
};
const tabManagement = (workspaceId: string, translator: Function) => {
    return [
        // {
        //     name: 'Groups',
        //     current: false,
        //     href: `/workspace/${workspaceId}/management/groups`,
        // },
        // {
        //     name: 'Students',
        //     current: false,
        //     href: `/workspace/${workspaceId}/management/student`,
        // },

        {
            name: translator('DASHBOARD.SIDEBAR.CLASSES'),
            current: false,
            href: `/workspace/${workspaceId}/management/class`,
            // subtabs: [
            //     { name: 'Classes 1', href: '#' },
            //     { name: 'Classes 2', href: '#' },
            //     { name: 'Classes 3', href: '#' },
            // ],
        },
        // {
        //     name: 'Classroom',
        //     current: false,
        //     href: `/workspace/${workspaceId}/management/classroom`,
        //     // subtabs: [
        //     //     { name: 'Classrooms 1', href: '#' },
        //     //     { name: 'Classrooms 2', href: '#' },
        //     //     { name: 'Classrooms 3', href: '#' },
        //     // ],
        // },
        // {
        //     name: 'Teachers',
        //     current: false,
        //     href: `/workspace/${workspaceId}/management/teacher`,
        // },
        // {
        //     name: 'Status',
        //     current: false,
        //     subtabs: [
        //         { name: 'Status 1', href: '#' },
        //         { name: 'Status 2', href: '#' },
        //         { name: 'Status 3', href: '#' },
        //     ],
        // },
    ];
};

const tabReport = (workspaceId: string, type: string, translator: Function) => {
    return [
        {
            name: translator('DASHBOARD.SIDEBAR.GENERAL_DASHBOARD'),
            href: `/workspace/${workspaceId}/report/general`,
            current: false,
        },
        ...(type === 'teacher'
            ? [
                  {
                      name: translator('DASHBOARD.SIDEBAR.TEACHER_PERFORMANCE'),
                      href: `/workspace/${workspaceId}/report/teacher`,
                      current: false,
                  },
              ]
            : []),
    ];
};

export function generateAppNewBars({
    workspaceId,
    isAdmin,
    translator,
    type,
}: {
    workspaceId: string;
    isAdmin: boolean;
    translator?: Function;
    type?: string;
}) {
    const listMenu = [
        // {
        //     id: 0,
        //     title: 'Dashboard',
        //     icon: <NewDashboardIcon />,
        //     type: NewBarType.Dashboard,
        //     tab: tabDashboard(workspaceId),
        // },
        // {
        //     id: 1,
        //     title: 'Calendar',
        //     icon: <NewCalendarIcon />,
        //     type: NewBarType.Calendar,
        //     tab: tabCalendar(workspaceId),
        // },
        {
            id: 2,
            title: translator('DASHBOARD.SIDEBAR.ACADEMICS'),
            icon: <NewAcademicsIcon />,
            type: NewBarType.Academics,
            tab: tabAcademics(workspaceId, isAdmin, translator),
        },
        {
            id: 3,
            title: translator('DASHBOARD.SIDEBAR.MANAGEMENT'),
            icon: <NewManagementIcon />,
            type: NewBarType.Management,
            tab: tabManagement(workspaceId, translator),
        },
        // {
        //     id: 4,
        //     title: 'Drive',
        //     icon: <NewDriveIcon />,
        //     type: NewBarType.Drive,
        //     tab: tabDrive(workspaceId),
        // },

        {
            id: 5,
            title: translator('DASHBOARD.SIDEBAR.REPORTS'),
            icon: <NewReportIcon />,
            type: NewBarType.Report,
            tab: tabReport(workspaceId, type, translator),
        },
    ];

    return listMenu;
}
