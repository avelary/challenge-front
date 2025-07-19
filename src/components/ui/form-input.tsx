import React from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  register?: UseFormRegister<any>
  name: string
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, register, name, className, ...props }, ref) => {
    const registration = register ? register(name) : {}

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200 block">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          {...registration}
          {...props}
          className={cn(
            'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
        />
        {error && <p className="text-sm text-red-400">{error.message}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
