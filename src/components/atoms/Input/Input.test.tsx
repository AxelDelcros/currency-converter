import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Input from "./Input"

const mockOnChange = vi.fn()

const defaultProps = {
  label: "mocked-label",
  value: "mocked-value",
  onChange: mockOnChange,
}

describe("Input", () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("Should render correctly", () => {
      // Given
      render(<Input {...defaultProps} />)

      // When
      const input = screen.getByRole("textbox") as HTMLInputElement
      const label = screen.getByText(defaultProps.label)

      // Then
      expect(input.value).toEqual(defaultProps.value)
      expect(label).toBeDefined()
    })
  })

  describe("Interactions", () => {
    it("Should call the onChange function when the input changes", () => {
      // Given
      const newValue = "new-value"
      render(<Input {...defaultProps} />)
      const input = screen.getByRole("textbox") as HTMLInputElement

      // When
      fireEvent.change(input, { target: { value: newValue } })

      // Then
      expect(mockOnChange).toHaveBeenCalledWith(newValue)
    })
  })
})
