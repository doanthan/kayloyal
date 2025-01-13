import { useState, useEffect } from 'react'
import bwipjs from 'bwip-js'


const GooglePassFront = ({
    name = 'Pass Name',
    iconImage,
    stripImage = '/images/city-guide/blog/01.jpg',
    backgroundColor = '#FFFFFF',
    foregroundColor = '#000000',
    qrCode,
    programName,
    memberIdFormat,
    pointsLabel,
    barcodeType = 'QR_CODE',
    barcodeMessage = 'ID-ABC123' }) => {
    const [barcodeElement, setBarcodeElement] = useState(null)
    const [isSquareBarcode, setIsSquareBarcode] = useState(false)  // Add this state


    useEffect(() => {
        const generateBarcode = async () => {
            try {
                const bwipType = {
                    'QR_CODE': 'qrcode',
                    'PDF_417': 'pdf417',
                    'AZTEC': 'azteccode',
                    'CODE_128': 'code128'
                }[barcodeType] || 'qrcode'


                // Set square barcode state
                const isSquareBarcode = (bwipType === 'qrcode' || bwipType === 'azteccode')
                // Different settings based on barcode type
                const settings = {
                    bcid: bwipType,
                    text: barcodeMessage || 'SAMPLE',
                    scale: isSquareBarcode ? 4 : 2,
                    includetext: false,
                    textxalign: 'center',
                }

                // Adjust dimensions based on type
                if (isSquareBarcode) {
                    settings.width = 32  // Will result in 128px with scale=4
                    settings.height = 32
                } else {
                    settings.height = 30  // Rectangle for linear barcodes
                    settings.width = 100  // Control width for linear barcodes

                }

                // Generate barcode
                const canvas = document.createElement('canvas')
                await bwipjs.toCanvas(canvas, settings)

                setBarcodeElement(
                    <div
                        style={{
                            background: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <div style={{
                            width: isSquareBarcode ? '128px' : '140px',
                            height: isSquareBarcode ? '128px' : '70px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'white'
                        }}>
                            <img
                                src={canvas.toDataURL('image/png')}
                                alt={`${barcodeType} barcode`}
                                style={{
                                    width: isSquareBarcode ? '128px' : 'auto',
                                    height: isSquareBarcode ? '128px' : 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: isSquareBarcode ? 'contain' : 'contain'
                                }}
                            />
                        </div>
                        {/* Only show text for non-QR codes */}
                        {!isSquareBarcode && (
                            <div style={{
                                fontSize: '16px',
                                color: '#666',
                                textAlign: 'center',
                                maxWidth: '140px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {barcodeMessage || "SAMPLE"}
                            </div>
                        )}

                    </div>
                )
            } catch (error) {
                console.error('Error generating barcode:', error)
                setBarcodeElement(
                    <div className="bg-dark d-flex align-items-center justify-content-center text-white">
                        {`${barcodeType} Preview`}
                    </div>
                )
            }
        }

        generateBarcode()
    }, [barcodeType, barcodeMessage])

    return (
        <div className="h-100 shadow-sm d-flex flex-column justify-content-between"
            style={{
                borderRadius: '16px',
                backgroundColor: backgroundColor || '#FFFFFF',
            }}>
            {/* Pass Content */}
            <div className="px-3 pt-3" style={{ backgroundColor: backgroundColor || '#FFFFFF' }}>
                <div className="mb-2 d-flex align-items-center">
                    <div
                        className="bg-secondary me-2"
                        style={{
                            width: '32px',
                            height: '32px',
                        }}
                    >
                        {iconImage && (
                            <img
                                src={iconImage}
                                alt="Icon"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Update the horizontal line color */}
                <hr style={{
                    margin: '0 0 8px 0',
                    borderColor: foregroundColor || '#000000',
                    opacity: 0.2
                }} />

                {/* Pass Name and Program Details */}
                <div className="mb-4">
                    <h6 className="m-0">{name !== "" ? name : "kayloyal"}</h6>
                    {programName && <small className="text-muted d-block">{programName}</small>}
                </div>

                {/* Points/Member ID if available */}
                {(pointsLabel || memberIdFormat) && (
                    <div className="mb-4">
                        {pointsLabel && <div className="mb-1">{pointsLabel}: 0</div>}
                        {memberIdFormat && <div>Member ID: {memberIdFormat}</div>}
                    </div>
                )}

                <div className="text-center mb-4">
                    <div
                        className="mx-auto"
                        style={{
                            display: 'inline-block',  // Only take up needed space
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: 'white',
                            width: isSquareBarcode ? '148px' : '200px',
                            padding: '10px',
                            marginBottom: memberIdFormat ? '8px' : '0'  // Add space if there's a member ID
                        }}
                    >
                        {barcodeElement}
                        {memberIdFormat && (

                            { memberIdFormat }
                        )}
                    </div>
                </div>

            </div>

            {/* Strip Image - At bottom with 35% height */}
            <div style={{ height: '35%', overflow: 'hidden', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', marginTop: 'auto' }}>
                <img
                    src={stripImage}
                    alt="Strip"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        </div>
    )
}

export default GooglePassFront
