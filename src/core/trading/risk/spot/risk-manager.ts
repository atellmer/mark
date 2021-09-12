import { Deal } from '@core/trading/primitives';
import { TradingDecision } from '@core/trading/strategy';

export type SpotRiskManagerConstructor = {
	riskBehaviour: RiskBehaviour;
	commission: number;
};

abstract class SpotRiskManager {
	protected ticker: string;
	protected riskBehaviour: RiskBehaviour;
	protected basisAssetBalance = 0;
	protected targetAssetBalance = 0;
	protected commission = 0;

	constructor(options: SpotRiskManagerConstructor) {
		const { riskBehaviour, commission } = options;

		this.riskBehaviour = riskBehaviour;
		this.commission = commission;
	}

	public abstract getCurrentBasisAssetBalance(price: number): Promise<number>;

	public abstract calculateRiskParameters(options: CalculateRiskParametersOptions): Promise<RiskParameters>;

	public abstract onDeal(deal: Deal): void;

	public static getRiskParameters(options: GetRiskParametersOptions): RiskParameters {
		const { riskBehaviour, basisAssetBalance, targetAssetBalance, price, commission, decision } = options;
		const quantity = SpotRiskManager.getTradeQuantity({
			riskBehaviour,
			basisAssetBalance,
			targetAssetBalance,
			price,
			commission,
			decision,
		});
		const canTakeRisk = SpotRiskManager.detectIsTradeAvailable({
			basisAssetBalance,
			targetAssetBalance,
			price,
			quantity,
			decision,
		});
		const { stoploss, takeprofit } = SpotRiskManager.getTradeBoundaries({ riskBehaviour, price, decision });
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
		const { riskBehaviour, basisAssetBalance, targetAssetBalance, price, commission, decision } = options;
		const percentsMap = {
			[RiskBehaviour.AGGRESIVE]: 0.2,
			[RiskBehaviour.CONSERVATIVE]: 0.1,
		};
		const percent = percentsMap[riskBehaviour];
		const quantity = (basisAssetBalance * percent) / (price + commission);

		if (decision === TradingDecision.SELL && targetAssetBalance > 0 && targetAssetBalance < quantity) {
			return targetAssetBalance;
		}

		return quantity;
	}

	public static getTradeBoundaries(options: GetTradeBoundariesOptions) {
		const { riskBehaviour, price, decision } = options;
		const lossFactorsMap = {
			[RiskBehaviour.AGGRESIVE]: 0.5,
			[RiskBehaviour.CONSERVATIVE]: 0.3,
		};
		const expectedValuesMap = {
			[RiskBehaviour.AGGRESIVE]: 5,
			[RiskBehaviour.CONSERVATIVE]: 3,
		};
		const lossFactor = lossFactorsMap[riskBehaviour];
		const expectedValue = expectedValuesMap[riskBehaviour];
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
	riskBehaviour: RiskBehaviour;
	basisAssetBalance: number;
	targetAssetBalance: number;
	price: number;
	commission: number;
	decision: TradingDecision;
};

type DetectIsTradeAvailabelOptions = {
	basisAssetBalance: number;
	targetAssetBalance: number;
	price: number;
	quantity: number;
	decision: TradingDecision;
};

export enum RiskBehaviour {
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
	riskBehaviour: RiskBehaviour;
	price: number;
	decision: TradingDecision;
};

type GetQuantityOptions = {
	riskBehaviour: RiskBehaviour;
	basisAssetBalance: number;
	targetAssetBalance: number;
	price: number;
	commission: number;
	decision: TradingDecision;
};

export { SpotRiskManager };
