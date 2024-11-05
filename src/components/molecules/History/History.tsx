import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { HistoryProps } from "./History.types"
import {
  faArrowTrendDown,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons"
import Container from "../../atoms/Container/Container"

const History = ({ values = [], className }: HistoryProps) => {
  return (
    <Container className={className} label="History">
      <div className="overflow-auto">
        <table>
          <thead>
            <tr className="bg-brandDark">
              <th className="px-8 py-2">Value in €</th>
              <th className="px-8 py-2">Value in $</th>
              <th className="px-8 py-2">Fixed rate (if set)</th>
              <th className="px-8 py-2">Real rate</th>
            </tr>
          </thead>
          <tbody>
            {values
              .slice(0, 5)
              .map(({ id, realRate, valueEur, fixedRate, valueUsd }, index) => {
                const nextValue = values[index + 1]?.realRate
                return (
                  <tr
                    key={id}
                    className="odd:bg-green-900 even:bg-green-950 text-center"
                  >
                    <td className="py-2 ">
                      {valueEur.toFixed(2).toString().replace(".", ",")}
                    </td>
                    <td className="py-2 font-semibold">
                      {valueUsd.toFixed(2).toString().replace(".", ",")}
                    </td>
                    <td>{fixedRate ? fixedRate : "-"}</td>
                    <td className="py-2 ">
                      <div className="flex gap-2 justify-center items-center">
                        {realRate.toFixed(2).toString().replace(".", ",")}
                        {nextValue && (
                          <FontAwesomeIcon
                            className={
                              realRate < nextValue
                                ? "text-red-700"
                                : "text-green-700"
                            }
                            icon={
                              realRate < nextValue
                                ? faArrowTrendDown
                                : faArrowTrendUp
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </Container>
  )
}

export default History
