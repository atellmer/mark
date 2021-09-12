import { SpotRiskManager, GetRiskOptions, RiskParameters } from './risk-manager';

class ExchangeSpotRiskManager extends SpotRiskManager {
	public calculateRiskParameters(options: GetRiskOptions): Promise<RiskParameters> {
		return new Promise<RiskParameters>(resolve => resolve(null));
	}
}

export { ExchangeSpotRiskManager };
