export interface ErrorList {
    [key: string]: string[];
}

export default interface Problem {
    errors: ErrorList;
    status: number;
    title: string;
    detail?: string;
    traceId?: string;
    type?: string;
}