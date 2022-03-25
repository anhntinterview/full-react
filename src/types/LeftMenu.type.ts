export interface LeftMenunAction extends LeftMenuState {
    type: string;
}
export interface LeftMenuState {
    isLoading: boolean;
    data: FileList | undefined;
    folderName: string;
}
export interface FileUpload {
    lastModified: number;
    lastModifiedDate: string;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
}