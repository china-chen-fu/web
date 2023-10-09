//传一个数字 大于6位可以换算成万  结束后的数字用千分号分割
import Big from "big.js";
import toThousand from "@/utils/thousand";
const patchM = (payload,fractionDigits=2) => {
  let targetNumber;
  if (Number(payload || 0)) {
    if (Number(payload) >= 100000 && Number(payload) < 100000000) {
      targetNumber = `${toThousand(Big(payload).div(10000).toFixed(fractionDigits))}万`;
    }else if(Number(payload) >= 100000000){
      targetNumber = `${toThousand(Big(payload).div(100000000).toFixed(fractionDigits))}亿`;
    } else {
      targetNumber = toThousand(Big(payload).div(1).toFixed(fractionDigits));
    }
  } else {
    targetNumber = Big(0).toFixed(fractionDigits);
  }

  return targetNumber;
};

export default patchM ;
