import React from 'react';

import { PriceTemperature } from '../price-temperature';

export type DashboardEntryProps = {};

const DashboardEntry: React.FC<DashboardEntryProps> = props => {
	return <PriceTemperature />;
};

export default DashboardEntry;
