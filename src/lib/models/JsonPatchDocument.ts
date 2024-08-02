export interface JsonPatchEntry {
    op: string;
    path: string;
    value?: string | string[] | number | number[] | boolean | boolean[] | null;
    from?: string;
}



