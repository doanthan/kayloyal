import { useState, useEffect, useRef } from 'react'
import { Row, Col, Card, Form, Button, Modal, Spinner, Badge } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { SketchPicker } from 'react-color'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Eye, Clipboard } from 'react-bootstrap-icons'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Link, Globe2, PencilSquare } from 'react-bootstrap-icons'
import { getConfigToken } from 'services/library'


const AVAILABLE_FIELDS = {
    email: {
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter email',
        defaultEnabled: true,
        validation: {
            required: 'Email is required',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
            }
        }
    },
    firstName: {
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter first name',
        validation: {
            minLength: {
                value: 2,
                message: 'First name must be at least 2 characters'
            }
        }
    },
    lastName: {
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter last name',
        validation: {
            minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters'
            }
        }
    },
    phone: {
        label: 'Phone Number',
        type: 'tel',
        placeholder: 'Enter phone number',
        validation: {
            pattern: {
                value: /^[0-9+\-() ]+$/,
                message: 'Invalid phone number'
            }
        }
    },
    birthDate: {
        label: 'Date of Birth',
        type: 'date',
        validation: {
            validate: value => !value || new Date(value) <= new Date() || 'Date cannot be in the future'
        }
    },
    yearOfBirth: {
        label: 'Year of Birth',
        type: 'select',
        options: (() => {
            const currentYear = new Date().getFullYear();
            const startYear = 1950;  // Changed from currentYear - 100
            return Array.from(
                { length: currentYear - startYear + 1 },
                (_, i) => ({
                    value: (currentYear - i).toString(),  // Reverse order: newest years first
                    label: (currentYear - i).toString()
                })
            ).sort((a, b) => b.value - a.value)  // Sort descending
        })(),
        validation: {
            validate: value => {
                if (!value) return true;

                const year = parseInt(value);
                const currentYear = new Date().getFullYear();
                const minYear = 1950;  // Changed minimum year

                if (year > currentYear) {
                    return 'Year cannot be in the future';
                }

                if (year < minYear) {
                    return `Year must be ${minYear} or later`;
                }

                return true;
            }
        }
    },
    gender: {
        label: 'Gender',
        type: 'select',
        options: [
            { value: '', label: 'Select gender' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' }
        ]
    },
    postcode: {
        label: 'Postcode',
        type: 'text',
        placeholder: 'Enter Postcode'
    },
    company: {
        label: 'Company',
        type: 'text',
        placeholder: 'Enter company name'
    },
    newsletter: {
        label: 'Subscribe to Newsletter',
        type: 'checkbox'
    },
    terms: {
        label: 'I agree to the Terms and Conditions',
        type: 'checkbox',
        required: true,
        validation: {
            required: 'You must accept the terms and conditions'
        }
    },
    captcha: {
        label: 'Verify you are human',
        type: 'captcha',
        validation: {
            required: 'Please complete the captcha verification'
        }
    },
}

const SignUpBuilder = ({
    planId,
    form,
    initialBrandTheme = {
        primaryColor: '#0d6efd',
        secondaryColor: '#6c757d',
        backgroundColor: '#ffffff',
        textColor: '#212529',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        borderRadius: '0.375rem',
        inputBorderColor: '#ced4da',
        buttonStyle: 'filled',
        labelStyle: 'bold',
        spacing: 'normal',
    }
}) => {
    const [brandTheme, setBrandTheme] = useState(initialBrandTheme)
    const [showColorPicker, setShowColorPicker] = useState(null)
    const [customFonts, setCustomFonts] = useState([])
    const [uploadingFont, setUploadingFont] = useState(false)
    const [fontUploadMethod, setFontUploadMethod] = useState('file') // 'file' or 'url'
    const [fontUrl, setFontUrl] = useState('')
    const [showPreview, setShowPreview] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const [publishedUrl, setPublishedUrl] = useState('')
    const [copySuccess, setCopySuccess] = useState(false)
    const [captchaValue, setCaptchaValue] = useState(null);
    const recaptchaRef = useRef(null);
    const [formDetails, setFormDetails] = useState({
        name: '',
        country: 'Global',
        termsUrl: ''
    })

    const [logo, setLogo] = useState("/images/logo/kaypush-logo.png");
    const [isLogoChanged, setIsLogoChanged] = useState(false);

    const fileInputRef = useRef(null);

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result);
                setIsLogoChanged(true); // Track that logo has been changed
                toast.success('Logo updated successfully');
            };
            reader.readAsDataURL(file);
        }
    };



    const renderColorPicker = (colorKey, label) => (
        <Form.Group className="mb-3">
            <Form.Label className="d-flex justify-content-between align-items-center">
                {label}
                <div
                    className="color-preview"
                    style={{
                        backgroundColor: brandTheme[colorKey],
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da',
                        cursor: 'pointer'
                    }}
                    onClick={() => setShowColorPicker(showColorPicker === colorKey ? null : colorKey)}
                />
            </Form.Label>
            {showColorPicker === colorKey && (
                <div className="position-absolute" style={{ zIndex: 2 }}>
                    <div
                        className="position-fixed top-0 start-0 bottom-0 end-0"
                        onClick={() => setShowColorPicker(null)}
                    />
                    <SketchPicker
                        color={brandTheme[colorKey]}
                        onChange={(color) => handleThemeChange(colorKey, color.hex)}
                    />
                </div>
            )}
        </Form.Group>
    )

    // Create dynamic styles
    const formStyles = {
        formContainer: {
            '--brand-primary': brandTheme.primaryColor,
            '--brand-secondary': brandTheme.secondaryColor,
            '--brand-bg': brandTheme.backgroundColor,
            '--brand-text': brandTheme.textColor,
            fontFamily: brandTheme.fontFamily,
        },
        input: {
            borderRadius: brandTheme.borderRadius,
            borderColor: brandTheme.inputBorderColor,
            padding: brandTheme.spacing === 'compact' ? '0.375rem' :
                brandTheme.spacing === 'relaxed' ? '0.875rem' : '0.625rem',
        },
        label: {
            fontWeight: brandTheme.labelStyle === 'bold' ? '600' : '400',
            textTransform: brandTheme.labelStyle === 'uppercase' ? 'uppercase' : 'none',
            letterSpacing: brandTheme.labelStyle === 'uppercase' ? '0.05em' : 'normal',
        },
        button: {
            backgroundColor: brandTheme.buttonStyle === 'filled' ? brandTheme.primaryColor : 'transparent',
            color: brandTheme.buttonStyle === 'filled' ? '#fff' : brandTheme.primaryColor,
            border: brandTheme.buttonStyle === 'minimal' ? 'none' : `1px solid ${brandTheme.primaryColor}`,
            borderRadius: brandTheme.borderRadius,
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormDetails(prev => ({
            ...prev,
            [name]: value
        }))

        // Optional: Show toast when country is changed
        if (name === 'country') {
            toast.success(`Country set to ${value}`)
        }
    }


    // Add custom CSS to document
    useEffect(() => {
        if (brandTheme.customCSS) {
            const styleSheet = document.createElement('style')
            styleSheet.innerText = brandTheme.customCSS
            document.head.appendChild(styleSheet)
            return () => document.head.removeChild(styleSheet)
        }
    }, [brandTheme.customCSS])

    // Add font face to document
    useEffect(() => {
        customFonts.forEach(font => {
            const fontFace = new FontFace(font.name, `url(${font.url})`)
            fontFace.load().then(() => {
                document.fonts.add(fontFace)
            })
        })
    }, [customFonts])

    const handleFontAdd = async (e) => {
        e.preventDefault()

        try {
            setUploadingFont(true)
            let fontData

            if (fontUploadMethod === 'file') {
                const file = document.getElementById('fontUpload').files[0]
                if (!file) {
                    alert('Please select a font file')
                    return
                }

                const formData = new FormData()
                formData.append('font', file)

                const response = await fetch('/api/upload/font', {
                    method: 'POST',
                    body: formData
                })

                if (!response.ok) throw new Error('Upload failed')
                fontData = await response.json()
            } else {
                // URL validation
                if (!fontUrl) {
                    alert('Please enter a font URL')
                    return
                }

                const response = await fetch('/api/upload/font', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fontUrl })
                })

                if (!response.ok) throw new Error('Font URL validation failed')
                fontData = await response.json()
            }

            const fontName = `CustomFont-${customFonts.length + 1}`
            setCustomFonts(prev => [...prev, {
                name: fontName,
                url: fontData.fontUrl
            }])

            // Reset form
            setFontUrl('')
            if (document.getElementById('fontUpload')) {
                document.getElementById('fontUpload').value = ''
            }

            // Add to font family options
            handleThemeChange('fontFamily', fontName)

        } catch (error) {
            console.error('Font addition error:', error)
            alert('Failed to add font')
        } finally {
            setUploadingFont(false)
        }
    }

    const [enabledFields, setEnabledFields] = useState({
        email: true,
        terms: true,
        captcha: true
    })

    const { control, handleSubmit, formState: { errors }, setError } = useForm({
        mode: 'onBlur'
    })

    const handleFieldToggle = (fieldName) => {
        setEnabledFields(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }))
    }

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const onSubmit = async (data) => {
        // Your existing form submission logic
        console.log(formData);
    }

    const renderField = (fieldName, field) => {
        if (!enabledFields[fieldName]) return null;

        const commonLabelStyle = {
            color: brandTheme.textColor
        };

        switch (field.type) {
            case 'checkbox':
                return (
                    <Form.Group className="mb-3" key={fieldName}>
                        <Controller
                            name={fieldName}
                            control={control}
                            defaultValue={false}
                            rules={field.validation}
                            render={({ field: { onChange, value, ref } }) => (
                                <Form.Check
                                    type="checkbox"
                                    id={fieldName}
                                    label={field.label}
                                    onChange={onChange}
                                    checked={value}
                                    ref={ref}
                                    isInvalid={!!errors[fieldName]}
                                    style={{ color: brandTheme.textColor }}
                                />
                            )}
                        />
                        {errors[fieldName] && (
                            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                                {errors[fieldName].message}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                );

            case 'date':
                return (
                    <Form.Group className="mb-3" key={fieldName}>
                        <Form.Label style={commonLabelStyle}>{field.label}</Form.Label>
                        <div className="datepicker-wrapper w-100">
                            <Controller
                                name={fieldName}
                                control={control}
                                defaultValue={null}
                                rules={field.validation}
                                render={({ field: { onChange, value } }) => (
                                    <DatePicker
                                        selected={value ? new Date(value) : null}
                                        onChange={(date) => onChange(date)}
                                        dateFormat="dd/MM/yyyy"
                                        maxDate={new Date()}
                                        minDate={(() => {
                                            const date = new Date();
                                            date.setFullYear(date.getFullYear() - 100);
                                            return date;
                                        })()}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        yearDropdownItemNumber={100}
                                        scrollableYearDropdown
                                        placeholderText="Select date"
                                        className={`form-control ${errors[fieldName] ? 'is-invalid' : ''}`}
                                        wrapperClassName="w-100"
                                        withPortal
                                        portalId="root"
                                        showPopperArrow={false}
                                        customInput={
                                            <Form.Control
                                                style={{
                                                    color: brandTheme.textColor,
                                                    width: '100%'
                                                }}
                                                isInvalid={!!errors[fieldName]}
                                            />
                                        }
                                        calendarClassName="mobile-friendly-calendar"
                                        popperModifiers={[
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    enabled: true,
                                                    escapeWithReference: false,
                                                    boundary: 'viewport'
                                                }
                                            }
                                        ]}
                                        showMonthYearPicker={false}
                                        showFullMonthYearPicker={false}
                                        showTwoColumnMonthYearPicker={true}
                                        fixedHeight
                                    />
                                )}
                            />
                            {errors[fieldName] && (
                                <Form.Control.Feedback type="invalid">
                                    {errors[fieldName].message}
                                </Form.Control.Feedback>
                            )}
                        </div>
                    </Form.Group>
                );

            case 'select':
                return (
                    <Form.Group className="mb-3" key={fieldName}>
                        <Form.Label style={commonLabelStyle}>{field.label}</Form.Label>
                        <Controller
                            name={fieldName}
                            control={control}
                            defaultValue=""
                            rules={field.validation}
                            render={({ field: { onChange, value } }) => (
                                <Form.Select
                                    onChange={onChange}
                                    value={value}
                                    isInvalid={!!errors[fieldName]}
                                    style={{ color: brandTheme.textColor }}
                                >
                                    {field.options.map(option => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                            style={{ color: brandTheme.textColor }}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            )}
                        />
                        {errors[fieldName] && (
                            <Form.Control.Feedback type="invalid">
                                {errors[fieldName].message}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                );

            case 'captcha':
                return (
                    <Form.Group className="mb-3" key={fieldName}>
                        <Form.Label style={commonLabelStyle}>{field.label}</Form.Label>
                        <div className="w-100">
                            <Controller
                                name={fieldName}
                                control={control}
                                defaultValue=""
                                rules={field.validation}
                                render={({ field: { onChange } }) => (
                                    <div className="d-flex justify-content-center">
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey="YOUR_RECAPTCHA_SITE_KEY" // Replace with your site key
                                            onChange={(value) => {
                                                onChange(value);
                                                handleCaptchaChange(value);
                                            }}
                                            theme={brandTheme.backgroundColor === '#ffffff' ? 'light' : 'dark'}
                                        />
                                    </div>
                                )}
                            />
                            {errors[fieldName] && (
                                <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                                    {errors[fieldName].message}
                                </Form.Control.Feedback>
                            )}
                        </div>
                    </Form.Group>
                );

            default:
                return (
                    <Form.Group className="mb-3" key={fieldName}>
                        <Form.Label style={commonLabelStyle}>{field.label}</Form.Label>
                        <Controller
                            name={fieldName}
                            control={control}
                            defaultValue=""
                            rules={field.validation}
                            render={({ field: { onChange, value } }) => (
                                <Form.Control
                                    type={field.type}
                                    onChange={onChange}
                                    value={value}
                                    isInvalid={!!errors[fieldName]}
                                    style={{ color: brandTheme.textColor }}
                                />
                            )}
                        />
                        {errors[fieldName] && (
                            <Form.Control.Feedback type="invalid">
                                {errors[fieldName].message}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                );
        }
    };

    const renderGroupedFields = (group) => {
        if (!group) return null;

        if (group === AVAILABLE_FIELDS.personalGroup) {
            return (
                <Row className="mb-3">
                    {/* Date of Birth with Enhanced DatePicker */}
                    {enabledFields.birthDate && (
                        <Col md={4}>
                            <Form.Group>
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker
                                            selected={value ? new Date(value) : null}
                                            onChange={(date) => onChange(date)}
                                            dateFormat="dd/MM/yyyy"
                                            maxDate={new Date()}
                                            minDate={(() => {
                                                const date = new Date();
                                                date.setFullYear(date.getFullYear() - 100);
                                                return date;
                                            })()}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            yearDropdownItemNumber={100}
                                            scrollableYearDropdown
                                            openToDate={(() => {
                                                const date = new Date();
                                                date.setFullYear(date.getFullYear() - 30); // Opens to 30 years ago by default
                                                return date;
                                            })()}
                                            placeholderText="Select date of birth"
                                            className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                                            showPopperArrow={false}
                                            renderCustomHeader={({
                                                date,
                                                changeYear,
                                                changeMonth,
                                                decreaseMonth,
                                                increaseMonth,
                                                prevMonthButtonDisabled,
                                                nextMonthButtonDisabled,
                                            }) => (
                                                <div
                                                    style={{
                                                        margin: 10,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={decreaseMonth}
                                                        disabled={prevMonthButtonDisabled}
                                                        className="btn btn-link p-0 mx-2"
                                                    >
                                                        {"<"}
                                                    </button>
                                                    <select
                                                        value={date.getFullYear()}
                                                        onChange={({ target: { value } }) => changeYear(value)}
                                                        className="form-select form-select-sm mx-2"
                                                        style={{ width: 'auto' }}
                                                    >
                                                        {Array.from(
                                                            { length: 101 },
                                                            (_, i) => new Date().getFullYear() - 100 + i
                                                        ).map((year) => (
                                                            <option key={year} value={year}>
                                                                {year}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={date.getMonth()}
                                                        onChange={({ target: { value } }) => changeMonth(value)}
                                                        className="form-select form-select-sm mx-2"
                                                        style={{ width: 'auto' }}
                                                    >
                                                        {[
                                                            "January",
                                                            "February",
                                                            "March",
                                                            "April",
                                                            "May",
                                                            "June",
                                                            "July",
                                                            "August",
                                                            "September",
                                                            "October",
                                                            "November",
                                                            "December",
                                                        ].map((month, i) => (
                                                            <option key={month} value={i}>
                                                                {month}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={increaseMonth}
                                                        disabled={nextMonthButtonDisabled}
                                                        className="btn btn-link p-0 mx-2"
                                                    >
                                                        {">"}
                                                    </button>
                                                </div>
                                            )}
                                        />
                                    )}
                                />
                                {errors.birthDate && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.birthDate.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                    )}

                    {/* All other fields remain exactly the same */}
                    {enabledFields.yearOfBirth && (
                        <Col md={4}>
                            {/* Existing yearOfBirth field */}
                        </Col>
                    )}

                    {enabledFields.gender && (
                        <Col md={4}>
                            {/* Existing gender field */}
                        </Col>
                    )}
                </Row>
            );
        }

    }

    const renderForm = () => (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center mb-4">
                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/*"
                    onChange={handleLogoChange}
                />

                {/* Logo container with relative positioning */}
                <div className="d-inline-block position-relative">
                    <img
                        src={logo}
                        alt="Company Logo"
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            maxHeight: '120px',
                            height: 'auto',
                            marginBottom: '1rem',
                            cursor: 'pointer'
                        }}
                    />

                    {/* Edit icon positioned relative to image */}
                    <div
                        className="position-absolute top-0 end-0 p-1"
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            cursor: 'pointer',
                            background: 'white',
                            borderRadius: '50%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transform: 'translate(25%, -25%)'
                        }}
                    >
                        <PencilSquare
                            size={16}
                            className="text-primary hover-opacity"
                        />
                    </div>
                </div>
            </div>
            {/* Existing Form Fields */}
            {Object.entries(AVAILABLE_FIELDS).map(([groupName, group]) => {
                if (typeof group === 'object' && group.fields) {
                    return renderGroupedFields(group)
                } else {
                    return renderField(groupName, group)
                }
            })}
            <Button
                type="submit"
                className="w-100 mt-3"
                style={{
                    backgroundColor: brandTheme.buttonStyle === 'filled' ? brandTheme.primaryColor : 'transparent',
                    borderColor: brandTheme.primaryColor,
                    color: brandTheme.buttonStyle === 'filled' ? '#fff' : brandTheme.primaryColor,
                    borderRadius: brandTheme.borderRadius || '4px',
                    fontFamily: brandTheme.fontFamily,
                    padding: '0.5rem 1rem',
                    transition: 'all 0.2s ease-in-out',
                    border: `1px solid ${brandTheme.primaryColor}`
                }}
            >
                Sign Up
            </Button>
        </Form>
    )

    // Preview Modal Component
    const PreviewModal = () => (
        <Modal
            show={showPreview}
            onHide={() => setShowPreview(false)}
            size="lg"
            centered
            contentClassName="border-0 shadow-lg"
            style={{ borderRadius: '16px' }}
        >
            <div
                className="position-relative p-4"
                style={{
                    backgroundColor: brandTheme.backgroundColor,
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}
            >
                {/* Custom close button */}
                <Button
                    onClick={() => setShowPreview(false)}
                    className="position-absolute top-0 end-0 m-3 p-2 d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: brandTheme.textColor,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        zIndex: 1050,
                        opacity: 0.7,
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 1,
                            backgroundColor: 'rgba(0,0,0,0.05)'
                        }
                    }}
                >
                    <span aria-hidden="true" style={{ fontSize: '24px' }}>&times;</span>
                </Button>

                {/* Form Content */}
                <div className="preview-form">
                    {renderForm()}
                </div>
            </div>
        </Modal>
    )

    const hexToRgb = (hex) => {
        // Remove # if present
        hex = hex.replace('#', '');

        // Convert 3-digit hex to 6-digits
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }

        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `${r}, ${g}, ${b}`;
    }

    const handleThemeChange = (name, value) => {
        setBrandTheme(prev => ({
            ...prev,
            [name]: value
        }));

    }

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const response = await axios.post('/api/form', {
                fields: enabledFields,
                theme: brandTheme,
                name: formDetails.name, // Add a name field if you haven't already
                country: formDetails.country,
                termsUrl: formDetails.termsUrl,
                planId: planId // Make sure you have access to the planId
            }, getConfigToken());

            // handle img upload here
            if (isLogoChanged) {
                formData.logo = logo;
            }

            // Assuming the API returns the created form's ID
            const { formId } = response.data;

            // Show success message (optional)
            toast.success('Form created successfully!');

            // Navigate to the form's page
            router.push(`/forms/${formId}`);

        } catch (error) {
            console.error('Failed to publish form:', error);
            toast.error(error.response?.data?.message || 'Failed to create form');
        } finally {
            setIsPublishing(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(publishedUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const PublishModal = () => (
        <Modal
            show={showPublishModal}
            onHide={() => setShowPublishModal(false)}
            size="md"
            centered
            contentClassName="border-0 shadow-lg"
            style={{ borderRadius: '16px' }}
        >
            <div
                className="position-relative p-4"
                style={{
                    backgroundColor: brandTheme.backgroundColor,
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}
            >
                <Button
                    onClick={() => setShowPublishModal(false)}
                    className="position-absolute top-0 end-0 m-3 p-2"
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: brandTheme.textColor,
                    }}
                >
                    <span aria-hidden="true">&times;</span>
                </Button>

                <div className="text-center mb-4">
                    <h5 style={{ color: brandTheme.textColor }}>Your Form is Published!</h5>
                    <div className="my-4 d-flex justify-content-center">
                        <QRCodeSVG
                            value={publishedUrl}
                            size={200}
                            level="L"
                            includeMargin={true}
                        />
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <Form.Control
                            type="text"
                            value={publishedUrl}
                            readOnly
                            style={{
                                maxWidth: '300px',
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                color: brandTheme.textColor,
                            }}
                        />
                        <Button
                            onClick={copyToClipboard}
                            variant="outline-primary"
                            style={{
                                borderColor: brandTheme.primaryColor,
                                color: brandTheme.primaryColor,
                            }}
                        >
                            {copySuccess ? 'Copied!' : <Clipboard size={18} />}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );

    return (
        <div style={formStyles.formContainer}>
            <PublishModal />
            <PreviewModal />

            {/* Header with Preview and Publish Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0" style={{ color: brandTheme.textColor }}>
                    Sign Up Form Builder
                </h4>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        onClick={() => setShowPreview(true)}
                        className="d-flex align-items-center gap-2"
                        style={{
                            borderColor: brandTheme.primaryColor,
                            color: brandTheme.primaryColor
                        }}
                    >
                        <Eye size={18} />
                        Preview Form
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="d-flex align-items-center gap-2"
                        style={{
                            backgroundColor: brandTheme.primaryColor,
                            borderColor: brandTheme.primaryColor,
                            color: '#fff'
                        }}
                    >
                        {isPublishing ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span>Publishing...</span>
                            </>
                        ) : (
                            <>
                                <span>Publish</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body className="p-4">
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">
                                    Form Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formDetails.name}
                                    onChange={handleChange}
                                    placeholder="Enter form name"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">
                                    <Globe2 size={12} className="me-1" />
                                    Country
                                </Form.Label>
                                <Form.Select
                                    name="country"
                                    value={formDetails.country}
                                    onChange={handleChange}
                                >
                                    <option value="Global">Global</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                    <option value="India">India</option>
                                    {/* Add more countries as needed */}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">
                                    <Link size={12} className="me-1" />
                                    Terms & Conditions URL
                                </Form.Label>
                                <Form.Control
                                    type="url"
                                    name="termsUrl"
                                    value={formDetails.termsUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/terms"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>

            <Row className="mt-4">
                {/* Left Column - Field Selector */}

                <Col md={4}>
                    <Card className="p-3" style={{ backgroundColor: brandTheme.backgroundColor }}>
                        <h5 className="mb-3" style={{ color: brandTheme.textColor }}>Form Fields</h5>
                        <Form className="branded-form">
                            {Object.entries(AVAILABLE_FIELDS).map(([fieldName, field]) => (
                                <Form.Check
                                    key={fieldName}
                                    type="switch"
                                    id={`field-${fieldName}`}
                                    label={field.label}
                                    checked={enabledFields[fieldName] || false}
                                    onChange={() => handleFieldToggle(fieldName)}
                                    disabled={field.defaultEnabled}
                                    className="mb-2"
                                />
                            ))}
                        </Form>
                    </Card>

                    {/* Theme Editor Card */}
                    <Card className="p-3">
                        <h5 className="mb-3">Theme Settings</h5>
                        <Form>
                            {/* Colors */}
                            {renderColorPicker('primaryColor', 'Primary Color')}
                            {renderColorPicker('secondaryColor', 'Secondary Color')}
                            {renderColorPicker('backgroundColor', 'Background Color')}
                            {renderColorPicker('textColor', 'Text Color')}
                            {renderColorPicker('inputBorderColor', 'Input Border Color')}

                            {/* Font Family */}
                            <Form.Group className="mb-3">
                                <Form.Label>Font Family</Form.Label>

                                {/* Font Selection */}
                                <Form.Select
                                    value={brandTheme.fontFamily}
                                    onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                                    className="mb-3"
                                >
                                    <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto">System Default</option>
                                    <option value="'Poppins', sans-serif">Poppins</option>
                                    <option value="'Roboto', sans-serif">Roboto</option>
                                    <option value="'Open Sans', sans-serif">Open Sans</option>
                                    <option value="'Montserrat', sans-serif">Montserrat</option>
                                    {customFonts.map((font, index) => (
                                        <option key={index} value={font.name}>
                                            Custom Font {index + 1}
                                        </option>
                                    ))}
                                </Form.Select>

                                {/* Custom Font Addition */}
                                <Card className="p-3 mb-3">
                                    <h6 className="mb-3">Add Custom Font</h6>

                                    {/* Upload Method Toggle */}
                                    <div className="btn-group mb-3 w-100">
                                        <Button
                                            variant={fontUploadMethod === 'file' ? 'primary' : 'outline-primary'}
                                            onClick={() => setFontUploadMethod('file')}
                                        >
                                            Upload File
                                        </Button>
                                        <Button
                                            variant={fontUploadMethod === 'url' ? 'primary' : 'outline-primary'}
                                            onClick={() => setFontUploadMethod('url')}
                                        >
                                            Font URL
                                        </Button>
                                    </div>

                                    {/* File Upload or URL Input */}
                                    {fontUploadMethod === 'file' ? (
                                        <Form.Group>
                                            <Form.Control
                                                type="file"
                                                id="fontUpload"
                                                accept=".ttf,.otf,.woff,.woff2"
                                            />
                                            <Form.Text className="text-muted">
                                                Supported formats: TTF, OTF, WOFF, WOFF2
                                            </Form.Text>
                                        </Form.Group>
                                    ) : (
                                        <Form.Group>
                                            <Form.Control
                                                type="url"
                                                placeholder="Enter font URL"
                                                value={fontUrl}
                                                onChange={(e) => setFontUrl(e.target.value)}
                                            />
                                            <Form.Text className="text-muted">
                                                Enter a direct URL to your font file
                                            </Form.Text>
                                        </Form.Group>
                                    )}

                                    {/* Add Font Button */}
                                    <Button
                                        variant="primary"
                                        className="w-100 mt-3"
                                        onClick={handleFontAdd}
                                        disabled={uploadingFont}
                                    >
                                        {uploadingFont ? 'Adding Font...' : 'Add Font'}
                                    </Button>
                                </Card>
                            </Form.Group>

                            {/* Border Radius */}
                            <Form.Group className="mb-3">
                                <Form.Label>Border Radius</Form.Label>
                                <Form.Select
                                    value={brandTheme.borderRadius}
                                    onChange={(e) => handleThemeChange('borderRadius', e.target.value)}
                                >
                                    <option value="0">Square</option>
                                    <option value="0.375rem">Default</option>
                                    <option value="0.5rem">Medium</option>
                                    <option value="1rem">Large</option>
                                    <option value="2rem">Extra Large</option>
                                </Form.Select>
                            </Form.Group>

                            {/* Button Style */}
                            <Form.Group className="mb-3">
                                <Form.Label>Button Style</Form.Label>
                                <Form.Select
                                    value={brandTheme.buttonStyle}
                                    onChange={(e) => handleThemeChange('buttonStyle', e.target.value)}
                                >
                                    <option value="filled">Filled</option>
                                    <option value="outlined">Outlined</option>
                                    <option value="minimal">Minimal</option>
                                </Form.Select>
                            </Form.Group>

                            {/* Label Style */}
                            <Form.Group className="mb-3">
                                <Form.Label>Label Style</Form.Label>
                                <Form.Select
                                    value={brandTheme.labelStyle}
                                    onChange={(e) => handleThemeChange('labelStyle', e.target.value)}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="bold">Bold</option>
                                    <option value="uppercase">Uppercase</option>
                                </Form.Select>
                            </Form.Group>

                            {/* Spacing */}
                            <Form.Group className="mb-3">
                                <Form.Label>Form Spacing</Form.Label>
                                <Form.Select
                                    value={brandTheme.spacing}
                                    onChange={(e) => handleThemeChange('spacing', e.target.value)}
                                >
                                    <option value="compact">Compact</option>
                                    <option value="normal">Normal</option>
                                    <option value="relaxed">Relaxed</option>
                                </Form.Select>
                            </Form.Group>

                            {/* Export Theme Button */}
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="w-100"
                                onClick={() => {
                                    const themeString = JSON.stringify(brandTheme, null, 2)
                                    navigator.clipboard.writeText(themeString)
                                    alert('Theme configuration copied to clipboard!')
                                }}
                            >
                                Export Theme
                            </Button>
                        </Form>
                    </Card>
                </Col>

                {/* Right Column - Form Preview */}
                <Col md={8}>

                    <Card className="p-4" style={{ backgroundColor: brandTheme.backgroundColor }}>
                        {renderForm()}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default SignUpBuilder 