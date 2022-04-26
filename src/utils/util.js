
export function formatDateYYYYMMDD(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};

export function formatDateToIso(date) {
    return date.toISOString();
};