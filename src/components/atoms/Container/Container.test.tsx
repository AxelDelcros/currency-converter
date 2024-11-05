import { beforeEach, describe, expect, it, vi } from "vitest"
import Container from "./Container"
import { cleanup, render, screen } from "@testing-library/react"

const defaultProps = {
  label: "mocked-label",
  className: "mocked-classname",
}

describe("Container", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
  })
  describe("Rendering", () => {
    it("Should render correctly", () => {
      // Given
      render(<Container {...defaultProps}>mocked-children</Container>)

      // When
      const heading = screen.getByRole("heading")
      const wrapper = screen.getAllByRole("generic")[1]

      // Then
      expect(heading.innerHTML).toEqual(defaultProps.label)
      expect(wrapper.classList).toContain(defaultProps.className)
    })

    it("Should not render the label if it is not passed", () => {
      // Given
      const localProps = { ...defaultProps, label: undefined }
      render(<Container {...localProps}>mocked-children</Container>)

      // When
      const heading = screen.queryByRole("heading")

      // Then
      expect(heading).toBeNull()
    })
  })
})
