import http from '$utils/http';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type CoinPricing from '$models/CoinPricing';
import type PagedResult from '$models/PagedResult';
import type Pagination from '$models/Pagination';
import { appendQueryParams } from './common';

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const COIN_ENDPOINT = '/coin-pricing';

export async function getCoin(pagination?: Pagination): Promise<PagedResult<CoinPricing>> {
  const url = new URL(COIN_ENDPOINT, BASE_URL);
  appendQueryParams(url.searchParams, pagination);
  const response = await http.get(url.toString());
  return response.data;
}

export async function postCoinPricing(amount: number, price: number, currency: string = 'USD'): Promise<CoinPricing> {
  const url = new URL(COIN_ENDPOINT, BASE_URL);
  const response = await http.post(url.toString(), { amount, price, currency });
  return response.data;
}

export async function deleteCoinPricing(id: string): Promise<void> {
  await http.delete(`${BASE_URL}${COIN_ENDPOINT}/${id}`);
}

export async function patchCoinPricing(id: string, patchData: any[]): Promise<CoinPricing> {
  const url = new URL(`${COIN_ENDPOINT}/${id}`, BASE_URL);
  const response = await http.patch(url.toString(), patchData);
  return response.data;
}