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
  isUsdToEur: boolean,
  fixedRate?: string,
  hasFixedRate?: boolean,
  isFixedRateOverMaxDiff?: boolean
) => {
  const cleanValue = parseFloat(getCleanValue(value)) || 0
  const cleanFixedRate =
    (fixedRate && parseFloat(getCleanValue(fixedRate))) || 0

  const rateToUse =
    hasFixedRate &&
    !isFixedRateOverMaxDiff &&
    cleanFixedRate &&
    !isNaN(cleanFixedRate)
      ? cleanFixedRate
      : currentRate

  const newValue = isUsdToEur ? cleanValue / rateToUse : rateToUse * cleanValue
  const newValuePrecision = newValue.toFixed(2)
  return newValuePrecision
}

export const getNewRate = (prev: number, addOrSubValue: number) => {
  const newValue = prev + addOrSubValue

  // Avoid negative values
  if (newValue < 0) {
    return 0.0
  }
  return parseFloat((prev + addOrSubValue).toFixed(2))
}
