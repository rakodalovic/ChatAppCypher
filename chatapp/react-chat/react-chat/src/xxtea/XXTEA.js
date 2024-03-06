import { BinToAscii, AsciiToBin } from "./AsciiFunctions";
import {xorStrings} from "./CFB.js"

var DELTA = 0x9E3779B9; //Deli interval od 0 do 2^32 po zlatnom preseku

function mx(sum, y, z, p, e, k) {
    return ((z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4)) ^ ((sum ^ y) + (k[p & 3 ^ e] ^ z));
}
function toBinaryString(v, includeLength) { //binarni niz 32 bitnih celih brojeva(v) -> binarni string (result) svaki od karaktera vrednost od 0-255 ascii
    var length = v.length;
    var n = length << 2;
    if (includeLength) {
        var m = v[length - 1];
        n -= 4; //duzina stringa je na poslednjem mestu
        n = m;
    }
    for (var i = 0; i < length; i++) {
        v[i] = String.fromCharCode(
            v[i] & 0xFF, //prvi bajt
            v[i] >>> 8 & 0xFF, //drugi bajt
            v[i] >>> 16 & 0xFF, // treci bajt
            v[i] >>> 24 & 0xFF //cetvrti bajt
        );
    }
    var result = v.join('');
    if (includeLength) {
        return result.substring(0, n);
    }
    return result;
}

function toUint32Array(data, includeLength) { //string -> niz 32bitnih celih brojeva
    var length = data.length;
    var n = length >> 2; //deljenje sa 4. N je broj 32bita potrebna za predstavljanje stringa
    if ((length & 3) !== 0) { //dopuna kad ostatak pri deljenju sa 4 nije 0
        n++;
    }
    var v;
    if (includeLength) { //ako je IL true na poslednje mesto stavljamo duzinu stringa
        v = new Array(n + 1);
        v[n] = length;
    }
    else {
        v = new Array(n);
    }
    for (var i = 0; i < length; ++i) {
        v[i >> 2] |= data.charCodeAt(i) << ((i & 3) << 3); //string u niz 32bitnih blokova
    }
    return v;
}

function int32(i) {
    return i & 0xFFFFFFFF;
}


function fixk(k) {
    if (k.length < 4) k.length = 4;
    return k;
}

function encryptUint32Array(v, k) { //xxtea
    var length = v.length;
    var n = length - 1;
    var y, z, sum, e, p, q;
    z = v[n];
    sum = 0;
    for (q = Math.floor(6 + 52 / length) | 0; q > 0; --q) {
        sum = int32(sum + DELTA);
        e = sum >>> 2 & 3;
        for (p = 0; p < n; ++p) {
            y = v[p + 1];
            z = v[p] = int32(v[p] + mx(sum, y, z, p, e, k));
        }
        y = v[0];
        z = v[n] = int32(v[n] + mx(sum, y, z, n, e, k));
    }
    return v;
}

function decryptUint32Array(v, k) { //xxtea
    var length = v.length;
    var n = length - 1;
    var y, z, sum, e, p, q;
    y = v[0];
    q = Math.floor(6 + 52 / length);
    for (sum = int32(q * DELTA); sum !== 0; sum = int32(sum - DELTA)) {
        e = sum >>> 2 & 3;
        for (p = n; p > 0; --p) {
            z = v[p - 1];
            y = v[p] = int32(v[p] - mx(sum, y, z, p, e, k));
        }
        z = v[n];
        y = v[0] = int32(v[0] - mx(sum, y, z, 0, e, k));
    }
    return v;
}

function utf8Decode(bs, n) {
    if (n === undefined || n === null || (n < 0)) n = bs.length;
    if (n === 0) return '';
    if (/^[\x00-\x7f]*$/.test(bs) || !(/^[\x00-\xff]*$/.test(bs))) {
        if (n === bs.length) return bs;
        return bs.substr(0, n);
    }

}

function encrypt(data, key) {
    if (data === undefined || data === null || data.length === 0) {
        return data;
    }
    //
    return toBinaryString(encryptUint32Array(toUint32Array(data, true), fixk(toUint32Array(key, false))), false);
}

export function encryptStringXXTEA(data, key) {
    return BinToAscii(encrypt(data, key));
}

function decrypt(data, key) {
    if (data === undefined || data === null || data.length === 0) {
        return data;
    }
    
    return utf8Decode(toBinaryString(decryptUint32Array(toUint32Array(data, false), fixk(toUint32Array(key, false))), true));
}

export function decryptStringXXTEA(data, key) {
    if (data === undefined || data === null || data.length === 0) {
        return data;
    }
    return decrypt(AsciiToBin(data), key);
}

/*
//CFB KOJI RADI
var str = "pozdrav svima";
var key = "12345678";
var v= "qw";

var encrypt_data = encryptStringXXTEA(key, v);
var cfb=xorStrings(encrypt_data,str)


var decript_data = encryptStringXXTEA(key, v);
var cfbDec=xorStrings(cfb,decript_data)

console.log(cfb)
console.log(cfbDec)*/

