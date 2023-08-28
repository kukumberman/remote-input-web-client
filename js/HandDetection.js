import {
  FilesetResolver,
  HandLandmarker,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0"

export class HandDetection {
  static THUMB_TIP = 4
  static INDEX_FINGER_TIP = 8
  static HAND_CONNECTIONS = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [5, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [9, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [13, 17],
    [0, 17],
    [17, 18],
    [18, 19],
    [19, 20],
  ]

  /**
   *
   * @param {HTMLVideoElement} video
   */
  constructor(video) {
    this.video = video
    this.handLandmarker = null
    this.results = {
      landmarks: [],
      worldLandmarks: [],
      handednesses: [],
    }
    this.debugInfo = document.createElement("pre")
    // document.body.appendChild(this.debugInfo)
  }

  async load() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    )
    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 1,
    })

    // await this.handLandmarker.setOptions({ runningMode: "VIDEO" });
  }

  update() {
    if (this.handLandmarker === null) {
      return
    }

    const startTimeMs = performance.now()

    if (this.lastVideoTime !== this.video.currentTime) {
      this.lastVideoTime = this.video.currentTime
      this.results = this.handLandmarker.detectForVideo(this.video, startTimeMs)
      this.debugInfo.textContent = JSON.stringify(this.results, null, 2)
    }
  }
}
