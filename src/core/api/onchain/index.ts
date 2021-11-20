import { paramsToSearch } from '@utils/url';
import config from '../../../../config.json';
import {
	Timeframe,
	PriceBar,
	FetchHistoricalPricesOptions,
	FetchBalanceDistributionOptions,
	BalanceDistributionTimePoint,
} from './models';

const onchainApi = {
	fetchHistoricalPrices: (options: FetchHistoricalPricesOptions) => {
		const { pair, timeframe, limit = 2000 } = options;
		const timeframesMap: Record<Timeframe, string> = {
			M1: 'hitominute',
			H1: 'histohour',
			D: 'histoday',
		};

		return new Promise<Array<PriceBar>>(async (resolve, reject) => {
			const api = timeframesMap[timeframe];
			const [fsym, tsym] = pair.split('_');
			const search = paramsToSearch({
				api_key: CRYPTOCOMPARE_TOKEN,
				fsym,
				tsym,
				limit,
			});
			const url = `${API_ENDPOINT}/v2/${api}?${search}`;

			try {
				const prices = (await (await fetch(url)).json()).Data.Data.map(x => ({
					time: x.time * 1000,
					open: x.open,
					low: x.low,
					hight: x.high,
					close: x.close,
					volume: x.volumeto,
				}));

				resolve(prices);
			} catch (error) {
				reject(error);
			}
		});
	},
	fetchBalanceDistribution: (options: FetchBalanceDistributionOptions = {}) => {
		const { limit = 2000 } = options;

		return new Promise<Array<BalanceDistributionTimePoint>>(async (resolve, reject) => {
			const search = paramsToSearch({
				api_key: CRYPTOCOMPARE_TOKEN,
				fsym: 'BTC',
				limit,
			});
			const url = `${API_ENDPOINT}/blockchain/balancedistribution/histo/day?${search}`;

			try {
				const data = (await (await fetch(url)).json()).Data.Data.map(x => {
					return {
						time: x.time * 1000,
						data: x.balance_distribution.map(x => ({
							from: x.from,
							to: x.to,
							addressesCount: x.addressesCount,
							totalVolume: x.totalVolume,
						})),
					} as BalanceDistributionTimePoint;
				});

				resolve(data);
			} catch (error) {
				reject(error);
			}
		});
	},
};

const CRYPTOCOMPARE_TOKEN = config.cryptocompare.token;
const API_ENDPOINT = 'https://min-api.cryptocompare.com/data';

export { onchainApi };
