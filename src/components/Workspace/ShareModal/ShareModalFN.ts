export interface CustomOptionsType {
    value: string;
    label: string;
    color?: string;
    avatar?: string;
    id: number;
}

export interface ShareModalProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

