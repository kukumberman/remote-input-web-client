import { HandDetection } from "./js/HandDetection.js"
import { HandRenderer } from "./js/HandRenderer.js"
import { Mathf } from "./js/Mathf.js"
import { Connection } from "./js/Connection.js"
import { inscribeRectangle } from "./js/utils.js"

const video = document.querySelector("video")
const canvasElement = document.querySelector("canvas")
const ctx = canvasElement.getContext("2d")

const connection = new Connection(7000)
const detection = new HandDetection(video)
const handRenderer = new HandRenderer(ctx)
const paint = handRenderer.paint

const config = {
  padding: 50,
  distanceThreshold: 0.02,
}

const data = {
  hand: {
    points: [],
    isActive: false,
    thresholdReached: false,
    currentDistance: 0,
  },
  renderLandmarks: false,
  renderHand: false,
  rect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  unityInstance: {
    mousePosition: {
      x: 0,
      y: 0,
    },
    remoteScreen: {
      // width: 1080,
      // height: 1920,
      width: 1920,
      height: 1080,
      swap() {
        const temp = this.width
        this.width = this.height
        this.height = temp
      },
    },
  },
}

const EMPTY_ARRAY = []

const btnReconnect = document.querySelector("#btn-reconnect")
const checkboxRenderHand = document.querySelector("#checkbox-renderHand")

btnReconnect.addEventListener("click", () => {
  tryConnect()
})

checkboxRenderHand.addEventListener("change", (event) => {
  data.renderHand = checkboxRenderHand.checked
})

const debugInfo = document.createElement("pre")
document.body.appendChild(debugInfo)

function onActiveStateChanged() {
  console.log("active", data.hand.isActive)
}

function onThresholdStateChanged() {
  console.log("pressed/released", data.hand.thresholdReached)

  if (data.hand.thresholdReached) {
    connection.sendMouseDown()
  } else {
    connection.sendMouseUp()
  }
}

function calculateDistance() {
  const p1 = detection.results.worldLandmarks[0][HandDetection.THUMB_TIP]
  const p2 = detection.results.worldLandmarks[0][HandDetection.INDEX_FINGER_TIP]
  // const distance3d = Mathf.distance3d(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
  const distance2d = Mathf.distance2d(p1.x, p1.y, p2.x, p2.y)
  return distance2d
}

function calculateInputMousePosition() {
  const cursorPoint = data.hand.points[HandDetection.THUMB_TIP]

  let x01 = Mathf.inverseLerp(data.rect.x, data.rect.x + data.rect.width, cursorPoint.x)
  let y01 = Mathf.inverseLerp(data.rect.y, data.rect.y + data.rect.height, cursorPoint.y)

  x01 = Mathf.clamp01(x01)
  y01 = Mathf.clamp01(y01)

  x01 = Mathf.trim(x01, 3)
  y01 = Mathf.trim(y01, 3)

  const screen = data.unityInstance.remoteScreen
  const position = data.unityInstance.mousePosition

  position.x = Mathf.lerp(0, screen.width, x01)
  position.y = Mathf.lerp(0, screen.height, 1 - y01)

  position.x = Math.floor(position.x)
  position.y = Math.floor(position.y)

  debugInfo.textContent = JSON.stringify(position, null, 2)
}

function calculate() {
  data.rect = inscribeRectangle(
    ctx.canvas.width,
    ctx.canvas.height,
    data.unityInstance.remoteScreen.width,
    data.unityInstance.remoteScreen.height,
    config.padding
  )

  detection.update()

  const active = detection.results.worldLandmarks.length > 0
  if (active != data.hand.isActive) {
    data.hand.isActive = active
    onActiveStateChanged()
  }

  data.hand.points = active ? handRenderer.convert(detection.results.landmarks[0]) : EMPTY_ARRAY

  if (data.hand.isActive) {
    data.hand.currentDistance = calculateDistance()
    calculateInputMousePosition()
  }

  const thresholdReached = data.hand.currentDistance < config.distanceThreshold
  if (data.hand.isActive && thresholdReached !== data.hand.thresholdReached) {
    data.hand.thresholdReached = thresholdReached
    onThresholdStateChanged()
  }
}

function render() {
  handRenderer.beginFrame()

  paint.color = "red"
  paint.lineWidth = 1
  const rect = data.rect
  paint.strokeRect(rect.x, rect.y, rect.width, rect.height)

  if (data.renderLandmarks) {
    handRenderer.render(detection.results)
  }
  if (data.renderHand) {
    handRenderer.drawHand(data.hand.points)
    handRenderer.drawInput(data.hand.points, data.hand.thresholdReached)
  }
  handRenderer.endFrame()
}

function animationFrame() {
  calculate()
  render()
  window.requestAnimationFrame(animationFrame)
}

function loadedHandler() {
  canvasElement.style.width = video.videoWidth
  canvasElement.style.height = video.videoHeight
  canvasElement.width = video.videoWidth
  canvasElement.height = video.videoHeight

  window.requestAnimationFrame(animationFrame)
}

function loadStaticVideo() {
  video.src = "./assets/Studio_Project_V1.mp4"
  video.addEventListener("loadeddata", loadedHandler)
}

async function requestWebcamera() {
  try {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })

    video.srcObject = stream
    if (video.hasAttribute("controls")) {
      video.removeAttribute("controls")
    }
    video.addEventListener("loadeddata", loadedHandler)
  } catch {
    alert("Failed to get access to camera, allow if you want to use this app.")
    window.location.reload()
  }
}

async function tryConnect() {
  try {
    await connection.connectAsync()
    connection.events.addEventListener(Connection.EVENT_OPEN, () => console.log("open"))
    connection.events.addEventListener(Connection.EVENT_CLOSE, () => console.log("close"))
    connection.events.addEventListener(Connection.EVENT_ERROR, () => console.log("error"))
    connection.events.addEventListener(Connection.EVENT_MESSAGE, (event) =>
      console.log("message", event.data)
    )
  } catch {
    alert("Failed to connect to Unity Instance, make sure it is running")
  }
}

async function main() {
  await detection.load()

  // loadStaticVideo()

  await requestWebcamera()
  await tryConnect()

  setInterval(() => {
    connection.sendPosition(data.unityInstance.mousePosition.x, data.unityInstance.mousePosition.y)
  }, 50)
}

main()
