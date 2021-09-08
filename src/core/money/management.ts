import { exchangeApi } from '@core/api';
import { Price } from '../market';
import { TradingDecision } from '../strategy';

class MoneyManagement {
	private tactics: RiskTactics;

	constructor(tactics: RiskTactics) {
		this.tactics = tactics;
	}

	public static getRiskFactor(tactics: RiskTactics) {
		const map = {
			[RiskTactics.AGGRESIVE]: 1 / 4,
			[RiskTactics.CONSERVATIVE]: 1 / 3,
		};

		return map[tactics];
	}
	public static getOrderAmount(balance: number, tactics: RiskTactics) {
		const map = {
			[RiskTactics.AGGRESIVE]: 50,
			[RiskTactics.CONSERVATIVE]: 100,
		};
		const factor = map[tactics];

		return balance / factor;
	}

	public static getStopLoss(options: GetStopLossOptions): number {
		const { amount, decision, price, tactics } = options;
		const riskAmount = amount * MoneyManagement.getRiskFactor(tactics);
		const value = decision === TradingDecision.BUY ? price.close - riskAmount : price.close + riskAmount;

		return value;
	}

	public static getTakeProfit(options: GetTakeProfitOptions): number {
		const { amount, decision, price, tactics } = options;
		const riskAmount = amount * MoneyManagement.getRiskFactor(tactics);
		const value = decision === TradingDecision.BUY ? price.close + riskAmount : price.close - riskAmount;

		return value;
	}

	getOrderParameters(price: Price, decision: TradingDecision): Promise<GetOrderParameters> {
		return new Promise<GetOrderParameters>(async resolve => {
			const balance = await exchangeApi.fetchAccountBalance({});
			const amount = MoneyManagement.getOrderAmount(balance, this.tactics);
			const stopLoss = MoneyManagement.getStopLoss({ amount, price, decision, tactics: this.tactics });
			const takeProfit = MoneyManagement.getTakeProfit({ amount, price, decision, tactics: this.tactics });

			resolve({
				amount,
				stopLoss,
				takeProfit,
			});
		});
	}
}

export type GetStopLossOptions = {
	amount: number;
	price: Price;
	decision: TradingDecision;
	tactics: RiskTactics;
};

export type GetTakeProfitOptions = {
	amount: number;
	price: Price;
	decision: TradingDecision;
	tactics: RiskTactics;
};

export type GetOrderParameters = {
	amount: number;
	stopLoss: number;
	takeProfit: number;
};

export enum RiskTactics {
	AGGRESIVE = 'aggresive',
	CONSERVATIVE = 'conservative',
}

export { MoneyManagement };
