import React from 'react';

import { PriceTemperature } from '../price-temperature';
import { FairValueDeviation } from '../fair-value-deviation';

export type DashboardEntryProps = {};

const DashboardEntry: React.FC<DashboardEntryProps> = props => {
	return <FairValueDeviation />;
};

export default DashboardEntry;
