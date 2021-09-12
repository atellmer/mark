import { Deal, OrderDirection } from '@core/trading/primitives';
import { SpotRiskManager, CalculateRiskParametersOptions, RiskParameters } from './risk-manager';

class TestSpotRiskManager extends SpotRiskManager {
	public calculateRiskParameters(options: CalculateRiskParametersOptions): Promise<RiskParameters> {
		return new Promise<RiskParameters>(resolve => {
			const { price, decision } = options;
			const style = this.getStyle();
			const balance = this.getBalance();
			const commision = this.getCommision();
			const quantityOnBalance = this.getQuantityOnBalance();
			const risk = SpotRiskManager.getRiskParameters({
				style,
				balance,
				commision,
				price,
				decision,
				quantityOnBalance,
			});

			resolve(risk);
		});
	}

	public onDeal(deal: Deal) {
		const quantity = deal.getQuantity();
		const direction = deal.getDirection();
		const price = deal.getPrice();
		const isBuy = direction === OrderDirection.BUY;
		const q = isBuy ? 1 : -1;
		const amount = quantity * price;
		const balance = this.getBalance();
		const quantityOnBalance = this.getQuantityOnBalance();
		const newBalance = balance + amount * q * -1 || 0;
		const newQuantityOnBalance = quantityOnBalance + quantity * q || 0;

		this.setBalance(newBalance);
		this.setQuantityOnBalance(newQuantityOnBalance);
	}
}

export { TestSpotRiskManager };
