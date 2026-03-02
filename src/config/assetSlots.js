export const animationSlot = {
  totalFrames: 118,
  folder: '/assets/animation',
  prefix: 'Hello_Format_B',
  extension: 'png',
}

export const backgroundSlot = {
  primary: '/assets/background/background.png',
}

export function getFramePath(frameNumber) {
  const safeFrame = Math.max(1, Math.min(animationSlot.totalFrames, frameNumber))
  return `${animationSlot.folder}/${animationSlot.prefix}${safeFrame}.${animationSlot.extension}`
}
