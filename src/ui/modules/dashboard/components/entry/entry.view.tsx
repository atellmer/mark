import React from 'react';

import { Box } from '@ui/kit/box';
import { PriceTemperature } from '../price-temperature';
import { FairValueDeviation } from '../fair-value-deviation';
import { FairValueBands } from '../fair-value-bands';

export type DashboardEntryProps = {};

const DashboardEntry: React.FC<DashboardEntryProps> = props => {
	return (
		<Box>
			<FairValueDeviation />
			<FairValueBands />;
		</Box>
	);
};

export default DashboardEntry;
