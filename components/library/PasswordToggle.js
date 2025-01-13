import { useState, forwardRef } from 'react'

const PasswordToggle = forwardRef(({
  size,
  light,
  className,
  style,
  ...props
}, ref) => {

  const inputSize = size ? ` form-control-${size}` : '',
    isLight = light ? ' form-control-light' : '',
    extraClass = className ? ` ${className}` : ''

  const [show, setShow] = useState(false)

  return (
    <div className={`password-toggle${extraClass}`} style={style}>
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={`form-control${inputSize}${isLight}`}
        name='password'
        minLength="8"
        required
        ref={ref}
      />
      <label className='password-toggle-btn' aria-label='Show/hide password'>
        <input type='checkbox' className='password-toggle-check' checked={show} onChange={() => setShow(!show)} />
        <span className='password-toggle-indicator'></span>
      </label>
    </div>
  )
})

export default PasswordToggle
