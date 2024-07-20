import type Model from "./Model";

export default interface CoinPricing extends Model {
    amount: number;
    price: number;
    currency: string;
    readonly stripePriceId: string;
}