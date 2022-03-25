import { useCallback, useState } from 'react';

export const useBoolean = () => {
    const [booleanValue, setBooleanValue] = useState(false);

    const toggleBooleanValue = useCallback(
        () => setBooleanValue(!booleanValue),
        [booleanValue]
    );

    return { booleanValue, toggleBooleanValue };
};
