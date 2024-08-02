import type Model from "./Model";

export interface Reason extends Model {
    content: string;
    id: string;
    creationTime: string;
  }