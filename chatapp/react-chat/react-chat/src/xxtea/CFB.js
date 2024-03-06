export function xorStrings(str1, str2) {
    let result = '';
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        let xorValue = str1.charCodeAt(i) ^ str2.charCodeAt(i);
        result += String.fromCharCode(xorValue);
    }
    return result;
}