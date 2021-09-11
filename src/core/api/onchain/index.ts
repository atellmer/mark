import { paramsToSearch } from '@utils/url';
import { Bar } from '@core/trading/primitives';
import config from '../../../../config.json';

const pricesApi = {
	fetchHistoricalBars: (options: FetchHistoricalBar) => {
		const { pair, timeframe, limit = 2000 } = options;
		const timeframesMap: Record<Timeframe, string> = {
			M1: 'hitominute',
			H1: 'histohour',
			D: 'histoday',
		};

		return new Promise<Array<Bar>>(async resolve => {
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
					x =>
						new Bar({
							timestamp: x.time,
							open: x.open,
							low: x.low,
							hight: x.high,
							close: x.close,
							volume: x.volumeto,
						}),
				);

				resolve(prices);
			} catch (error) {
				resolve([]);
			}
		});
	},
};

type FetchHistoricalBar = {
	pair: string;
	timeframe: Timeframe;
	limit?: number;
};

type Timeframe = 'M1' | 'H1' | 'D';

const API_ENDPOINT = 'https://min-api.cryptocompare.com/data/v2';

export { pricesApi };
