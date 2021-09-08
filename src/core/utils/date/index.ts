import moment from 'moment';

const BASE_DATE_FORMAT = 'DD-MM-YYYY';

function prettyDate(date: string) {
	return moment(date, BASE_DATE_FORMAT).format('DD.MM.YYYY');
}

export { BASE_DATE_FORMAT, prettyDate };
