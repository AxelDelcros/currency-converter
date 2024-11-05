import { describe, expect, it } from "vitest"
import { getCleanValue, getNewRate, getValueConversion } from "./format"

describe("format", () => {
  describe("getCleanValue", () => {
    it("should return a string without any other character than numbers and dot", () => {
      // Given
      const input = "1234FOOBAR"

      // When
      const result = getCleanValue(input)

      // Then
      expect(result).toBe("1234")
    })

    it("should return a string that contains only numbers and 1 dot", () => {
      // Given
      const input = "1,234111"

      // When
      const result = getCleanValue(input)

      // Then
      expect(result).toBe("1.234111")
    })

    it("should handle a bad formatted string with multiple commas (by accepting only the first dot / comma as decimal separator)", () => {
      // Given
      const input = "1,234,111"

      // When
      const result = getCleanValue(input)

      // Then
      expect(result).toBe("1.234111")
    })
  })

  describe("getValueConversion", () => {
    it("should return a string with the eur input value converted in usd with current real rate with a 2 decimal precision", () => {
      // Given
      const input = "1.00"
      const currentRate = 1.1
      const isUsdToEur = false
      const fixedRate = "1.1"
      const hasFixedRate = false
      const isFixedRateOverMaxDiff = false

      // When
      const result = getValueConversion(
        input,
        currentRate,
        isUsdToEur,
        fixedRate,
        hasFixedRate,
        isFixedRateOverMaxDiff
      )

      // Then
      expect(result).toBe("1.10")
    })

    it("should handle usd to eur conversion", () => {
      // Given
      const input = "1.00"
      const currentRate = 1.1
      const isUsdToEur = true
      const fixedRate = "1.1"
      const hasFixedRate = false
      const isFixedRateOverMaxDiff = false

      // When
      const result = getValueConversion(
        input,
        currentRate,
        isUsdToEur,
        fixedRate,
        hasFixedRate,
        isFixedRateOverMaxDiff
      )

      // Then
      expect(result).toBe("0.91")
    })

    it("should handle a blank value in input", () => {
      // Given
      const input = ""
      const currentRate = 1.1
      const isUsdToEur = false
      const fixedRate = "1.1"
      const hasFixedRate = false
      const isFixedRateOverMaxDiff = false

      // When
      const result = getValueConversion(
        input,
        currentRate,
        isUsdToEur,
        fixedRate,
        hasFixedRate,
        isFixedRateOverMaxDiff
      )

      // Then
      expect(result).toBe("0.00")
    })

    it("should handle a bad formatted fixed rate (and fallback to real rate instead)", () => {
      // Given
      const input = "1"
      const currentRate = 1.1
      const isUsdToEur = false
      const fixedRate = ""
      const hasFixedRate = true
      const isFixedRateOverMaxDiff = false

      // When
      const result = getValueConversion(
        input,
        currentRate,
        isUsdToEur,
        fixedRate,
        hasFixedRate,
        isFixedRateOverMaxDiff
      )

      // Then
      expect(result).toBe("1.10")
    })

    it("should handle a conversion with fixed rate active and valid", () => {
      // Given
      const input = "1"
      const currentRate = 1.1
      const isUsdToEur = false
      const fixedRate = "1.3"
      const hasFixedRate = true
      const isFixedRateOverMaxDiff = false

      // When
      const result = getValueConversion(
        input,
        currentRate,
        isUsdToEur,
        fixedRate,
        hasFixedRate,
        isFixedRateOverMaxDiff
      )

      // Then
      expect(result).toBe("1.30")
    })
  })

  describe("getNewRate", () => {
    it("should return the new rate after adding a value", () => {
      // Given
      const prev = 1.1
      const addOrSubValue = 0.05

      // When
      const result = getNewRate(prev, addOrSubValue)

      // Then
      expect(result).toBe(1.15)
    })

    it("should return the new rate after subtract a value", () => {
      // Given
      const prev = 1.1
      const addOrSubValue = -0.05

      // When
      const result = getNewRate(prev, addOrSubValue)

      // Then
      expect(result).toBe(1.05)
    })

    it("should return 0.0 if the new rate is negative", () => {
      // Given
      const prev = 0.0
      const addOrSubValue = -0.05

      // When
      const result = getNewRate(prev, addOrSubValue)

      // Then
      expect(result).toBe(0.0)
    })
  })
})
