import moment from "moment";

export function toMomentFormat(stringDate: string | null): string {
    let dateTimeFormat: string = 'DD.MM.YYYY HH:mm:ss';
    let dateFormat: string = 'DD.MM.YYYY';

    if (stringDate == null)
        return '';

    return moment(stringDate).format(dateTimeFormat);
}