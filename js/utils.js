/**
 *
 * @param {number} smallerWidth
 * @param {number} smallerHeight
 * @param {number} biggerWidth
 * @param {number} biggerHeight
 * @param {number} padding
 * @returns
 */
export function inscribeRectangle(
  smallerWidth,
  smallerHeight,
  biggerWidth,
  biggerHeight,
  padding = 0
) {
  const smallerAspectRatio = smallerWidth / smallerHeight
  const biggerAspectRatio = biggerWidth / biggerHeight

  let width,
    height,
    x = 0,
    y = 0

  if (biggerAspectRatio >= smallerAspectRatio) {
    // Dima: add padding
    smallerWidth -= padding * 2
    x = padding
    // Inscribe the bigger rectangle using the width as the reference
    const scalingFactor = smallerWidth / biggerWidth
    width = smallerWidth
    height = biggerHeight * scalingFactor
    y = (smallerHeight - height) / 2
  } else {
    // Dima: add padding
    smallerHeight -= padding * 2
    y = padding
    // Inscribe the bigger rectangle using the height as the reference
    const scalingFactor = smallerHeight / biggerHeight
    width = biggerWidth * scalingFactor
    height = smallerHeight
    x = (smallerWidth - width) / 2
  }

  return { x, y, width, height }
}
