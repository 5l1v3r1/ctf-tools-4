var jsfuck = require('jsfuck');
var encode = jsfuck.JSFuck.encode;
var jfencode = function(data) {
    try{
        return encode(data,false);
    }catch(err){
        return err;
    }
};

var CHARS = ['false', 'true', 'undefined', 'NaN', 'Infinity',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    ' ', '!', "'", "\"", '#', '$', '%', '&', '\\', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=',
    '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
var NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var MAPPING = [];
var makePattern = function(pattern) {
    var escaped = pattern.replace(/(\(|\)|\[|\]|\!|\+)/g,'\\$1');
    return (escaped + '\\+?');
};
var fillDigits = function() {
    return (NUMBERS).forEach(function(source,index,list) {
        var encoded = encode(source,false),
            pattern = makePattern(encoded.replace(/\+\[\]$/,''));
        return MAPPING.push([source, pattern]);
    });
};
var fillChars = function() {
    return (CHARS).forEach(function(source,index,list) {
        var encoded = encode(source,false),
            pattern = makePattern(encoded);
        return MAPPING.push([source, pattern]);
    });
};
var initPatterns = function() {
    fillDigits();
    fillChars();
    return MAPPING.sort(function(a,b) {
        return (b[1].length - a[1].length);
    });
};
function jfdecode(fucked){
    try{
        var output = fucked;
        (MAPPING).forEach(function(m) {
            var pattern = new RegExp(m[1],'g');
            output = output.replace(pattern,m[0]);
        });
        return output;
    }catch(err){
        return err;
    }
}
initPatterns();

export {jfencode,jfdecode}