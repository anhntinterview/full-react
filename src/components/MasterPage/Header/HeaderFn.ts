export interface HeaderProps {
    setOpenUserDetail?: React.Dispatch<React.SetStateAction<boolean>>;
    onClickWorkspaceDetail?: (type?: string) => void;
    setOpenEditUserModal?: React.Dispatch<React.SetStateAction<boolean>>;
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
}