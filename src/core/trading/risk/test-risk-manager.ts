import { TradingDecision } from '@core/trading/strategy';
import { RiskManager, GetAvailableRisk } from './risk-manager';

class TestRiskManager extends RiskManager {
	public getCurrentBalance(): number {
		return this.currentBalance;
	}

	public setCurrentBalance(balance: number) {
		this.currentBalance = balance;
	}

	public getAvailableRisk(tick: number, decision: TradingDecision): Promise<GetAvailableRisk> {
		return new Promise<GetAvailableRisk>(resolve => {
			const currentBalance = this.currentBalance;
			const riskStyle = this.riskStyle;
			const amount = TestRiskManager.getOrderAmount(currentBalance, riskStyle);
			const stopLoss = TestRiskManager.getStopLoss({ amount, tick, decision, riskStyle });
			const takeProfit = TestRiskManager.getTakeProfit({ amount, tick, decision, riskStyle });

			resolve({
				amount,
				stopLoss,
				takeProfit,
			});
		});
	}
}

export { TestRiskManager };
