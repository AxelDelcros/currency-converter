export const getCleanValue = (rawValue: string) => {
  // Replace comma by a dot + remove all characters that are not numbers or dots
  const cleanedValue = rawValue.replace(",", ".").replace(/[^0-9.]/g, "")

  // Remove all but the first dot
  const splitValue = cleanedValue.split(".")
  if (splitValue.length < 2) {
    return cleanedValue
  }
  const newValue =
    splitValue.slice(0, 2).join(".") + splitValue.slice(2).join("")

  return newValue
}

export const getValueConversion = (
  value: string,
  currentRate: number,
  isUsdToEur: boolean
) => {
  const cleanValue = parseFloat(getCleanValue(value)) || 0
  const newValue = isUsdToEur
    ? cleanValue / currentRate
    : currentRate * cleanValue
  const newValuePrecision = newValue.toFixed(2)
  return newValuePrecision
}
