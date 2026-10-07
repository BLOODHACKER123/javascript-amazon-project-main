import {formatCurrency} from "../scripts/utils/money.js";

console.log('test suite: format currency')

console.log('# work with cents');

if(formatCurrency(2095) === '20.95'){
    console.log('passed');
}else{
    console.log('failled');
}

console.log('# work with zero')

if(formatCurrency(0) === '0.00'){
    console.log('passed');
}else{
    console.log('failled');
}

console.log('# round up to nearest cent')

if(formatCurrency(2000.5) === '20.01'){
    console.log('passed');
}else{
    console.log('failled');
}


if(formatCurrency(2000.4) === '20.00'){
    console.log('passed');
}else{
    console.log('failled');
}

