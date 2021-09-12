import { TradingDecision } from '@core/trading/strategy';

type SpotRiskManagerConstructor = {
	style: RiskStyle;
	balance: number;
	commision: number;
};

abstract class SpotRiskManager {
	protected style: RiskStyle;
	protected balance = 0;
	protected commision = 0;
	protected quantitiesMap: Record<string, number> = {};

	constructor(options: SpotRiskManagerConstructor) {
		const { style, balance, commision } = options;

		this.style = style;
		this.balance = balance;
		this.commision = commision;
	}

	public abstract calculateRiskParameters(options: GetRiskOptions): Promise<RiskParameters>;

	public static getRiskParameters(options: GetRiskParametersOptions): RiskParameters {
		const { ticker, style, balance, commision, price, decision, quantitiesMap } = options;
		const quantity = SpotRiskManager.getTradeQuantity({ style, balance, price });
		const canTakeRisk = SpotRiskManager.detectIsTradeAvailable({
			ticker,
			balance,
			commision,
			price,
			quantity,
			decision,
			quantitiesMap,
		});
		const { stoploss, takeprofit } = SpotRiskManager.getTradeBoundaries({ style, price, decision });
		const risk: RiskParameters = {
			canTakeRisk,
			quantity,
			stoploss,
			takeprofit,
		};

		return risk;
	}

	public static detectIsTradeAvailable(options: DetectIsTradeAvailabelOptions): boolean {
		const { ticker, balance, commision, price, quantity, decision, quantitiesMap } = options;
		const quantityOnBalance = quantitiesMap[ticker] || 0;
		const isBuy = decision === TradingDecision.BUY;
		const isSell = decision === TradingDecision.SELL;
		const isAvailable = isBuy
			? balance >= price * quantity + commision
			: isSell
			? quantityOnBalance >= quantity
			: false;

		return isAvailable;
	}

	public static getTradeQuantity(options: GetQuantityOptions): number {
		const { style, price, balance } = options;
		const percentsMap = {
			[RiskStyle.AGGRESIVE]: 0.2,
			[RiskStyle.CONSERVATIVE]: 0.1,
		};
		const percent = percentsMap[style];

		return (balance * percent) / price;
	}

	public static getTradeBoundaries(options: GetTradeBoundariesOptions) {
		const { style, price, decision } = options;
		const lossFactorsMap = {
			[RiskStyle.AGGRESIVE]: 0.5,
			[RiskStyle.CONSERVATIVE]: 0.3,
		};
		const expectedValuesMap = {
			[RiskStyle.AGGRESIVE]: 5,
			[RiskStyle.CONSERVATIVE]: 3,
		};
		const lossFactor = lossFactorsMap[style];
		const expectedValue = expectedValuesMap[style];
		const profitFactor = lossFactor * expectedValue;
		const stoploss = decision === TradingDecision.BUY ? price - price * lossFactor : 0;
		const takeprofit = decision === TradingDecision.BUY ? price + price * profitFactor : 0;

		return {
			stoploss,
			takeprofit,
		};
	}
}

export type GetRiskOptions = {
	ticker: string;
	price: number;
	decision: TradingDecision;
};

type GetRiskParametersOptions = {
	style: RiskStyle;
	balance: number;
	commision: number;
	quantitiesMap: Record<string, number>;
	ticker: string;
	price: number;
	decision: TradingDecision;
};

type DetectIsTradeAvailabelOptions = {
	balance: number;
	commision: number;
	quantitiesMap: Record<string, number>;
	ticker: string;
	price: number;
	quantity: number;
	decision: TradingDecision;
};

export enum RiskStyle {
	AGGRESIVE = 'aggresive',
	CONSERVATIVE = 'conservative',
}

export type RiskParameters = {
	canTakeRisk: boolean;
	quantity: number;
	stoploss: number;
	takeprofit: number;
};

type GetTradeBoundariesOptions = {
	style: RiskStyle;
	price: number;
	decision: TradingDecision;
};

type GetQuantityOptions = {
	style: RiskStyle;
	balance: number;
	price: number;
};

export { SpotRiskManager };
