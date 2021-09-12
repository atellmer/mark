import { Deal, OrderDirection } from '@core/trading/primitives';
import {
	SpotRiskManager,
	SpotRiskManagerConstructor,
	CalculateRiskParametersOptions,
	RiskParameters,
} from './risk-manager';

type TestSpotRiskManagerConstructor = {
	basisAssetBalance: number;
} & SpotRiskManagerConstructor;

class TestSpotRiskManager extends SpotRiskManager {
	constructor(options: TestSpotRiskManagerConstructor) {
		const { basisAssetBalance, ...rest } = options;

		super(rest);
		this.basisAssetBalance = basisAssetBalance;
	}

	public calculateRiskParameters(options: CalculateRiskParametersOptions): Promise<RiskParameters> {
		return new Promise<RiskParameters>(resolve => {
			const { price, decision } = options;
			const riskBehaviour = this.riskBehaviour;
			const basisAssetBalance = this.basisAssetBalance;
			const targetAssetBalance = this.targetAssetBalance;
			const comission = this.comission;
			const risk = SpotRiskManager.getRiskParameters({
				riskBehaviour,
				basisAssetBalance,
				targetAssetBalance,
				price,
				comission,
				decision,
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
		const basisAssetBalance = this.basisAssetBalance;
		const targetAssetBalance = this.targetAssetBalance;
		const newBasisAssetBalance = basisAssetBalance + amount * q * -1 || 0;
		const newTargetAssetBalance = targetAssetBalance + quantity * q || 0;

		this.basisAssetBalance = newBasisAssetBalance;
		this.targetAssetBalance = newTargetAssetBalance;
	}

	public getCurrentBasisAssetBalance(price: number): Promise<number> {
		return new Promise<number>(resolve => {
			const balance = this.basisAssetBalance + this.targetAssetBalance * price;

			resolve(balance);
		});
	}
}

export { TestSpotRiskManager };
