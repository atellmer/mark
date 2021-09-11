import { pricesApi } from '@core/api';
import { Price } from '@core/market';
import pricedataset from '@datasets/price/btc_usdt_d.json';


(async () => {
	//const prices = await pricesApi.fetchHistoricalPrices({ pair: 'BTC_USDT', timeframe: 'D', limit: 2000 });

	const prices = Price.fromJSON(pricedataset);

	console.log('prices', prices)
})();
