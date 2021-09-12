import { Deal } from '@core/trading/primitives';
import { TradingDecision } from '@core/trading/strategy';

export type SpotRiskManagerConstructor = {
	style: RiskStyle;
	comission: number;
};

abstract class SpotRiskManager {
	protected ticker: string;
	protected style: RiskStyle;
	protected basisAssetBalance = 0;
	protected targetAssetBalance = 0;
	protected comission = 0;

	constructor(options: SpotRiskManagerConstructor) {
		const { style, comission } = options;

		this.style = style;
		this.comission = comission;
	}

	public abstract getCurrentBasisAssetBalance(price: number): Promise<number>;

	public abstract calculateRiskParameters(options: CalculateRiskParametersOptions): Promise<RiskParameters>;

	public abstract onDeal(deal: Deal): void;

	public static getRiskParameters(options: GetRiskParametersOptions): RiskParameters {
		const { style, basisAssetBalance, targetAssetBalance, price, comission, decision } = options;
		const quantity = SpotRiskManager.getTradeQuantity({
			style,
			basisAssetBalance,
			targetAssetBalance,
			price,
			comission,
			decision,
		});
		const canTakeRisk = SpotRiskManager.detectIsTradeAvailable({
			basisAssetBalance,
			targetAssetBalance,
			price,
			quantity,
			decision,
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
		const { basisAssetBalance, targetAssetBalance, price, quantity, decision } = options;
		const isBuy = decision === TradingDecision.BUY;
		const isSell = decision === TradingDecision.SELL;
		const isAvailable = isBuy ? basisAssetBalance >= price * quantity : isSell ? targetAssetBalance >= quantity : false;

		return isAvailable;
	}

	public static getTradeQuantity(options: GetQuantityOptions): number {
		const { style, basisAssetBalance, targetAssetBalance, price, comission, decision } = options;
		const percentsMap = {
			[RiskStyle.AGGRESIVE]: 0.2,
			[RiskStyle.CONSERVATIVE]: 0.1,
		};
		const percent = percentsMap[style];
		const quantity = (basisAssetBalance * percent) / (price + comission);

		if (decision === TradingDecision.SELL && targetAssetBalance > 0 && targetAssetBalance < quantity) {
			return targetAssetBalance;
		}

		return quantity;
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

export type CalculateRiskParametersOptions = {
	price: number;
	decision: TradingDecision;
};

type GetRiskParametersOptions = {
	style: RiskStyle;
	basisAssetBalance: number;
	targetAssetBalance: number;
	price: number;
	comission: number;
	decision: TradingDecision;
};

type DetectIsTradeAvailabelOptions = {
	basisAssetBalance: number;
	targetAssetBalance: number;
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
	basisAssetBalance: number;
	targetAssetBalance: number;
	price: number;
	comission: number;
	decision: TradingDecision;
};

export { SpotRiskManager };
