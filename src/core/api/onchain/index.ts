import { paramsToSearch } from '@utils/url';
import { Price } from '@core/market/price';
import config from '../../../../config.json';

const pricesApi = {
	fetchHistoricalPrices: (options: FetchHistoricalPrices) => {
		const { pair, timeframe, limit = 1000 } = options;
		const timeframesMap: Record<Timeframe, string> = {
			M1: 'hitominute',
			H1: 'histohour',
			D: 'histoday',
		};

		return new Promise<Array<Price>>(async resolve => {
			const api = timeframesMap[timeframe];
			const [fsym, tsym] = pair.split('_');
			const search = paramsToSearch({
				fsym,
				tsym,
				limit,
				api_key: config.cryptocompare.token,
			});
			const url = `${API_ENDPOINT}/${api}?${search}`;

			try {
				const prices = (await (await fetch(url)).json()).Data.Data.map(
					x => new Price(x.time, x.open, x.low, x.high, x.close, x.volumeto),
				);

				resolve(prices);
			} catch (error) {
				resolve([]);
			}
		});
	},
};

type FetchHistoricalPrices = {
	pair: string;
	timeframe: Timeframe;
	limit?: number;
};

type Timeframe = 'M1' | 'H1' | 'D';

const API_ENDPOINT = 'https://min-api.cryptocompare.com/data/v2';

export { pricesApi };
