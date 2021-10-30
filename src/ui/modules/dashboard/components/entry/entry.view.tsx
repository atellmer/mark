import React from 'react';

import { Box } from '@ui/kit/box';
import { PriceTemperature } from '../price-temperature';
import { FairValueDeviation } from '../fair-value-deviation';
import { FairValueBands } from '../fair-value-bands';
import { Risk } from '../risk';
import { MacroCycleHarmony } from '../macro-cycle-harmony';

export type DashboardEntryProps = {};

const DashboardEntry: React.FC<DashboardEntryProps> = props => {
	return (
		<Box>
			<Risk />
		</Box>
	);
};

export default DashboardEntry;
