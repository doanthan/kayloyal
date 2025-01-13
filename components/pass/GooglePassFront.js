import { useState, useEffect } from 'react'
import bwipjs from 'bwip-js'


const GooglePassFront = ({
    name = 'Pass Name',
    iconImage,
    stripImage = '/images/city-guide/blog/01.jpg',
    backgroundColor = '#FFFFFF',
    textColor = '#000000',
    qrCode,
    programName,
    memberIdFormat,
    barcodeType = 'QR_CODE',
    barcodeMessage = 'ID-ABC123',
    points = 0,
    pointsLabel = "Points"
}) => {
    const [barcodeElement, setBarcodeElement] = useState(null)
    const bwipType = {
        'QR_CODE': 'qrcode',
        'PDF_417': 'pdf417',
        'AZTEC': 'azteccode',
        'CODE_128': 'code128'
    }[barcodeType] || 'qrcode'

    useEffect(() => {
        const generateBarcode = async () => {
            try {

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
                    settings.height = 40  // Rectangle for linear barcodes
                    settings.width = 100  // Control width for linear barcodes

                }

                // Generate barcode
                const canvas = document.createElement('canvas')
                await bwipjs.toCanvas(canvas, settings)

                setBarcodeElement(
                    <div
                        style={{
                            background: 'white',
                            padding: '8px',
                            borderRadius: '12px',
                            width: isSquareBarcode ? '112px' : '156px',
                            height: isSquareBarcode ? '112px' : '86px',
                        }}
                        className="text-center"

                    >
                        <div
                            className="text-center"
                            style={{
                                width: isSquareBarcode ? '96px' : '140px',
                                height: isSquareBarcode ? '96px' : '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white'
                            }}
                        >
                            <img
                                className="text-center"
                                src={canvas.toDataURL('image/png')}
                                alt={`${barcodeType} barcode`}
                                style={{
                                    width: isSquareBarcode ? '96px' : 'auto',
                                    height: isSquareBarcode ? '96px' : 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    margin: '0 auto'
                                }}
                            />
                        </div>
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
        <div
            className="h-100 shadow-sm d-flex flex-column justify-content-between"
            style={{
                borderRadius: '16px',
                backgroundColor: backgroundColor || '#FFFFFF',
            }}
        >
            {/* Pass Content */}
            <div className="px-3 pt-3">
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
                    opacity: 0.2
                }} />

                {/* Pass Name and Program Details */}
                <div className="mb-4">
                    <h6
                        className="m-0"
                        style={{
                            fontSize: '16px',
                            fontWeight: 500  // Optional: adjust font weight if needed
                        }}
                    >
                        {name !== "" ? name : "kayloyal"}
                    </h6>                    {programName && <small className="text-muted d-block">{programName}</small>}
                </div>



                <div className="text-center d-flex flex-column align-items-center">
                    <div className="d-flex justify-content-center">
                        {barcodeElement}
                    </div>
                    <div className="mt-2">
                        {barcodeMessage || "SAMPLE"}
                    </div>
                </div>
            </div>

            {/* Strip Image - At bottom */}
            <div
                style={{
                    height: '35%',
                    overflow: 'hidden',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px',
                    marginTop: 'auto'  // Push to bottom
                }}
            >
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
