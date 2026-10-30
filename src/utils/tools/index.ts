import {ElMessage, ElNotification} from 'element-plus';

export default {
  /**
   * 成功 Message 提示
   * @param msg 提示信息
   */
  successMessage(msg: string): void {
    ElMessage({
      message: msg,
      type: 'success',
      plain: true,
    });
  },
  /**
   * 失败 Message 提示
   * @param msg 提示信息
   */
  failMessage(msg: string): void {
    ElMessage({
      message: msg,
      type: 'error',
      plain: true,
    });
  },
  /**
   * 成功 Notification 提示
   * @param msg 提示信息
   */
  successNotification(msg: string): void {
    ElNotification({
      message: msg,
      type: 'success',
    })
  },
  /**
   * 失败 Notification 提示
   * @param msg 提示信息
   */
  failNotification(msg: string): void {
    ElNotification({
      message: msg,
      type: 'error',
    })
  },
  /**
   * 储存数据到本地
   * @param key 键
   * @param value 值
   */
  setLocalStorage(key: string, value: unknown): void {
    // 如果是对象或数组，转换为 JSON 字符串
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    }
    // 如果是字符串，直接存储
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    }
    // 如果是布尔值或数字，直接存储
    if (typeof value === 'boolean' || typeof value === 'number') {
      localStorage.setItem(key, String(value));
    }
    // 如果是 null 或 undefined，存储为字符串 'null' 或 'undefined'
    if (value === null) {
      localStorage.setItem(key, 'null');
    } else if (value === undefined) {
      localStorage.setItem(key, 'undefined');
    }
  },
  /**
   * 获取本地数据
   * @param key 键
   * @returns 值
   */
  getLocalStorage(key: string): unknown {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    try {
      // 尝试能不能转回原始数据类型
      return JSON.parse(value);
    } catch {
      // 如果解析失败，直接返回字符串
      return value
    }
  },
}
