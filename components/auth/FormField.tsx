import { Input } from "@/components/ui/input"

type FormFieldProps = {
  id: string
  label: string
  type?: "text" | "email" | "password"
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function FormField({id,label,type = "text",value, onChange, placeholder, error, disabled,}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm text-foreground">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        disabled={disabled}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
