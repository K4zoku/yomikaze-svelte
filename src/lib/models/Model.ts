export default interface Model {
    readonly id: string | bigint,
    readonly creationTime: string | Date,
    readonly lastModified?: string | Date,
}