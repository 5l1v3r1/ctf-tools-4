var base64 = require('js-base64').Base64;
var base32 = require('hi-base32');
var base36 = require('base36');
var base58 = require('base58');
var base62 = require('base62');
var base91 = require('./base91');
var base85 = require('./base85');

function base64encode(content) {
    return base64.encode(content);
}
function base64decode(content){
    return base64.decode(content);
}
function base32encode(content) {
    return base32.encode(content);
}
function base32decode(content) {
    return base32.decode(content);
}
function base16encode(content) {
    return Buffer.from(content).toString('hex').toUpperCase();
}
function base16decode(content) {
    return Buffer.from(content,'hex').toString();
}
function base36encode(content) {
    return base36.base36encode(content);
}
function base36decode(content) {
    return base36.base36decode(content);
}
function base58encode(content) {
    return base58.int_to_base58(content);;
}
function base58decode(content) {
    return base58.base58_to_int(content);
}
function base62encode(content) {
    return base62.encode(content);
}
function base62decode(content) {
    return base62.decode(content);
}
function base91encode(content) {
    return base91.encode(content);
}
function base91decode(content) {
    return base91.decode(content).toString();
}
function base92_chr(val) {
    if(val < 0 || val >= 91){
        throw "val must be in [0,91)";
    }
    if(val == 0){
        return '!';
    }
    else if (val <= 61){
        return String.fromCharCode('#'.charCodeAt() + val - 1);
    }
    else{
        return String.fromCharCode('a'.charCodeAt() + val - 62);
    }
}
function base92_ord(val) {
    var num = val.charCodeAt()
    if(val == '!'){
        return 0;
    }
    else if('#'.charCodeAt() <= num && num <= '_'.charCodeAt()){
        return num - '#'.charCodeAt() + 1;
    }
    else if('a'.charCodeAt() <= num && num <= '}'.charCodeAt()){
        return num - 'a'.charCodeAt() + 62;
    }
    else{
        throw 'val is not a base92 character';
    }
}
function base92encode(content) {
    if(content==""){
        return '~';
    }
    var bitstr = '';
    var bitfirst = '';
    while(bitstr.length < 13 && content){
        bitfirst = parseInt(content[0].charCodeAt()).toString(2);
        if(bitfirst.length < 8){
            bitfirst = Array(8-bitfirst.length+1).join('0') + bitfirst;
        }else if (bitfirst.length > 8){
            throw 'error occured in base92encode';
        }
        bitstr += bitfirst;
        content = content.substr(1)
    }
    var resstr = '';
    while(bitstr.length > 13 || content) {
        var i = parseInt(bitstr.substr(0,13),2);
        resstr += base92_chr(parseInt(i / 91));
        resstr += base92_chr(i % 91);
        bitstr = bitstr.substr(13)
        while(bitstr.length < 13 && content){
            bitfirst = parseInt(content[0].charCodeAt()).toString(2);
            if(bitfirst.length < 8){
                bitfirst = Array(8-bitfirst.length+1).join('0') + bitfirst;
            }else if (bitfirst.length > 8){
                throw 'error occured in base92encode';
            }
            bitstr += bitfirst;
            content = content.substr(1);
        }
    }
    if(bitstr){
        if(bitstr.length < 7){
            bitstr += Array(6 - bitstr.length + 1).join('0');
            resstr += base92_chr(parseInt(bitstr,2));
        }
        else{
            bitstr += Array(13 - bitstr.length + 1).join('0');
            var i = parseInt(bitstr,2);
            resstr += base92_chr(parseInt(i / 91));
            resstr += base92_chr(i % 91);
        }
    }
    return resstr;
}
function base92decode(content) {
    var bitstr = '';
    var resstr = '';
    if(content == '~'){
        return '';
    }
    var length = parseInt(content.length/2);
    var resfirst = '';
    for(let i = 0; i < length; i++){
        var x = base92_ord(content[2*i])*91 + base92_ord(content[2*i+1]);
        resfirst = parseInt(x).toString(2);
        if(resfirst.length < 13){
            resfirst = Array(13-resfirst.length+1).join('0') + resfirst;
        }else if (resfirst.length > 13){
            throw 'error occured in base92decode';
        }
        bitstr += resfirst;
        while(8 <= bitstr.length){
            resstr += String.fromCharCode(parseInt(bitstr.substr(0,8),2));
            bitstr = bitstr.substr(8);
        }
    }
    if(content.length % 2 == 1){
        var x = base92_ord(content.substr(content.length-1));
        resfirst = parseInt(x).toString(2);
        if(resfirst.length < 6){
            resfirst = Array(6-resfirst.length+1).join('0') + resfirst;
        }else if (resfirst.length > 6){
            throw 'error occured in base92decode';
        }
        bitstr += resfirst;
        while(8 <= bitstr.length){
            resstr += String.fromCharCode(parseInt(bitstr.substr(0,8),2));
            bitstr = bitstr.substr(8);
        }
    }
    return resstr;

}
function base85encode(content) {
    return base85.encode(content);
}
function base85decode(content) {
    return base85.decode(content).toString();
}


function baseEncode(content,type){
    if(!type){
        type = "base64";
    }
    var result = "";
    try {
        switch(type)
        {
            case "base64":
                result =  base64encode(content);
                break;
            case "base32":
                result = base32encode(content);
                break;
            case "base16":
                result = base16encode(content);
                break;
            case "base36":
                result = base36encode(content);
                break;
            case "base58":
                result = base58encode(content);
                break;
            case "base62":
                result = base62encode(content);
                break;
            case "base91":
                result = base91encode(content);
                break;
            case "base92":
                result = base92encode(content);
                break;
            case "base85":
                result = base85encode(content);
                break;
        }
    }catch(err){
        console.error(err);
        console.error("base encode error");
        result = "base encode error";
    }
    return result;
}
function baseDecode(content,type){
    if(!type){
        type = "base64";
    }
    var result = "";
    try{
        switch(type)
        {
            case "base64":
                result =  base64decode(content);
                break;
            case "base32":
                result = base32decode(content);
                break;
            case "base16":
                result = base16decode(content);
                break;
            case "base36":
                result = base36decode(content);
                break;
            case "base58":
                result = base58decode(content);
                break;
            case "base62":
                result = base62decode(content);
                break;
            case "base91":
                result = base91decode(content);
                break;
            case "base92":
                result = base92decode(content);
                break;
            case "base85":
                result = base85decode(content);
                break;
        }
    }catch(err){
        console.log("base decode error");
        result = "base decode error";
    } 
    return result;
}

export {baseEncode, baseDecode}