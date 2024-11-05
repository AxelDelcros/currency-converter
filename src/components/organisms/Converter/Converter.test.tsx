import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Converter from "./Converter"
import { HistoryProps } from "../../molecules/History/History.types"
import { CurrencyInputProps } from "../../molecules/CurrencyInput/CurrencyInput.types"

const mockHistory = vi.fn()
const mockCurrencyInput = vi.fn()

vi.mock("../../molecules/History/History", () => {
  return {
    default: (props: HistoryProps) => {
      mockHistory(props)
      return <div data-testid="history">History</div>
    },
  }
})

const mockedSaveConversionParams = {
  value: "1.00",
  conversion: "1.10",
  isUsdToEur: false,
  fixedRate: 1.2,
}

const mockedId = "1234"

vi.mock("uuid", () => {
  return {
    v4: () => mockedId,
  }
})

vi.mock("../../molecules/CurrencyInput/CurrencyInput", () => {
  return {
    default: (props: CurrencyInputProps) => {
      const { handleSaveConversion } = props
      mockCurrencyInput(props)

      return (
        <input
          data-testid="currency-input"
          onChange={(e) => {
            const test = Object.values(JSON.parse(e.target.value)) as [
              string,
              string,
              boolean,
              number,
            ]

            handleSaveConversion(test[0], test[1], test[2], test[3])
          }}
        />
      )
    },
  }
})

describe("Converter", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Manipulate Math.random to always make the rate increase by 0.05
    vi.spyOn(Math, "random").mockReturnValue(1)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    cleanup()
  })

  describe("Rendering", () => {
    it("should render correctly", () => {
      // Given
      const expectedRate = 1.1

      // When
      render(<Converter />)

      // Then
      expect(mockHistory).toHaveBeenCalledWith({
        className: expect.any(String),
        values: [],
      })
      expect(mockCurrencyInput).toHaveBeenCalledWith({
        className: expect.any(String),
        currentRate: expectedRate,
        handleSaveConversion: expect.any(Function),
      })
    })

    it("should increase the real rate increase by 0.05 after 3s", () => {
      // Given
      const expectedRate = 1.15
      const { rerender } = render(<Converter />)

      // When
      vi.advanceTimersByTime(3000)
      rerender(<Converter />)

      // Then
      expect(mockHistory).toHaveBeenCalledWith({
        className: expect.any(String),
        values: [],
      })
      expect(mockCurrencyInput).toHaveBeenCalledWith({
        className: expect.any(String),
        currentRate: expectedRate,
        handleSaveConversion: expect.any(Function),
      })
    })

    it("should decrease the real rate increase by 0.05 after 3s if random returns a negative value", () => {
      // Given
      vi.spyOn(Math, "random").mockReturnValueOnce(0)
      const expectedRate = 1.05
      const { rerender } = render(<Converter />)

      // When
      vi.advanceTimersByTime(3000)
      rerender(<Converter />)

      // Then
      expect(mockHistory).toHaveBeenCalledWith({
        className: expect.any(String),
        values: [],
      })
      expect(mockCurrencyInput).toHaveBeenCalledWith({
        className: expect.any(String),
        currentRate: expectedRate,
        handleSaveConversion: expect.any(Function),
      })
    })
  })

  describe("Interaction", () => {
    it("should add a new conversion to the history", () => {
      // Given
      const { getByTestId } = render(<Converter />)
      const currencyInput = getByTestId("currency-input")

      // When
      fireEvent.change(currencyInput, {
        target: {
          value: JSON.stringify(mockedSaveConversionParams),
        },
      })

      // Then
      expect(mockHistory).toHaveBeenCalledWith({
        className: expect.any(String),
        values: [
          {
            id: mockedId,
            realRate: 1.1,
            valueEur: 1,
            valueUsd: 1.1,
            fixedRate: mockedSaveConversionParams.fixedRate,
          },
        ],
      })
    })

    it("should not add a new conversion to the history if the value is not a number", () => {
      // Given
      render(<Converter />)
      const currencyInput = screen.getByTestId("currency-input")

      // When
      mockHistory.mockClear()
      fireEvent.change(currencyInput, {
        target: {
          value: JSON.stringify({ ...mockedSaveConversionParams, value: "a" }),
        },
      })

      // Then
      expect(mockHistory).not.toHaveBeenCalled()
    })

    it("should not add a new conversion to the history if the conversion is not a number", () => {
      // Given
      render(<Converter />)
      const currencyInput = screen.getByTestId("currency-input")

      // When
      mockHistory.mockClear()
      fireEvent.change(currencyInput, {
        target: {
          value: JSON.stringify({
            ...mockedSaveConversionParams,
            conversion: "a",
          }),
        },
      })

      // Then
      expect(mockHistory).not.toHaveBeenCalled()
    })

    it("should handle usd to eur conversion save", () => {
      // Given
      const { getByTestId } = render(<Converter />)
      const currencyInput = getByTestId("currency-input")

      // When
      mockHistory.mockClear()
      fireEvent.change(currencyInput, {
        target: {
          value: JSON.stringify({
            ...mockedSaveConversionParams,
            isUsdToEur: true,
          }),
        },
      })

      // Then
      expect(mockHistory).toHaveBeenCalledWith({
        className: expect.any(String),
        values: [
          {
            id: mockedId,
            realRate: 1.1,
            valueEur: 1.1,
            valueUsd: 1,
            fixedRate: mockedSaveConversionParams.fixedRate,
          },
        ],
      })
    })
  })
})
