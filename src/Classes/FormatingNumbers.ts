import numeral from 'numeral';

export function formatBytes(value: number): string {
    const suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let suffixIndex = 0;
    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
        value /= 1000;
        suffixIndex++;
    }
    return `${numeral(value).format('0.0')} ${suffixes[suffixIndex]}`;
}

export function formatNumber(value: number): string {
    return `${numeral(value).format('0')}`;
}

export function formatNumberWithDecimals(value: number): string {
    return `${numeral(value).format('0 0.00')}`;
}

export function formatPercent(value: number): string {
    return `${numeral(value).format('0.00')} %`;
}

export function formatPercentWithDecimals(value: number): string {
    return `${numeral(value).format('0.000')} %`;
}

export function formatCurrency(value: number): string {
    return `${numeral(value).format('0,0.00')} Kč`;
}

export function formatCurrencyWithDecimals(value: number): string {
    return `${numeral(value).format('0,0.000')} Kč`;
}

export function formatCurrencyWithDecimalsAndSign(value: number): string {
    return `${numeral(value).format('0,0.000')} Kč`;
}

export function formatCurrencyWithDecimalsAndSignWithSpace(value: number): string {
    return `${numeral(value).format('0,0.000')} Kč`;
}

export function formatShortDate(date: Date): string {
    console.log('date', typeof date, date);
    return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}

export function formatLongDate(date: Date): string {
    console.log('date', typeof date, date);
    return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}

export function formatShortDateTime(date: Date): string {
    console.log('date', typeof date, date);
    return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

export function formatLongDateTime(date: Date): string {
    console.log('date', typeof date, date);
    console.log('date', typeof date, date);
    return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

export function formatTime(date: Date): string {
    console.log('date', typeof date, date);
    return `${date.getHours()}:${date.getMinutes()}`;
}
