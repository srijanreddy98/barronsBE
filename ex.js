let i = 0;
let count = 1;
let unit = 1;
while (i < 20) {
    console.log(count, unit);
    if(count%10 === 0) unit++;
    count++;
    i++;
}