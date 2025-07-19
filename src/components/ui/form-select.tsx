import React from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
  error?: FieldError
  register?: UseFormRegister<any>
  name: string
  placeholder?: string
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      options,
      error,
      register,
      name,
      placeholder,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const registration = register ? register(name) : {}

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200 block">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <select
          ref={ref}
          {...registration}
          {...props}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-800',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
        >
          {placeholder && (
            <option value="" className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-700 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-400">{error.message}</p>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
