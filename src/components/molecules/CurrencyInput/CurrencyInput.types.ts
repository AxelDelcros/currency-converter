export type CurrencyInputProps = {
  currentRate: number
  handleSaveConversion: (
    value: string,
    conversion: string,
    isUsdToEur: boolean,
    fixedRate?: number
  ) => void
  className?: string
}
