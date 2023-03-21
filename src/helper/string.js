export const capitalizeFirstLetter = (string) => {
    return string.replace(/^./, string[0].toUpperCase())
}

export const getFileExt = (filePath) => {
    const index = filePath.lastIndexOf('.')
    const ext = filePath.substring(index + 1)

    return ext
}
