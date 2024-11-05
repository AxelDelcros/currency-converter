export type HistoryValue = {
  id: string
  realRate: number
  fixedRate?: number
  valueEur: number
  valueUsd: number
}

export type HistoryProps = {
  values?: HistoryValue[]
  actualRate?: number
  className?: string
}
