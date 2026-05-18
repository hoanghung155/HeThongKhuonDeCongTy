/*用export把方法暴露出来*/
/**
 * 设置Cookie
 * @param c_name 名称
 * @param value 值
 * @param expire 过期时间（秒）
 */
export function setCookie(c_name: string, value: string, expire: number): void {
    const date = new Date();
    date.setSeconds(date.getSeconds() + expire);
    document.cookie = `${c_name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

/**
 * 获取Cookie
 * @param c_name 名称
 * @returns 对应的Cookie值，如果不存在则返回空字符串
 */
export function getCookie(c_name: string): string {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === c_name) {
            return decodeURIComponent(value);
        }
    }
    return '';
}

/**
 * 删除Cookie
 * @param c_name 名称
 */
export function delCookie(c_name: string): void {
    setCookie(c_name, '', -1);
}