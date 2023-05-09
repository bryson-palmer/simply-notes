export const removeFromArray = (idsToRemove, prevArray) => {
  if (!Array.isArray(idsToRemove) || !Array.isArray(prevArray)) return

  return prevArray.filter(({ id }) => {
    return !idsToRemove.includes(id)
  })
}