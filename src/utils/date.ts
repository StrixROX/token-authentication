export const oneYearFromNow = () => {
  return new Date(Date.now() + (365 * 24 * 60 * 60 * 1000))
}

export const thirtyDaysFromNow = () => {
  return new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
}
export const fifteenMinutesFromNow = () => {
  return new Date(Date.now() + (15 * 60 * 1000))
}