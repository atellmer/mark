import { BalanceDistributionTimePoint, PriceBar } from '@core/api/onchain/models';
import { createObjectMap } from '@utils/helpers';
import { fix } from '@utils/math';
import { TimePoint } from './models';
import { smaTimeline } from './moving-average';

function balancesDivergence(
	prices: Array<PriceBar>,
	distribution: Array<BalanceDistributionTimePoint>,
	period = 50,
	thresold = 0.15,
): Array<BalancesDivergenceIndicatorValue> {
	const volumes = distribution.map(x => {
		const fish0 = x.data[0].totalVolume;
		const fish1 = x.data[1].totalVolume;
		const fish2 = x.data[2].totalVolume;
		const fish3 = x.data[3].totalVolume;
		const whale0 = x.data[4].totalVolume;
		const whale1 = x.data[5].totalVolume;
		const whale2 = x.data[6].totalVolume;
		const whale3 = x.data[7].totalVolume;
		const fishesVolume = fish0 + fish1 + fish2 + fish3;
		const whalesVolume = whale0 + whale1 + whale2 + whale3;

		return {
			time: x.time,
			date: new Date(x.time),
			fishesVolume,
			whalesVolume,
		};
	});
	const fishesVolumes = volumes.map(x => {
		return {
			time: x.time,
			value: x.fishesVolume,
		} as TimePoint;
	});
	const whalesVolumes = volumes.map(x => {
		return {
			time: x.time,
			value: x.whalesVolume,
		} as TimePoint;
	});
	const pricesMap = createObjectMap(prices, x => x.time);
	const fishesVolumesSmaMap = createObjectMap(smaTimeline(fishesVolumes, period), x => x.time);
	const whalesVolumesSmaMap = createObjectMap(smaTimeline(whalesVolumes, period), x => x.time);
	const value = volumes
		.map(x => {
			if (!fishesVolumesSmaMap[x.time]) return null;
			const price = fix((pricesMap[x.time].hight + pricesMap[x.time].low) / 2, 2);
			const isFishesUp =
				((x.fishesVolume - fishesVolumesSmaMap[x.time].value) / fishesVolumesSmaMap[x.time].value) * 100 > thresold;
			const isWhalesUp =
				((x.whalesVolume - whalesVolumesSmaMap[x.time].value) / whalesVolumesSmaMap[x.time].value) * 100 > thresold;
			const isWhalesUpAndFishesDown = isWhalesUp && !isFishesUp;
			const isWhalesUpAndFishesUp = isWhalesUp && isFishesUp;
			const isWhalesDownAndFishesUp = !isWhalesUp && isFishesUp;
			const isWhalesDownAndFishesDown = !isWhalesUp && !isFishesUp;

			return {
				time: x.time,
				date: x.date,
				value: price,
				isWhalesUpAndFishesDown,
				isWhalesUpAndFishesUp,
				isWhalesDownAndFishesUp,
				isWhalesDownAndFishesDown,
			} as BalancesDivergenceIndicatorValue;
		})
		.filter(Boolean);

	return value;
}

export type BalancesDivergenceIndicatorValue = {
	isWhalesUpAndFishesUp: boolean;
	isWhalesUpAndFishesDown: boolean;
	isWhalesDownAndFishesDown: boolean;
	isWhalesDownAndFishesUp: boolean;
} & TimePoint;

export { balancesDivergence };
