function dateFormat(dateData: Date | string) {
    const date: Date = new Date(dateData);
    const y: string | number = date.getFullYear()
    let m: string | number = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d: string | number = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let hh: string | number = date.getHours()
    hh = hh < 10 ? ('0' + hh) : hh
    let mm: string | number = date.getMinutes()
    mm = mm < 10 ? ('0' + mm) : mm
    let ss: string | number = date.getSeconds()
    ss = ss < 10 ? ('0' + ss) : ss
    const time = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    return time
}

function timeFormat(dateData: Date | string) {
    const date: Date = new Date(dateData);
    const y: string | number = date.getFullYear()
    let m: string | number = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d: string | number = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let hh: string | number = date.getHours()
    hh = hh < 10 ? ('0' + hh) : hh
    let mm: string | number = date.getMinutes()
    mm = mm < 10 ? ('0' + mm) : mm
    const time = y + '-' + m + '-' + d + ' ' + hh + ':' + mm
    return time
}

function dateFormatDate(dateData: Date | string) {
    const date: Date = new Date(dateData);
    const y: string | number = date.getFullYear()
    let m: string | number = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d: string | number = date.getDate()
    d = d < 10 ? ('0' + d) : d
    const fdate = y + '-' + m + '-' + d
    return fdate

} function dateFormatShortDate(dateData: Date | string) {
    const date: Date = new Date(dateData);
    const y: string | number = date.getFullYear()
    let m: string | number = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d: string | number = date.getDate()
    d = d < 10 ? ('0' + d) : d
    const fdate = String(y).slice(-2) + '' + m + '' + d
    return fdate
}



function dateFormatTime(dateData: Date | string) {
    const date: Date = new Date(dateData);
    const hh: string | number = date.getHours()
    const mm: string | number = date.getMinutes()
    const ss: string | number = date.getSeconds()
    const fTime = hh + ':' + mm + ':' + ss
    return fTime
}

function dateRenew(dateData: Date, nn: number, dd: number) {
    const xx: number = parseInt(nn / 12 + '');
    const rr: number = Math.round(nn % 12);
    let time: string | Date = new Date(dateData);
    const date: Date = new Date(dateData);
    let y: string | number = date.getFullYear() + xx;
    let m: string | number = date.getMonth() + 1 + rr;
    if (m <= 0) {
        m = m + 12;
        y = y - 1;
    }
    if (m >= 13) {
        m = m - 12;
        y = y + 1;
    }
    let d: string | number = date.getDate();
    const ee: string | number = new Date(y, m, 0).getDate();
    if (d > ee) {
        d = ee;
    }
    m = m < 10 ? ('0' + m) : m;
    d = d < 10 ? ('0' + d) : d;
    if (dd == 0) {
        time = y + '-' + m + '-01' + ' ' + '00:00:00';
    }
    if (dd == 1) {
        time = y + '-' + m + '-' + d + ' ' + '23:59:59';
    }
    if (dd == 2) {
        time = y + '-' + m + '-' + d;
    }
    return time
};

function numberToDate(days: number) {
    const startDate = new Date(1900, 0, 1);
    startDate.setDate(startDate.getDate() + days - 2);
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    const day = startDate.getDate();
    const dateString = year + "-" + month.toString().padStart(2, "0") + "-" + day.toString().padStart(2, "0");
    return dateString
}

export default { dateFormat, timeFormat, dateFormatDate, dateFormatShortDate, dateFormatTime, dateRenew, numberToDate }
