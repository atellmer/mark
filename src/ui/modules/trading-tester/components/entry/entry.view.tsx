import React from 'react';

import { TradingTester } from '../tester';

export type TradingTesterEntryProps = {};

const TradingTesterEntry: React.FC<TradingTesterEntryProps> = props => {
	return <TradingTester variant='price-tracking' />;
};

export default TradingTesterEntry;
