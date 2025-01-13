import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

const PasswordToggle = ({
    id,
    required,
    onChange,
    pattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <InputGroup>
            <Form.Control
                type={showPassword ? 'text' : 'password'}
                id={id}
                name="password"
                required={required}
                pattern={pattern}
                onChange={onChange}
                placeholder="Minimum 8 characters"
                {...props}
            />
            <Button
                type="button"
                variant="translucent"
                className="border"
                onClick={() => setShowPassword(!showPassword)}
            >
                <i className={`fi-${showPassword ? 'eye-off' : 'eye'}`}></i>
            </Button>
            <Form.Control.Feedback type="invalid">
                Password must be at least 8 characters and contain at least one letter and one number
            </Form.Control.Feedback>
        </InputGroup>
    )
}

export default PasswordToggle