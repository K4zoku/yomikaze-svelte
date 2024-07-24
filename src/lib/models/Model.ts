import type dayjs from "dayjs";

export default interface Model {
    readonly id: string,
    readonly creationTime: string | Date | dayjs.Dayjs,
    readonly lastModified?: string | Date | dayjs.Dayjs,
}