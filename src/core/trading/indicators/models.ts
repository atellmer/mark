import { TimeUnix } from '@core/api/onchain/models';

export type TimePoint = {
	time: TimeUnix;
	date: Date;
	value: number;
};

export { TimeUnix };
