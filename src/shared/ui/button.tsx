import { ButtonHTMLAttributes } from 'react'
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props
  return <button className={`h-8 rounded border px-3 text-sm ${className}`} {...rest} />
}
