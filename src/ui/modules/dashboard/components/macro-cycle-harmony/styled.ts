import styled from 'styled-components';

const Root = styled.div`
	position: relative;
	padding: 8px;

	& .apexcharts-series[seriesName='StrongSell'] path {
		stroke: #f44336 !important;
	}

	& .apexcharts-series[seriesName='Sell'] path {
		stroke: #ff9800 !important;
	}

	& .apexcharts-series[seriesName='Buy'] path {
		stroke: #4caf50 !important;
	}

	& .apexcharts-series[seriesName='StrongBuy'] path {
		stroke: #03a9f4 !important;
	}
`;

export { Root };
