import { useCallback, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"

import Container from "../../atoms/Container/Container"
import Switch from "../../atoms/Switch/Switch"
import { getCleanValue, getValueConversion } from "../../../utils/format"

const Converter = () => {
  const [isUsdToEur, setIsUsdToEur] = useState(false)
  const [currentRate, setCurrentRate] = useState(1.1)
  const [currentValue, setCurrentValue] = useState("0.00")
  const [convertedValue, setConvertedValue] = useState("0.00")

  const handleChangeValue = useCallback(
    (value: string) => {
      const newValuePrecision = getValueConversion(value, currentRate)
      setConvertedValue(newValuePrecision)
    },

    [currentRate]
  )

  const handleChangeCurrentValue = (newCurrentValue: string) => {
    if (newCurrentValue === "") {
      setCurrentValue("")
      setConvertedValue("0")
      return
    }
    const newCurrentValueCleaned =
      getCleanValue(newCurrentValue)?.toString() || ""
    setCurrentValue(newCurrentValueCleaned)
    handleChangeValue(newCurrentValueCleaned)
  }

  const getNewRate = (prev: number, addOrSubValue: number) => {
    const newValue = prev + addOrSubValue

    // Avoid negative values
    if (newValue < 0) {
      return 0.0
    }
    return parseFloat((prev + addOrSubValue).toFixed(2))
  }

  const handleSwitchUsdToEur = (
    newIsUsdToEur: boolean,
    newInputValue: string
  ) => {
    setCurrentValue(newInputValue)
    setIsUsdToEur(newIsUsdToEur)
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

  useEffect(() => {
    if (currentValue) {
      const newConversion = getValueConversion(currentValue, currentRate)
      setConvertedValue(newConversion)
    } else {
      setConvertedValue("0.00")
    }
  }, [currentValue, currentRate])

  return (
    <div className="flex gap-6 text-white justify-center font-light">
      <Container label="Currency converter" className={"flex-1"}>
        <div className="flex gap-2 flex-col">
          <div className="flex gap-2">
            <h3>Current real rate:</h3>
            {currentRate}
          </div>
          <label className="flex gap-4 items-center">
            <div className="flex flex-1 gap-2 items-center">
              <input
                className={"text-black px-3 py-1"}
                value={currentValue}
                onChange={(e) => handleChangeCurrentValue(e.target.value)}
              />
              <div>{isUsdToEur ? "USD" : "EUR"}</div>
            </div>
            <div className="flex gap-3 items-center font-semibold">
              <FontAwesomeIcon icon={faArrowRightLong} />
            </div>
            <div className="flex-1">
              <span>
                {convertedValue.replace(".", ",")}{" "}
                <span>{isUsdToEur ? "EUR" : "USD"}</span>
              </span>
            </div>
          </label>
          <div className="text-center mt-4">
            <Switch
              checked={isUsdToEur}
              setActive={(newIsUsdToEur) =>
                handleSwitchUsdToEur(newIsUsdToEur, convertedValue)
              }
            />
          </div>
        </div>
      </Container>
      <Container label="History" className={"flex-2"}>
        Content
      </Container>
    </div>
  )
}

export default Converter
