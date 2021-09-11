import moment from 'moment';

const BASE_TIME_FORMAT = 'DD-MM-YYYY hh:mm:ss';

function convertUnixTimeToTime(unixTimestamp: number) {
	return moment(new Date(unixTimestamp * 1000)).format(BASE_TIME_FORMAT);
}

function getUnixTime(): number {
	return moment().unix();
}

export { convertUnixTimeToTime, getUnixTime };
