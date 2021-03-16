// 获取唯一标识
export function uuid() {
  return Math.random()
    .toString(36)
    .substr(3, 10);
}
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
