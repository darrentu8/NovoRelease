export const toolType = {
    PEN: 1,
    ERASER: 2,
    SHAPE: 3,
    CHOOSE: 4,
    REALIA: 5,
    TEXT: 6,
    MEDIA: 7,
    MOVE: 8
}

export const shapeType = {
    LINE: 1,
    RECT: 2,
    CIRCLE: 3,
    TRIANGLE: 4
}

export const canvasIndex = {
    BOTTOM: 0,
    FRONT: 99999
}

export const realiaType = {
    RULER: 1,
    TRIANGLE: 2,
    PROTRACTOR: 3,
    COMPASS: 4
}

export const strokeType = {
    SOLID: 1,
    DASH: 2,
    DASH_LONG: 3
}

export const canvasPropertiesToInclude = ['evented', 'selectable', '_controlsVisibility', 'isRealia', 'excludeFromExport', 'isVideo', 'isAudio', 'isUrl',
    'mediaSrc', 'isLocked', 'hasBorders', 'hasControls', 'lockMovementX', 'lockMovementY', 'lockRotation', 'uuid', 'uuidSrc', 'isBackground',
    'lastModifiedUserName', 'lastModifiedTime', 'ownerName']
