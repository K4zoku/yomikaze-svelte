import type Model from "./Model";

export default interface Notification extends Model {
    title: string;
    content: string;
    read: boolean;
}