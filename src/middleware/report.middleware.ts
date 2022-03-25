// ACTION
import React from 'react';
// SERVICE
import { ReportService } from 'services';
import { GET_REPORT } from 'actions/report.action';
// TYPE

const getGeneral = async (workspaceId: string, dispatch: React.Dispatch<any>) => {
    dispatch({
        type: GET_REPORT.REQ_GET_REPORT_GENERAL,
    });
    try {
        const data = await ReportService.getGeneral(workspaceId);
        dispatch({
            type: GET_REPORT.REQ_GET_REPORT_GENERAL_FINISH,
            url: data.url,
            resizerJsUrl: data.resizer_url,
        });
    } catch (err) {
        dispatch({
            type:
                GET_REPORT.REQ_GET_REPORT_GENERAL_FAILED,
            err: err.toJSON().message,
        });
    }
};

const getTeacher = async (workspaceId: string, dispatch: React.Dispatch<any>) => {
    dispatch({
        type: GET_REPORT.REQ_GET_REPORT_TEACHER,
    });
    try {
        const data = await ReportService.getTeacher(workspaceId);
        dispatch({
            type: GET_REPORT.REQ_GET_REPORT_TEACHER_FINISH,
            url: data.url,
            resizerJsUrl: data.resizer_url,
        });
    } catch (err) {
        dispatch({
            type:
                GET_REPORT.REQ_GET_REPORT_TEACHER_FAILED,
            err: err.toJSON().message,
        });
    }
};

export default {
    getGeneral,
    getTeacher
};
