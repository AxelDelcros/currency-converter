import cx from "classnames"

import { ContainerProps } from "./Container.types"

const Container = ({ children, label, className }: ContainerProps) => (
  <div
    className={cx(
      "bg-green-900 p-6 rounded-xl flex flex-col overflow-hidden",
      className
    )}
  >
    {label && <h2 className="mb-6 font-semibold text-2xl">{label}</h2>}
    <div>{children}</div>
  </div>
)

export default Container
