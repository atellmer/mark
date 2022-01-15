import React from 'react';

import { Box } from '@ui/kit/box';
import { PriceTemperature } from '../price-temperature';
import { FairValueDeviation } from '../fair-value-deviation';
import { FairValueBands } from '../fair-value-bands';
import { Risk } from '../risk';
import { MacroCycleHarmony } from '../macro-cycle-harmony';
import { BalancesDivergence } from '../balances-divergence';

export type DashboardEntryProps = {};

const DashboardEntry: React.FC<DashboardEntryProps> = props => {
	return (
		<Box>
			<BalancesDivergence />
			<PriceTemperature />
			<Risk />
			<FairValueDeviation />
			<FairValueBands />
			<FairValueBands logarithmic />
			<MacroCycleHarmony />
		</Box>
	);
};

export default DashboardEntry;
