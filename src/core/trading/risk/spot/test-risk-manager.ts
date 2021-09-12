import { SpotRiskManager, GetRiskOptions, RiskParameters } from './risk-manager';

class TestSpotRiskManager extends SpotRiskManager {
	public calculateRiskParameters(options: GetRiskOptions): Promise<RiskParameters> {
		return new Promise<RiskParameters>(resolve => {
			const { ticker, price, decision } = options;
			const style = this.style;
			const balance = this.balance;
			const commision = this.commision;
			const quantitiesMap = this.quantitiesMap;
			const risk = SpotRiskManager.getRiskParameters({
				ticker,
				style,
				balance,
				commision,
				price,
				decision,
				quantitiesMap,
			});

			resolve(risk);
		});
	}
}

export { TestSpotRiskManager };
