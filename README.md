# remote-input-web-client

## Description
This is client-side implementation for other [**project**](https://github.com/kukumberman/unity-remote-input-project) (highly recommended to read it first).

## How it works 
- It uses [**MediaPipe**](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) solution to detect your hand.
- It connects to the running instance of **WebSocket Server** on port **7000** and sends corresponding messages.

## Known issues
- In order to send correct position - defined screen resolution in pixels should be the same as yours **Game View** tab (or something else if you use it ouside **Unity Engine**), just fetch dynamically instead of hardcoded value [here](./index.js#L41).

## Installation
- Clone repository
- Run local server in repository root folder (personally I use [VSCode](https://code.visualstudio.com/) and [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension)

## License

This package is licensed under the MIT License, see [LICENSE](./LICENSE) for more information.
