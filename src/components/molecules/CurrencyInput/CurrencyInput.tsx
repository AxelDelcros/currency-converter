import { useCallback, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons/faArrowRightLong"

import Container from "../../atoms/Container/Container"
import Input from "../../atoms/Input/Input"
import Switch from "../../atoms/Switch/Switch"

import { getCleanValue, getValueConversion } from "../../../utils/format"

import { CurrencyInputProps } from "./CurrencyInput.types"

const MAX_PERCENTAGE_RATE_DIFF = 0.02

const CurrencyInput = ({
  currentRate,
  className,
  handleSaveConversion,
}: CurrencyInputProps) => {
  const [hasFixedRate, setHasFixedRate] = useState(false)
  const [fixedRate, setFixedRate] = useState<string>("1.1")
  const [isUsdToEur, setIsUsdToEur] = useState(false)
  const [currentValue, setCurrentValue] = useState("0.00")
  const [convertedValue, setConvertedValue] = useState("0.00")

  const isFixedRateOverMaxDiff =
    Math.abs(currentRate - parseFloat(fixedRate)) > MAX_PERCENTAGE_RATE_DIFF

  const handleChangeValue = useCallback(
    (value: string) => {
      const newValuePrecision = getValueConversion(
        value,
        currentRate,
        isUsdToEur,
        fixedRate,
        hasFixedRate,
        isFixedRateOverMaxDiff
      )
      setConvertedValue(newValuePrecision)
    },

    [currentRate, fixedRate, hasFixedRate, isFixedRateOverMaxDiff, isUsdToEur]
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

  const handleUseFixedRate = (checked: boolean) => {
    setHasFixedRate(checked)
  }
  const handleChangeFixedRate = (newFixedRate: string) => {
    if (newFixedRate === "") {
      setFixedRate("")
      return
    }
    const newValue = getCleanValue(newFixedRate)?.toString() || ""
    setFixedRate(newValue)
  }

  const saveConversion = () => {
    const currentConversion = getValueConversion(
      currentValue,
      currentRate,
      isUsdToEur,
      fixedRate,
      hasFixedRate,
      isFixedRateOverMaxDiff
    )
    const cleanFixedRate = parseFloat(getCleanValue(fixedRate)) || 0
    const rateUsed =
      hasFixedRate && !isFixedRateOverMaxDiff ? cleanFixedRate : undefined
    handleSaveConversion(currentValue, currentConversion, isUsdToEur, rateUsed)
  }

  useEffect(() => {
    if (currentValue) {
      const newConversion = getValueConversion(
        currentValue,
        currentRate,
        isUsdToEur,
        fixedRate,
        hasFixedRate,
        isFixedRateOverMaxDiff
      )
      setConvertedValue(newConversion)
    } else {
      setConvertedValue("0.00")
    }
  }, [
    currentRate,
    currentValue,
    fixedRate,
    hasFixedRate,
    isFixedRateOverMaxDiff,
    isUsdToEur,
  ])

  return (
    <Container label="Currency converter" className={className}>
      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <h3>Current real rate:</h3>
          {currentRate}
        </div>
        <div>
          <label className="flex items-center hover:cursor-pointer w-auto">
            <input
              checked={hasFixedRate}
              onChange={(event) => handleUseFixedRate(event.target.checked)}
              type="checkbox"
              className="me-2"
            />
            Use a fixed rate
          </label>

          {hasFixedRate && (
            <Input
              value={fixedRate || ""}
              onChange={handleChangeFixedRate}
              label="Fixed rate"
            />
          )}
          {hasFixedRate && isFixedRateOverMaxDiff && (
            <p className="flex flex-col">
              <span className="italic">
                The fixed rate is over {MAX_PERCENTAGE_RATE_DIFF * 100}%
                different.
              </span>
              <span className="italic">We will use the real rate instead</span>
            </p>
          )}
        </div>
        <label className="flex gap-4 items-center">
          <Input
            value={currentValue}
            label={<div>{isUsdToEur ? "USD" : "EUR"}</div>}
            onChange={handleChangeCurrentValue}
          />
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
