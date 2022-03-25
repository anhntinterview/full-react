export const getParamFromUrl = (str: string, keyword: string) =>
    str
        .substring(1)
        .split('&' || '&amp;')
        .filter((item) => !item.indexOf(keyword))[0]
        .split('=')[1];
export const convertHashParamObjFromUrl = (str: string) => {
    const params: { [key: string]: string } = {};
    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while ((m = regex.exec(str.substring(1)))) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
};
export const hashCode = (str: string) => {
    const result = [];
    const charactersLength = str.length;
    for (let i = 0; i < 10; i++) {
        result.push(str.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
};
export function genClassNames(inputs: { [key: string]: boolean }): string {
    const outputs: string[] = [];
    Object.keys(inputs).forEach((key: string) => {
        if (key.length > 0 && inputs[key]) {
            outputs.push(key);
        }
    });
    return outputs.join(' ');
}

export function isValidURL(str) {
    var pattern = new RegExp(
        '^((http(s)?:)?\\/\\/)' + // protocol
            '(?:\\S+(?::\\S*)?@)?' + // authentication
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locater
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}
