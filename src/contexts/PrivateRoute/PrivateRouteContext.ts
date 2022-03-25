import { BarType, NewBarType } from 'constant/setupBars.const';
import { createContext } from 'react';

export const PrivateRouteContext = createContext<{
    barType?: BarType;
    newBarType?: NewBarType;
}>({});
