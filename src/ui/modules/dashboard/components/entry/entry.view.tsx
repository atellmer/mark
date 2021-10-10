import React from 'react';

import { Box } from '@ui/kit/box';
import { PriceTemperature } from '../price-temperature';
import { FairValueDeviation } from '../fair-value-deviation';
import { FairValueBands } from '../fair-value-bands';
import { CycleHarmony } from '../cycle-harmony';
import { MacroCycleHarmony } from '../macro-cycle-harmony';

export type DashboardEntryProps = {};

const DashboardEntry: React.FC<DashboardEntryProps> = props => {
	return (
		<Box>
			<PriceTemperature />
			<FairValueDeviation />
			<FairValueBands />
			<CycleHarmony />
			<MacroCycleHarmony />
		</Box>
	);
};

export default DashboardEntry;
