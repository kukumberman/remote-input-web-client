export class Connection {
  static EVENT_OPEN = "open"
  static EVENT_CLOSE = "close"
  static EVENT_ERROR = "error"
  static EVENT_MESSAGE = "message"

  /**
   *
   * @param {string | number} port
   */
  constructor(port) {
    this.port = port
    this.socket = null
    this.events = new EventTarget()
    this.url = `ws://127.0.0.1:${this.port}/`
  }

  connectAsync() {
    if (this.socket != null && this.socket.readyState == WebSocket.OPEN) {
      this.socket.close()
    }

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url)
      this.socket.addEventListener(
        Connection.EVENT_OPEN,
        () => {
          this._registerListeners()
          resolve()
          this._dispatchOpenEvent()
        },
        { once: true }
      )
      this.socket.addEventListener(
        Connection.EVENT_ERROR,
        () => {
          reject()
        },
        { once: true }
      )
    })
  }

  _registerListeners() {
    this.events = new EventTarget()

    this.socket.addEventListener("open", () => {
      this._dispatchOpenEvent()
    })

    this.socket.addEventListener("close", () => {
      this.events.dispatchEvent(new Event(Connection.EVENT_CLOSE))
    })

    this.socket.addEventListener("error", () => {
      this.events.dispatchEvent(new Event(Connection.EVENT_ERROR))
    })

    this.socket.addEventListener("message", (event) => {
      var evt = new Event(Connection.EVENT_MESSAGE)
      evt.data = event.data
      this.events.dispatchEvent(evt)
    })
  }

  _dispatchOpenEvent() {
    this.events.dispatchEvent(new Event(Connection.EVENT_OPEN))
  }

  /**
   *
   * @param {string} id
   * @param {any} data
   */
  sendMessage(id, data) {
    if (this.socket.readyState == WebSocket.OPEN) {
      const message = {
        id,
        data,
      }
      this.socket.send(JSON.stringify(message))
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  sendPosition(x, y) {
    this.sendMessage("position", {
      x,
      y,
    })
  }

  sendClick() {
    this.sendMessage("click")
  }

  sendMouseDown() {
    this.sendMessage("mousedown")
  }

  sendMouseUp() {
    this.sendMessage("mouseup")
  }
}
