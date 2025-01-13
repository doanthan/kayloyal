
import { useState, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

const Cropper = ({ imageToCrop, setCroppedImage, showModal = false, setModal, aspect = 1, targetHeight, targetWidth }) => {
    const [crop, setCrop] = useState({
        unit: '%',
        aspect: aspect,
        x: 10,
        y: 10,
        width: 20,
        height: 10
    });
    const [image, setImage] = useState(null);

    const saveImage = async () => {
        cropImageNow()
        setModal(false)
    }


    const cropImageNow = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            targetWidth,
            targetHeight
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        setCroppedImage(base64Image);

    };
    return (
        <Modal show={showModal}>
            <div>
                {imageToCrop && (
                    <div>
                        <ReactCrop src={imageToCrop} onImageLoaded={setImage}

                            crop={crop} onChange={(newCrop) => {
                                setCrop(newCrop);
                                // Set hasCropped to true when the crop is changed
                            }} />


                    </div>
                )}
            </div>
            <Modal.Footer>
                <div className='text-center'>
                    <Button variant="primary" onClick={saveImage} >
                        Save Changes
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default Cropper