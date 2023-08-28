import { Paint } from "./Paint.js"
import { Mathf } from "./Mathf.js"
import { HandDetection } from "./HandDetection.js"

export class HandRenderer {
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx
    this.paint = new Paint(this.ctx)
    this.circleColor = "#FF0000"
    this.circleRadius = 2
    this.lineColor = "#00FF00"
    this.lineWidth = 2
  }

  beginFrame() {
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  render(results) {
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        this.drawHand(this.convert(landmarks))
      }
    }
  }

  endFrame() {
    this.ctx.restore()
  }

  convert(landmarks) {
    return landmarks.map((normalizedPoint) => {
      return {
        x: Mathf.lerp(0, this.ctx.canvas.width, normalizedPoint.x),
        y: Mathf.lerp(0, this.ctx.canvas.height, normalizedPoint.y),
      }
    })
  }

  drawHand(points) {
    if (points.length !== 21) {
      return
    }

    this.paint.color = this.lineColor
    this.paint.lineWidth = this.lineWidth

    HandDetection.HAND_CONNECTIONS.forEach(([startIndex, endIndex]) => {
      const startPoint = points[startIndex]
      const endPoint = points[endIndex]
      this.paint.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
    })

    this.paint.color = this.circleColor

    points.forEach((point) => {
      this.paint.fillCircle(point.x, point.y, this.circleRadius)
    })
  }

  drawInput(points, thresholdReached) {
    if (points.length !== 21) {
      return
    }

    const p1 = points[HandDetection.THUMB_TIP]
    const p2 = points[HandDetection.INDEX_FINGER_TIP]

    this.paint.color = thresholdReached ? "blue" : this.circleColor

    this.paint.lineWidth = this.lineWidth
    this.paint.strokeCircle(p1.x, p1.y, this.circleRadius * 5)
    this.paint.strokeCircle(p2.x, p2.y, this.circleRadius * 5)
    this.paint.line(p1.x, p1.y, p2.x, p2.y)
  }
}
