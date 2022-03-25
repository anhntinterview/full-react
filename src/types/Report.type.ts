export interface ReportUrl {
    url: string;
    resizerJsUrl: string;
}

export interface ReportState {
    general?: ReportUrl;
    teacher?: ReportUrl;
}

export interface ReportAction extends ReportUrl {
    type: string;
}

export const initReportState: ReportState = {

};