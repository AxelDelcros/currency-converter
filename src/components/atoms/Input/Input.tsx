import { InputProps } from "./Input.types"

const Input = ({ value, onChange, label }: InputProps) => {
  return (
    <div className="flex flex-1 gap-2 items-center">
      <input
        className={"bg-white rounded-lg p-2 h-full text-black"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>{label}</span>
    </div>
  )
}

export default Input
