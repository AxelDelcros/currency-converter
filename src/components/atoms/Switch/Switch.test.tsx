import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Switch from "./Switch"

const mockSetActive = vi.fn()

const defaultProps = {
  checked: true,
  setActive: mockSetActive,
}

describe("Switch", () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })
  describe("Rendering", () => {
    it("Should render correctly", () => {
      // Given
      render(<Switch {...defaultProps} />)

      // When
      const input = screen.getByRole("checkbox") as HTMLInputElement
      const dot = screen.getByRole("presentation")

      // Then
      expect(input.checked).toEqual(defaultProps.checked)
      expect(dot.classList).toContain("left-[calc(100%-28px)]")
    })

    it("Should render the switch in the correct position when checked is false", () => {
      // Given
      const localProps = { ...defaultProps, checked: false }
      render(<Switch {...localProps} />)

      // When
      const dot = screen.getByRole("presentation")

      // Then
      expect(dot.classList).toContain("left-1")
      expect(dot.classList).not.toContain("left-[calc(100%-28px)]")
    })
  })

  describe("Interactions", () => {
    it("Should call the setActive function when the input changes", () => {
      // Given
      render(<Switch {...defaultProps} />)
      const input = screen.getByRole("checkbox") as HTMLInputElement

      // When
      fireEvent.click(input)

      // Then
      expect(mockSetActive).toHaveBeenCalledWith(false)
    })
  })
})
