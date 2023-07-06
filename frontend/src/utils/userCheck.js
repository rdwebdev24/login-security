/********************************** 
function that check the strength of the usernmae

input : ROhit300@@ 
output : true ( strong )

input : Rohit30@ 
output : false ( weak )

**********************************/

export default function checkUsername(userID) {
    const specialChars = `'!"#$%&()*+,{}-./:;<=>?@][^_{|}~`
    const numbers = "0123456789";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var sp = 0 , num = 0, lw = 0 , up = 0

    if (userID.length < 8) return false;

    for(let i=0; i<userID.length; i++){
        if(specialChars.includes(userID[i])) sp++
        if(numbers.includes(userID[i])) num++;
        if(lowerCase.includes(userID[i])) lw++;
        if(upperCase.includes(userID[i])) up++;
    }

    if(num<1) return false;
    if(sp<1) return false;
    if(lw<1) return false;
    if(up<1) return false;

    return true;
  }
  
  