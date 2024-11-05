import cx from "classnames"
import { SwitchProps } from "./Switch.types"

const Switch = ({ checked, setActive }: SwitchProps) => {
  return (
    <div className={cx("flex items-center justify-center")}>
      <label
        htmlFor="switch"
        className="flex items-center cursor-pointer relative"
      >
        <span
          className={`before:block before:absolute before:content-['€ to $'] before:text-blue-950`}
        ></span>
        <span className="block absolute -left-full font-semibold">€ to $</span>
        <div className="relative">
          <input
            type="checkbox"
            id="switch"
            className="sr-only"
            checked={checked}
            onChange={(e) => setActive(e.target.checked)}
          />
          <div className="block bg-green-950 w-14 h-8 rounded-full"></div>
          <div
            className={cx(
              "dot absolute top-1 bg-white w-6 h-6 rounded-full transition-all",
              !checked ? "left-1" : "left-[calc(100%-28px)]"
            )}
            role="presentation"
          />
        </div>
        <span className="block absolute -right-full font-semibold">$ to €</span>
      </label>
    </div>
  )
}

export default Switch
