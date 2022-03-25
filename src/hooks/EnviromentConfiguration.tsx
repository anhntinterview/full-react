import { useEffect, useState } from 'react';
import { IObjectKeys } from 'types/Common.type';

export const useConfiguration = (): [
    IObjectKeys,
    React.Dispatch<IObjectKeys>
] => {
    const [config, setConfig] = useState<IObjectKeys>({});

    useEffect(() => {
        setConfig({ env: process.env.REACT_APP_ENV ?? '' });
    }, []);

    return [config, setConfig];
};
