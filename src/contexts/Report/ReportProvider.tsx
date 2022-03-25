import React, { useReducer } from 'react';
import reducers from 'reducers';
import { initReportState } from 'types/Report.type';
import { ReportContext } from './ReportContext';

const ReportProvider: React.FC = ({ children }) => {
    const [reportState, dispatch] = useReducer(
        reducers.getReportReducer,
        initReportState
    );
    return (
        <ReportContext.Provider
            value={{ reportState, dispatch }}
        >
            {children}
        </ReportContext.Provider>
    );
};

export default ReportProvider;
