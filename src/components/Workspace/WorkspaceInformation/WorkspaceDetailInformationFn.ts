export type WorkspaceDetailInformationProps = {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>> | undefined;
    onClose: (id?: string) => void;
    token: string | undefined;
};