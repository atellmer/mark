export type TimeUnix = number;

export type TimePoint = {
	time: TimeUnix;
};

export type PriceBar = {
	open: number;
	low: number;
	hight: number;
	close: number;
	volume: number;
} & TimePoint;

export type Timeframe = 'M1' | 'H1' | 'D';

export type SharedFetchOptions = {
	limit?: number;
};

export type FetchHistoricalPricesOptions = {
	pair: string;
	timeframe: Timeframe;
} & SharedFetchOptions;

export type FetchBalanceDistributionOptions = {} & SharedFetchOptions;

export type BalanceDistribution = {
	from: number;
	to: number;
	addressesCount: number;
	totalVolume: number;
};

export type BalanceDistributionTimePoint = {
	data: Array<BalanceDistribution>;
} & TimePoint;
