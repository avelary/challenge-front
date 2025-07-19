import { Input as ShadInput } from "@/components/ui/input"
import { InputHTMLAttributes } from "react"

type InputProps = {
  label?: string
  errorMessage?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = ({ label, errorMessage, ...rest }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[0.7rem] font-medium">{label}</label>}
      <ShadInput {...rest} />
      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  )
}
