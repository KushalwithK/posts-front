import React, { useState, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
};

const img = {
    display: 'flex',
    width: 100,
    height: 100,
};

const thumbInner = {
    display: 'flex',
    alignItems: "flex-start",
    minWidth: 0,
    overflow: 'hidden',
    margin: '5px'
};

const fileDrop = {
    padding: '2rem',
    border: '2px dotted #e0e0e0',
    cursor: 'pointer'
}

const DropZone = ({ images, setImages }) => {

    const [open, setOpen] = useState(false);
    const [imagesUrl, setImageUrl] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        const newImages = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        );
        setImages((prevImages) => [...prevImages, ...newImages]);
    }, []);

    const handleRemove = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        onDrop,
    });

    return (
        <div>
            <div {...getRootProps({ className: 'dropzone' })} accept="['images/jpg', 'images/png', 'images/jpeg']" style={fileDrop}>
                <input {...getInputProps()} />
                <p>Drag and drop some images here, or click to select images</p>
            </div>
            <div className="thumbnails" style={thumbsContainer}>
                {images.map((image, index) => (
                    <div className="thumbnail" style={thumbInner}>
                        <img src={image.preview} style={img} onClick={() => {
                            setImageUrl(image.preview)
                            setOpen(true)
                        }} />
                        <button className="remove-btn" onClick={() => handleRemove(index)}>
                            <FaTimes />
                        </button>
                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            slides={[
                                { src: imagesUrl },
                            ]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DropZone