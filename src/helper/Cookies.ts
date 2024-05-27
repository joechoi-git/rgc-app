export function setCookie(name: string, value: string): void {
    const date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000); // expire in 1 days
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}

export function getCookie(name: string): string {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length == 2) {
        return parts.pop()!.split(";").shift() || "";
    }
    return "";
}

export function deleteCookie(name: string): void {
    const date = new Date();
    date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000); // expire in -1 days
    document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
}
