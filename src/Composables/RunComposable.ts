import moment from "moment/moment";
import RunInterface from "@/Types/RunInterface";
import i18n from "@/Plugins/I18n";
import {RunStateEnum} from "@/Types/RunStateEnum";

export function GetRunDescription(run: RunInterface): string {
    const dateTimeFormat = 'DD.MM.YYYY HH:mm:ss';
    const t = i18n.global.t;

    let duration = run.endAt?.diff(run.startAt);
    let days = run.endAt?.diff(run.startAt, 'days') ?? 0;

    let lengthText;
    if (days > 0) {
        lengthText = `${t('Length')}: ${days} ${
            days === 1 ? t('day') : t('days')
        } ${moment.utc(duration).format('HH:mm:ss')}`;
    } else {
        lengthText = `${t('Length')}: ${moment.utc(duration).format('HH:mm:ss')}`;
    }

    switch (run.runStateId) {
        case RunStateEnum.Waiting:
        case RunStateEnum.Pulling:
            return `${t('Queued')}: ${run.runAt?.format(dateTimeFormat)}`;
        case RunStateEnum.Canceling:
            return `${t('Start')}: ${run.startAt?.format(
                dateTimeFormat,
            )} | ${t('Canceled')}: ${run.canceledAt?.format(
                dateTimeFormat,
            )}`;
        case RunStateEnum.Running:
            return `${t('Start')}: ${run.startAt?.format(dateTimeFormat)}`;
        case RunStateEnum.Done:
        case RunStateEnum.Canceled:
            if (run.startAt) {
                return `${t('Start')}: ${run.startAt?.format(
                    dateTimeFormat,
                )} | ${t('End')}: ${run.endAt?.format(
                    dateTimeFormat,
                )} | ${lengthText}`;
            }
            return '‎ ';
        case RunStateEnum.Failed:
            return `${t('Start')}: ${run.startAt?.format(
                dateTimeFormat,
            )} | ${t('End')}: ${run.endAt?.format(
                dateTimeFormat,
            )} | ${lengthText}`;
    }

    return '';
}