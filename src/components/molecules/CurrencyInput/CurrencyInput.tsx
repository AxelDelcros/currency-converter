import { useCallback, useEffect, useState } from "react"
import { getCleanValue, getValueConversion } from "../../../utils/format"
import Container from "../../atoms/Container/Container"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons/faArrowRightLong"
import { CurrencyInputProps } from "./CurrencyInput.types"
import Switch from "../../atoms/Switch/Switch"

const CurrencyInput = ({
  currentRate,
  className,
  handleSaveConversion,
}: CurrencyInputProps) => {
  const [isUsdToEur, setIsUsdToEur] = useState(false)

  const [currentValue, setCurrentValue] = useState("0.00")
  const [convertedValue, setConvertedValue] = useState("0.00")

  const handleChangeValue = useCallback(
    (value: string) => {
      const newValuePrecision = getValueConversion(
        value,
        currentRate,
        isUsdToEur
      )
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

  const handleSwitchUsdToEur = (
    newIsUsdToEur: boolean,
    newInputValue: string
  ) => {
    setCurrentValue(newInputValue)
    setIsUsdToEur(newIsUsdToEur)
  }

  const saveConversion = () => {
    const currentConversion = getValueConversion(
      currentValue,
      currentRate,
      isUsdToEur
    )
    handleSaveConversion(currentValue, currentConversion, isUsdToEur)
  }

  useEffect(() => {
    if (currentValue) {
      const newConversion = getValueConversion(
        currentValue,
        currentRate,
        isUsdToEur
      )
      setConvertedValue(newConversion)
    } else {
      setConvertedValue("0.00")
    }
  }, [currentRate, currentValue, isUsdToEur])

  return (
    <Container label="Currency converter" className={className}>
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
        <div>
          <button
            onClick={saveConversion}
            className="px-3 py-1 my-4 bg-green-950 text-white rounded-lg"
          >
            Save conversion
          </button>
        </div>
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
  )
}

export default CurrencyInput
