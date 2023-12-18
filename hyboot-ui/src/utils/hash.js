/**
 * Hash 哈希值
 */
export function HashCode(hashLength) {
  // 默认长度 15
  return (
    // "_" +
    Array.from(Array(Number(hashLength) || 15), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("")
  );
}
