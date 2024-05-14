import moment from 'moment/moment';
import EventLifeInterface from '@/Types/EventLife/EventLifeInterface';
import i18n from '@/Plugins/I18n';

export function GetEventDescription(event: EventLifeInterface): string {
	const dateTimeFormat = 'DD.MM.YYYY HH:mm:ss';
	const t = i18n.global.t;

	let duration = event.endAt?.diff(event.startAt);
	let days = event.endAt?.diff(event.startAt, 'days') ?? 0;

	let lengthText;
	if (days > 0) {
		lengthText = `${t('Length')}: ${days} ${days === 1 ? t('day') : t('days')} ${moment.utc(duration).format('HH:mm:ss')}`;
	} else {
		lengthText = `${t('Length')}: ${moment.utc(duration).format('HH:mm:ss')}`;
	}

	switch (event.state) {
		case 'Waiting':
		case 'wait':
			return `${t('Queued')}: ${event.runAt?.format(dateTimeFormat)}`;
		case 'Canceling':
		case 'canceling':
			return `${t('Start')}: ${event.startAt?.format(dateTimeFormat)} | ${t('Canceled')}: ${event.canceledAt?.format(dateTimeFormat)}`;
		case 'run':
		case 'Running':
			return `${t('Start')}: ${event.startAt?.format(dateTimeFormat)}`;
		case 'Succeeded':
		case 'succeeded':
		case 'Done':
		case 'done':
		case 'success':
		case 'Canceled':
		case 'cancel':
			if (event.startAt) {
				return `${t('Start')}: ${event.startAt?.format(dateTimeFormat)} | ${t('End')}: ${event.endAt?.format(
					dateTimeFormat,
				)} | ${lengthText}`;
			}
			return '‎ ';
		case 'Failed':
		case 'fail':
			let message = `${t('Start')}: ${event.startAt?.format(dateTimeFormat)} | ${t('End')}: ${event.endAt?.format(
				dateTimeFormat,
			)} | ${lengthText}`;
			if (event.message) {
				message += `| ${t('Message')}: ${event.message}`;
			}
			return message;
	}

	return '';
}
