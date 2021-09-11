import { TradingDecision } from '@core/trading/strategy';
import { RiskManager, GetAvailableRisk } from './risk-manager';

class ExchangeRiskManager extends RiskManager {
	public getAvailableRisk(tick: number, decision: TradingDecision): Promise<GetAvailableRisk> {
		return new Promise<GetAvailableRisk>(resolve => resolve(null));
	}
}

export { ExchangeRiskManager };
