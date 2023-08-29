# remote-input-web-client

### Description
This is client-side implementation for other [**project**](https://github.com/kukumberman/unity-remote-input-project) (highly recommended to read it first).

### How it works 
- It uses [**MediaPipe**](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) solution to detect your hand.
- It connects to the running instance of **WebSocket Server** on port **7000** and sends corresponding messages.

### Known issues
- In order to send correct position - defined screen resolution in pixels should be the same as yours **Game View** tab (or something else if you use it ouside **Unity Engine**), just fetch dynamically instead of hardcoded value [here](./index.js#L41).
