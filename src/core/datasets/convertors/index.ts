import moment from 'moment';

import { BASE_TIME_FORMAT } from '@utils/date';
import { fix } from '@utils/math';
import { saveJsonToFile } from '@utils/file';

function convertInvestingCsvDatasetToJsonDataset(dataset: Array<Array<string | number>>, filename: string) {
	const SOURCE_DATE_FORMAT = 'MMM DD, YYYY hh:mm:ss';
	const bars = dataset.reverse().map(x => {
		const convertPrice = (x: string | number) => {
			return fix(Number(`${x || 0}`.replace(',', '')), 2);
		};
		const convertVolume = (x: string | number) => {
			return fix(Number(`${x || 0}`.replace(',', '').replace('K', '')) * 100, 2);
		};
		const date = moment(x[0] + ' 05:00:00', SOURCE_DATE_FORMAT);
		const obj = {
			time: date.format(BASE_TIME_FORMAT),
			timestamp: date.unix(),
			close: convertPrice(x[1]),
			open: convertPrice(x[2]),
			hight: convertPrice(x[3]),
			low: convertPrice(x[4]),
			volume: convertVolume(x[5]),
		};

		return obj;
	});

	const json = JSON.stringify(bars);

	saveJsonToFile(json, filename);
}

export { convertInvestingCsvDatasetToJsonDataset };
