const toThousand = function (num) {
  if(num) {
    if(Number(num) > 0) {
      let num1 = num.toString();
      let re = /\d{1,3}(?=(\d{3})+$)/g;
      let n1 = num1.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) { return s1.replace(re, "$&,") + s2; });
      return n1;
    }else if(Number(num) < 0){
      let tempNum1 = Number(num);
      let tempNum = Math.abs(tempNum1);
      tempNum = tempNum.toString();
      let re = /\d{1,3}(?=(\d{3})+$)/g;
      let n1 = tempNum.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) { return s1.replace(re, "$&,") + s2; });
      return '-' + n1;
    }else if(Number(num) == 0) {
      return num
    }
  }else {
    return num
  }
}

export default toThousand