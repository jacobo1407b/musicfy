import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Image } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import NoImage from '../../../assets/png/no-image.png';
import './AddArtistForm.scss';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../../utils/Firebase';
import 'firebase/storage';
import 'firebase/firestore';

const db = firebase.firestore(firebase);
const AddArtistForm = ({ setShowModal }) => {

    const [banner, setBanner] = useState(null);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState(initialValueFrom())
    const [isLoading, setIsLoading] = useState(false)

    const onDrop = useCallback(acceptedFile => {
        const file = acceptedFile[0];
        setFile(file);
        setBanner(URL.createObjectURL(file));
    })
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/jpeg, image/png",
        noKeyboard: true,
        onDrop
    });
    const uploadImage = (filename) => {
        const ref = firebase.storage().ref().child(`artist/${filename}`);
        return ref.put(file)
    }
    const onSubmit = () => {
        if (!formData.name) {
            toast.warn("Añade el nombre del artista")
        } else if (!file) {
            toast.warn("Añade un banner")
        } else {
            setIsLoading(true);
            const filename = uuidv4();
            uploadImage(filename)
                .then(() => {
                    db.collection("artist").add({
                        name: formData.name,
                        banner: filename
                    })
                        .then(() => {
                            toast.success('Artista agregado correctamente');
                            resetForm();
                            setIsLoading(false);
                            setShowModal(false);
                        })
                        .catch(() => {
                            toast.error('Error al crear el artista');
                            setIsLoading(false);
                        })
                })
                .catch(() => {
                    toast.error('Error al subir la imagen')
                    setIsLoading(false);
                });
        }
        //setShowModal(false);
    }

    const resetForm = () => {
        setFormData(initialValueFrom());
        setFile(null);
        setBanner(false);
    }
    return (
        <Form className="add-artist-form" onSubmit={onSubmit}>
            <Form.Field className="artist-banner">
                <div {...getRootProps()}
                    className="banner"
                    style={{ backgroundImage: `url('${banner}')` }}
                />
                <input {...getInputProps()} />
                {!banner && <Image src={NoImage} />}
            </Form.Field>
            <Form.Field className="artist-avatar">
                <div
                    className="avatar"
                    style={{ backgroundImage: `url('${banner ? banner : NoImage}')` }}
                />
            </Form.Field>
            <Form.Field>
                <Input
                    placeholder="Nombre del artista"
                    onChange={e => setFormData({ name: e.target.value })}
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>
                Crear artista
            </Button>
        </Form>
    )
}

function initialValueFrom() {
    return {
        name: ""
    }
}
export default AddArtistForm
