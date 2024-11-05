import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CurrencyInput from "./CurrencyInput"

import { ContainerProps } from "../../atoms/Container/Container.types"
import { InputProps } from "../../atoms/Input/Input.types"
import { SwitchProps } from "../../atoms/Switch/Switch.types"

const mockedHandleSaveConversion = vi.fn()
const mockContainer = vi.fn()
const mockInput = vi.fn()
const mockSwitch = vi.fn()

vi.mock("../../atoms/Container/Container", () => ({
  default: (props: ContainerProps) => {
    const { children } = props
    mockContainer(props)

    return <div>{children}</div>
  },
}))

vi.mock("../../atoms/Input/Input", () => ({
  default: (props: InputProps) => {
    const { onChange } = props
    mockInput(props)

    return (
      <input data-testid="input" onChange={(e) => onChange(e.target.value)} />
    )
  },
}))

vi.mock("../../atoms/Switch/Switch", () => ({
  default: (props: SwitchProps) => {
    const { setActive, checked } = props
    mockSwitch(props)

    return (
      <input
        checked={checked}
        type="checkbox"
        data-testid="switch"
        onChange={(e) => setActive(e.target.checked)}
      />
    )
  },
}))

const defaultProps = {
  currentRate: 1.1,
  handleSaveConversion: mockedHandleSaveConversion,
  className: "mocked-classname",
}

describe("CurrencyInput", () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("Should render correctly", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)

      // When
      const currentRate = screen.getByText(defaultProps.currentRate)
      const fixedRateCheckbox = screen.getAllByRole(
        "checkbox"
      )[0] as HTMLInputElement

      const switchElement = screen.getByTestId("switch") as HTMLInputElement

      // Then
      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          value: "0.00",
        })
      )

      expect(mockContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          className: defaultProps.className,
          label: "Currency converter",
        })
      )
      expect(fixedRateCheckbox.checked).toBe(false)
      expect(currentRate).toBeDefined()
      expect(switchElement.checked).toBe(false)
    })
  })

  describe("Interactions", () => {
    it("Should handle the right conversion when we change the input value we want to convert", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)
      const input = screen.getByTestId("input") as HTMLInputElement

      // When
      fireEvent.change(input, { target: { value: "100" } })
      const convertedValue = screen.getByText("110,00")

      // Then
      expect(convertedValue).toBeDefined()
    })

    it("Should update conversion when the current rate has changed", () => {
      // Given
      const { rerender } = render(<CurrencyInput {...defaultProps} />)
      const input = screen.getByTestId("input") as HTMLInputElement

      // When
      fireEvent.change(input, { target: { value: "100" } })
      rerender(<CurrencyInput {...defaultProps} currentRate={1.15} />)
      const convertedValue = screen.getByText("115,00")

      // Then
      expect(convertedValue).toBeDefined()
    })

    it("Should update the converted value to 0 when we put an empty string as value", () => {
      // Given
      const { rerender } = render(<CurrencyInput {...defaultProps} />)
      const input = screen.getByTestId("input") as HTMLInputElement
      fireEvent.change(input, { target: { value: "1" } })

      // When
      fireEvent.change(input, { target: { value: "" } })
      rerender(<CurrencyInput {...defaultProps} />)
      const convertedValue = screen.getByText("0,00")

      // Then
      expect(convertedValue).toBeDefined()
    })

    it("Should change the usd to eur conversion when we change the switch", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)
      const input = screen.getByTestId("input") as HTMLInputElement
      const switchElement = screen.getByTestId("switch") as HTMLInputElement

      // When
      fireEvent.change(input, { target: { value: "100" } })
      fireEvent.click(switchElement)
      const convertedValue = screen.getByText("100,00")

      // Then
      expect(convertedValue).toBeDefined()
    })

    it("Should show the fixed rate input when we check the checkbox", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)
      const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement

      // When
      mockInput.mockClear()
      fireEvent.click(checkbox)

      // Then
      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          value: "1.1",
          label: "Fixed rate",
        })
      )
      const warningMessage = screen.queryByText("The fixed rate is over")
      expect(warningMessage).toBeNull()
    })

    it("Should show the warning message when the fixed rate is over the max diff", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)
      const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement

      // When
      fireEvent.click(checkbox)
      const fixedRateinput = screen.getAllByTestId("input")[0]
      fireEvent.change(fixedRateinput, { target: { value: "100" } })
      const warningMessage = screen.getByText(/The fixed rate is over/i)

      // Then
      expect(warningMessage).toBeDefined()
    })

    it("Should prevent a NaN value in the fixed rate input", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)
      const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement

      // When
      fireEvent.click(checkbox)

      const fixedRateinput = screen.getAllByTestId(
        "input"
      )[0] as HTMLInputElement

      fireEvent.change(fixedRateinput, { target: { value: "11111" } })
      fireEvent.change(fixedRateinput, { target: { value: "" } })

      // Then
      expect(fixedRateinput.value).toBe("")
    })
    it("Should prevent a NaN value in the fixed rate input", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)
      const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement

      // When
      fireEvent.click(checkbox)
      const fixedRateinput = screen.getAllByTestId(
        "input"
      )[0] as HTMLInputElement
      fireEvent.change(fixedRateinput, { target: { value: "11111" } })
      fireEvent.change(fixedRateinput, { target: { value: "" } })

      // Then
      expect(fixedRateinput.value).toBe("")
    })

    it("Should handle the conversion save by clicking on the save button (with real rate)", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)
      const input = screen.getByTestId("input") as HTMLInputElement
      fireEvent.change(input, { target: { value: "100" } })
      const saveButton = screen.getByRole("button")

      // When
      fireEvent.click(saveButton)

      // Then
      expect(mockedHandleSaveConversion).toHaveBeenCalledWith(
        "100",
        "110.00",
        false,
        undefined
      )
    })

    it("Should handle the conversion save by clicking on the save button (with a fixed rate)", () => {
      // Given
      render(<CurrencyInput {...defaultProps} />)
      const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement
      fireEvent.click(checkbox)
      const fixedRateinput = screen.getAllByTestId(
        "input"
      )[0] as HTMLInputElement
      const valueToConvert = screen.getAllByTestId(
        "input"
      )[1] as HTMLInputElement

      fireEvent.change(fixedRateinput, { target: { value: "1.11" } })
      fireEvent.change(valueToConvert, { target: { value: "100" } })
      const saveButton = screen.getByRole("button")

      // When
      fireEvent.click(saveButton)

      // Then
      expect(mockedHandleSaveConversion).toHaveBeenCalledWith(
        "100",
        "111.00",
        false,
        1.11
      )
      expect(screen.queryByText(/The fixed rate is over/i)).toBeDefined()
    })
  })
})
