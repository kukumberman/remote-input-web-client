export class Mathf {
  /**
   *
   * @param {number} a
   * @param {number} b
   * @param {number} t
   * @returns
   */
  static lerp(a, b, t) {
    return a + (b - a) * t
  }

  /**
   *
   * @param {number} a
   * @param {number} b
   * @param {number} value
   * @returns
   */
  static inverseLerp(a, b, value) {
    return (value - a) / (b - a)
  }

  /**
   *
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  /**
   *
   * @param {number} value
   */
  static clamp01(value) {
    return this.clamp(value, 0, 1)
  }

  /**
   *
   * @param {number} value
   * @param {number} d
   * @returns
   */
  static trim(value, d) {
    const n = 10 ** d
    return Math.floor(value * n) / n
  }

  /**
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns
   */
  static distance2d(x1, y1, x2, y2) {
    const dx = x1 - x2
    const dy = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} z1
   * @param {number} x2
   * @param {number} y2
   * @param {number} z2
   * @returns
   */
  static distance3d(x1, y1, z1, x2, y2, z2) {
    const dx = x1 - x2
    const dy = y1 - y2
    const dz = z1 - z2
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }
}
