import { Dispatch, createContext } from 'react';
// STATES
// TYPES
import { initReportState, ReportState } from 'types/Report.type';

export const ReportContext = createContext<{
    reportState: ReportState;
    dispatch: Dispatch<any>;
}>({
    reportState: initReportState,
    dispatch: () => null,
});
