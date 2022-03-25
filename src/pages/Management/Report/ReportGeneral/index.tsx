import React, { useContext, useEffect } from 'react';
import MasterPage from 'pages/MasterPage/';
import ReportPermissionWrapper from 'pages/Management/ReportPermissionWrapper';
import MetabaseReport from '../MetabaseReport';
import { ReportContext } from '../../../../contexts/Report/ReportContext';
import reportMiddleware from 'middleware/report.middleware';
import { useParams } from 'react-router-dom';

const Report: React.FC = () => {
    const { reportState, dispatch } = useContext(ReportContext);
    const params: { id: string } = useParams();
    useEffect(() => {
        if (!reportState.general) {
            reportMiddleware.getGeneral(params.id, dispatch);
        }
    }, [reportState]);
    if (!reportState.general) {
        return <></>
    }
    return (
        <MetabaseReport url={reportState.general.url} resizer={reportState.general.resizerJsUrl} />
    );
};

const ReportGeneral: React.FC<{ setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>; }> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ReportPermissionWrapper>
                <Report />
            </ReportPermissionWrapper>
        </MasterPage>
    );
};

export default ReportGeneral;
