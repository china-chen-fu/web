/*
 * @Author: chenzhang 245118190@qq.com
 * @Date: 2023-01-12 14:39:25
 * @LastEditors: chenzhang 245118190@qq.com
 * @LastEditTime: 2023-01-16 14:32:29
 * @Description:
 */
// 获取assets静态资源
export default function getAssetsFile(url) {
  return new URL(`../assets/images/${url}`, import.meta.url).href;
}
