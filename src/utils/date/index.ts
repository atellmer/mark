import moment from 'moment';

const BASE_TIME_FORMAT = 'DD-MM-YYYY hh:mm:ss';

function convertUnixTimeToTime(timestamp: number) {
	return moment(new Date(getUnixFromTimestamp(timestamp))).format(BASE_TIME_FORMAT);
}

function getUnixTime(): number {
	return moment().unix();
}

function getTimestamp(value: string): number {
	return moment(value, BASE_TIME_FORMAT).unix();
}

function getUnixFromTimestamp(timestamp: number) {
	return timestamp * 1000;
}

export { convertUnixTimeToTime, getUnixTime, getTimestamp, getUnixFromTimestamp };
