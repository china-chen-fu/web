/**
 * arr： 要去重的数组
 * props： props是key 根据props的值（一个或多个，不传props则按照基本数据类型来去重） 对对象数组的属性进行过滤
 *
 */
function deduplicate(arr, props = []) {
  if (!Array.isArray(arr)) {
    throw new TypeError("传入的第一个参数必须是数组");
  }
  if (arr.length === 0) {
    return arr;
  }
  const seen = new Set();
  const result = [];
  arr.forEach((item) => {
    const key = props.length ? props.map((prop) => item[prop]).join("|") : item;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  });
  return result;
}

export default deduplicate;
