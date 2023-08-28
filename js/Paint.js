export class Paint {
  /**
   *
   * @param { CanvasRenderingContext2D } ctx
   */
  constructor(ctx) {
    this.ctx = ctx
    this.color = "black"
    this.lineWidth = 5
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  fillCircle(x, y, radius) {
    this.ctx.fillStyle = this.color
    const circle = new Path2D()
    circle.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.fill(circle)
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  strokeCircle(x, y, radius) {
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = this.lineWidth
    const circle = new Path2D()
    circle.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.stroke(circle)
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  strokeRect(x, y, width, height) {
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeRect(x, y, width, height)
  }

  /**
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  line(x1, y1, x2, y2) {
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = this.lineWidth
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.closePath()
    this.ctx.stroke()
  }

  fill() {
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }
}
