import moment from "moment/moment";

export function GetFormattedDateTime(date: string): string {
    const dateTimeFormat = 'DD.MM.YYYY HH:mm:ss';

    return moment(date).format(dateTimeFormat);
}

export function GetDurationText(time: number, unit: string = 'seconds'): string {
    const duration = moment.duration(time, <any>unit);
    let result = '';
    if (duration.days() > 0) {
        result += `${duration.days()} days, `;
    }

    if (duration.hours() < 10) {
        result += `0${duration.hours()}:`;
    } else {
        result += `${duration.hours()}:`;
    }

    if (duration.minutes() < 10) {
        result += `0${duration.minutes()}:`;
    } else {
        result += `${duration.minutes()}:`;
    }

    if (duration.seconds() < 10) {
        result += `0${duration.seconds()}`;
    } else {
        result += `${duration.seconds()}`;
    }

    return result;
}