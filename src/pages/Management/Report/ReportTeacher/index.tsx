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
        if (!reportState.teacher) {
            reportMiddleware.getTeacher(params.id, dispatch);
        }
    }, [reportState]);
    if (!reportState.teacher) {
        return <></>
    }
    return (
        <MetabaseReport url={reportState.teacher.url} resizer={reportState.teacher.resizerJsUrl} />
    );
};

const ReportTeacher: React.FC<{ setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>; }> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ReportPermissionWrapper type='teacher'>
                <Report />
            </ReportPermissionWrapper>
        </MasterPage>
    );
};

export default ReportTeacher;
