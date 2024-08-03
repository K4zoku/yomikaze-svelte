import type Model from "./Model";
import type Profile from "./Profile";


export interface Withdrawal extends Model {
    profile: Profile;
    status: string; 
    userId: string;
    amount: number;
    paymentInformation: string;
    isUpdating: boolean;
    id: string;
  }