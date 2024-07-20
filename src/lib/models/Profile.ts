import type Model from "./Model";

export default interface Profile extends Model {
    avatar: string;
    banner: string;
    bio: string;
    name : string  ;
    birthday : string | Date;
    readonly balance : 0;
    readonly roles : Array<string>;
}