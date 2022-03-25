import { ReportState, ReportAction } from 'types/Report.type';
import { GET_REPORT } from 'actions/report.action';

export function getReportReducer(
    state: ReportState,
    action: ReportAction
) {
    switch (action.type) {
        case GET_REPORT.REQ_GET_REPORT_GENERAL_FINISH:
            return {
                ...state,
                general: {
                    url: action.url,
                    resizerJsUrl: action.resizerJsUrl
                }
            };
        case GET_REPORT.REQ_GET_REPORT_TEACHER_FINISH:
            return {
                ...state,
                teacher: {
                    url: action.url,
                    resizerJsUrl: action.resizerJsUrl
                }
            };
        default:
            return state;
    }
}
