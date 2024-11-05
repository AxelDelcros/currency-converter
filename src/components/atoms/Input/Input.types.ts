import { ReactNode } from "react"

export type InputProps = {
  value: string
  onChange: (newValue: string) => void
  className?: string
  label: string | ReactNode
}
