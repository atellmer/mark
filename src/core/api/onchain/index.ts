import { paramsToSearch } from '@utils/url';
import { Price } from '@core/market/price';
import config from '../../../../config.json';

const pricesApi = {
	fetchHistoricalPrices: (options: FetchHistoricalPrices) => {
		const { pair, timeframe, limit = 1000 } = options;
		const timeframesMap: Record<Timeframe, string> = {
			H1: 'histohour',
			D: 'histoday',
		};

		return new Promise<Array<Price>>(resolve => {
			const api = timeframesMap[timeframe];
			const [fsym, tsym] = pair.split('_');
			const search = paramsToSearch({
				fsym,
				tsym,
				limit,
				api_key: config.cryptocompare.token,
			});
			const url = `${API_ENDPOINT}/${api}?${search}`;

			fetch(url)
				.then(result => result.json())
				.then(result => {
					const prices = result.Data.Data.map(x => new Price(x.time, x.open, x.low, x.high, x.close, x.volumeto));

					resolve(prices);
				});
		});
	},
};

type FetchHistoricalPrices = {
	pair: string;
	timeframe: Timeframe;
	limit?: number;
};

type Timeframe = 'H1' | 'D';

const API_ENDPOINT = 'https://min-api.cryptocompare.com/data/v2';

export { pricesApi };
