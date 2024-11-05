import { cleanup, render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import History from "./History"
import { ContainerProps } from "../../atoms/Container/Container.types"

const mockContainer = vi.fn()

vi.mock("../../atoms/Container/Container", () => ({
  default: (props: ContainerProps) => {
    const { children } = props
    mockContainer(props)

    return <div>{children}</div>
  },
}))

const values = [
  {
    id: "mocked-id-1",
    realRate: 1.1,
    fixedRate: 1.2,
    valueEur: 1,
    valueUsd: 1.2,
  },
  {
    id: "mocked-id-2",
    realRate: 1.3,
    valueEur: 1.5,
    valueUsd: 1.8,
  },
  {
    id: "mocked-id-3",
    realRate: 1.6,
    valueEur: 1.9,
    valueUsd: 2.2,
  },
  {
    id: "mocked-id-4",
    realRate: 1.2,
    valueEur: 2.8,
    valueUsd: 3.1,
  },
  {
    id: "mocked-id-5",
    realRate: 3.3,
    valueEur: 3.6,
    valueUsd: 3.9,
  },
  {
    id: "mocked-id-6",
    realRate: 4.1,
    valueEur: 4.4,
    valueUsd: 4.7,
  },
]

const defaultProps = {
  values: values,
  className: "mocked-classname",
}

describe("History", () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("Should render correctly", () => {
      // Given
      const expectedContainerProps = {
        label: "History",
        className: defaultProps.className,
      }

      // When
      render(<History {...defaultProps} />)

      // Then
      expect(mockContainer).toHaveBeenCalledWith(
        expect.objectContaining(expectedContainerProps)
      )
    })
  })
})
