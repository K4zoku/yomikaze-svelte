export default interface BaseModel {
    readonly id: string | bigint,
    readonly creationTime: string | Date,
    readonly lastModified?: string | Date,
}