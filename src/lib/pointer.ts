// Hover previews follow the pointer that actually arrived, not what the browser
// reports in (hover: hover): some touchscreen laptops report no hover even with a mouse.
export const previewsOnHover = (pointerType: string, reduceMotion: boolean) => pointerType === 'mouse' && !reduceMotion
