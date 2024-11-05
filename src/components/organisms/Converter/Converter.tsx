import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import History from "../../molecules/History/History"
import CurrencyInput from "../../molecules/CurrencyInput/CurrencyInput"
import { HistoryValue } from "../../molecules/History/History.types"

const Converter = () => {
  const [currentRate, setCurrentRate] = useState(1.1)
  const [historyValues, setHistoryValues] = useState<HistoryValue[]>([])

  const getNewRate = (prev: number, addOrSubValue: number) => {
    const newValue = prev + addOrSubValue

    // Avoid negative values
    if (newValue < 0) {
      return 0.0
    }
    return parseFloat((prev + addOrSubValue).toFixed(2))
  }

  const handleSaveConversion = (
    value: string,
    conversion: string,
    isUsdToEur: boolean,
    fixedRate?: number
  ) => {
    const getFloatConversion = parseFloat(conversion)
    const getFloatValue = parseFloat(value)
    if (isNaN(getFloatConversion) || isNaN(getFloatValue)) {
      return
    }

    setHistoryValues((prev) => {
      const newValues = [
        {
          id: uuidv4(),
          realRate: currentRate,
          valueEur: isUsdToEur ? getFloatConversion : getFloatValue,
          valueUsd: isUsdToEur ? getFloatValue : getFloatConversion,
          fixedRate,
        },
        ...prev,
      ].filter((_, index) => index < 5)
      return newValues
    })
  }

  useEffect(() => {
    const handler = setInterval(() => {
      const addOrSub = Math.floor(Math.random() * 2)
      const addOrSubValue = addOrSub === 0 ? -0.05 : 0.05
      setCurrentRate((prev) => getNewRate(prev, addOrSubValue))
    }, 3000)

    return () => {
      clearTimeout(handler)
    }
  }, [])

  return (
    <div className="flex gap-6 text-white justify-center font-light">
      <CurrencyInput
        className="flex-1"
        currentRate={currentRate}
        handleSaveConversion={handleSaveConversion}
      />
      <History className="flex-2" values={historyValues} />
    </div>
  )
}

export default Converter
