import { Deal } from '@core/trading/primitives';
import { TradingDecision } from '@core/trading/strategy';

type SpotRiskManagerConstructor = {
	style: RiskStyle;
	balance: number;
	commision: number;
};

abstract class SpotRiskManager {
	private ticker: string;
	private style: RiskStyle;
	private balance = 0;
	private quantityOnBalance = 0;
	private commision = 0;

	constructor(options: SpotRiskManagerConstructor) {
		const { style, balance, commision } = options;

		this.style = style;
		this.balance = balance;
		this.commision = commision;
	}

	public abstract calculateRiskParameters(options: CalculateRiskParametersOptions): Promise<RiskParameters>;

	public abstract onDeal(deal: Deal): void;

	public getTicker(): string {
		return this.ticker;
	}

	public setTicker(ticker: string) {
		this.ticker = ticker;
	}

	public getBalance(): number {
		return this.balance;
	}

	public setBalance(balance: number) {
		this.balance = balance;
	}

	public getStyle(): RiskStyle {
		return this.style;
	}

	public setStyle(style: RiskStyle) {
		this.style = style;
	}

	public getQuantityOnBalance(): number {
		return this.quantityOnBalance;
	}

	public setQuantityOnBalance(quantityOnBalance: number) {
		this.quantityOnBalance = quantityOnBalance;
	}

	public getCommision(): number {
		return this.commision;
	}

	public setCommision(commision: number) {
		this.balance = commision;
	}

	public getCurrentBalance(price: number): number {
		return this.balance + this.quantityOnBalance * price;
	}

	public static getRiskParameters(options: GetRiskParametersOptions): RiskParameters {
		const { style, balance, commision, price, decision, quantityOnBalance } = options;
		const quantity = SpotRiskManager.getTradeQuantity({
			style,
			balance,
			price,
			decision,
			quantityOnBalance,
		});
		const canTakeRisk = SpotRiskManager.detectIsTradeAvailable({
			balance,
			commision,
			price,
			quantity,
			decision,
			quantityOnBalance,
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
		const { balance, commision, price, quantity, decision, quantityOnBalance } = options;
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
		const { style, quantityOnBalance, price, balance, decision } = options;
		const percentsMap = {
			[RiskStyle.AGGRESIVE]: 0.2,
			[RiskStyle.CONSERVATIVE]: 0.1,
		};
		const percent = percentsMap[style];
		const quantity = (balance * percent) / price;

		if (decision === TradingDecision.SELL && quantityOnBalance > 0 && quantityOnBalance < quantity) {
			return quantityOnBalance;
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
	balance: number;
	commision: number;
	quantityOnBalance: number;
	price: number;
	decision: TradingDecision;
};

type DetectIsTradeAvailabelOptions = {
	balance: number;
	commision: number;
	quantityOnBalance: number;
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
	quantityOnBalance: number;
	decision: TradingDecision;
};

export { SpotRiskManager };
