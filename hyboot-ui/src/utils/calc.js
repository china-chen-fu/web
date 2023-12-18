// 浮点型 加法 实现,也同时支持整形相加
function addFloat () {
  // 取参数的最小值，拿到最小值计算 最小值的 小数点后的 位数 来获取倍数
  if (!arguments) {
    return undefined;
  }
  var minVal = Math.min(...arguments).toString(); // 取最小值
  var minValBs = 1; // 倍数 
  var jsValLength = 0;// 计算位数
  if (minVal.indexOf('.') === 1) {
    // 取最小值小数位数
    jsValLength = minVal.split('.')[1].length > 0 ? minVal.split('.')[1].length : 0;
  }
  var maxVal = Math.max(...arguments).toString(); // 取最大值
  if (maxVal.indexOf('.') === -1 && maxVal.length > jsValLength) {
    jsValLength = maxVal.length;
  }
  minValBs = Math.pow(10, jsValLength);// 幂运算 计算倍数

  // 循环参数，把参数都*100 然后再相加。
  // 循环完成后，把 整形部分的sum值 再除以 刚刚的倍数值
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    var _v = arguments[i];
    var _vStr = arguments[i].toString();
    var _vBsc = 1;
    if (_vStr.indexOf('.') === 1) {
      var _vInt = parseInt(_vStr.replace('.', ''));
      // 取最小值小数位数
      var _vLength = _vStr.split('.')[1].length > 0 ? _vStr.split('.')[1].length : 0;
      // 倍数差，就是当前浮点数要乘以的倍
      var _vBs = Math.pow(10, jsValLength - _vLength);
      sum += _vInt * _vBs;
    } else {
      var _vLength = _vStr.length > 1 ? _vStr.length : 0;
      // 倍数差，就是当前浮点数要乘以的倍
      var _vBs = Math.pow(10, jsValLength);
      sum += _v * _vBs;
    }
  }
  return sum / minValBs;
}

export default addFloat;