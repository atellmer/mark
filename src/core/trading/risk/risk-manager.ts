import { TradingDecision } from '@core/trading/strategy';
import { Deal } from '@core/trading/primitives';

abstract class RiskManager {
	protected riskStyle: RiskStyle;
	protected initialBalance = 0;
	protected currentBalance = 0;
	protected deals: Array<Deal> = [];

	constructor(options: RiskManagerOptions) {
		const { riskStyle, initialBalance } = options;

		this.riskStyle = riskStyle;
		this.initialBalance = initialBalance;
		this.currentBalance = initialBalance;
	}

	public abstract getAvailableRisk(tick: number, decision: TradingDecision): Promise<GetAvailableRisk>;

	public static getRiskFactor(riskStyle: RiskStyle): number {
		const map = {
			[RiskStyle.AGGRESIVE]: 1 / 4,
			[RiskStyle.CONSERVATIVE]: 1 / 3,
		};

		return map[riskStyle];
	}

	public static getOrderAmount(balance: number, riskStyle: RiskStyle): number {
		const map = {
			[RiskStyle.AGGRESIVE]: 5,
			[RiskStyle.CONSERVATIVE]: 2,
		};
		const percent = map[riskStyle];

		return (balance / percent) * 100;
	}

	public static getStopLoss(options: GetStopLossOptions): number {
		const { amount, decision, tick, riskStyle } = options;
		const riskAmount = amount * RiskManager.getRiskFactor(riskStyle);
		const value = decision === TradingDecision.BUY ? tick - riskAmount : tick + riskAmount;

		return value;
	}

	public static getTakeProfit(options: GetTakeProfitOptions): number {
		const { amount, decision, tick, riskStyle } = options;
		const riskAmount = amount * RiskManager.getRiskFactor(riskStyle);
		const value = decision === TradingDecision.BUY ? tick + riskAmount : tick - riskAmount;

		return value;
	}
}

type RiskManagerOptions = {
	riskStyle: RiskStyle;
	initialBalance: number;
};

type GetStopLossOptions = {
	amount: number;
	tick: number;
	decision: TradingDecision;
	riskStyle: RiskStyle;
};

type GetTakeProfitOptions = {
	amount: number;
	tick: number;
	decision: TradingDecision;
	riskStyle: RiskStyle;
};

export type GetAvailableRisk = {
	amount: number;
	stopLoss: number;
	takeProfit: number;
};

export enum RiskStyle {
	AGGRESIVE = 'aggresive',
	CONSERVATIVE = 'conservative',
}

export { RiskManager };
