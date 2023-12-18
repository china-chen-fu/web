const toThousand = function (num) {
  // let result = '', counter = 0;
  // num = (num || 0).toString();
  // for (let i = num.length - 1; i >= 0; i--) {
  //   counter++;
  //   result = num.charAt(i) + result;
  //   if (!(counter % 3) && i != 0) { result = ',' + result; }
  // }
  // return result;

  // if (isNaN(num))//如果传过来的不是数字类型就赋值为0
  //   num = "0";
  // //判断是否为负数的标记
  // let sign = (num == (num = Math.abs(num)));
  // //对小数部分四舍五入
  // num = Math.floor(num * 100 + 0.50000000001);
  // let cents = num % 100;
  // num = Math.floor(num / 100).toString();
  // // 保留两位小数，如果小数部分只有一位则前面要加0
  // if (cents < 10)
  //   cents = "0" + cents;
  // let len = num.length;
  // let str = "";
  // for (let i = len - 1; i >= 0; i--) {
  //   str = num.charAt(i) + str
  //   if (!(i % 3) && i)
  //     str = "," + str;
  // }
  // num = str;
  // //三目运算符判断是否为负数
  // return (((sign) ? '' : '-') + num + '.' + cents);

  let num1 = num.toString();
  let re = /\d{1,3}(?=(\d{3})+$)/g;
  let n1 = num1.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) { return s1.replace(re, "$&,") + s2; });
  return n1;
}

export default toThousand