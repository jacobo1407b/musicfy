import React, { useState, useEffect, useCallback } from "react";
import "./addAlbumForm.scss";
import { Form, Input, Button, Image, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import NoImage from "../../../assets/png/no-image.png";
import firebase from "../../../utils/Firebase";
import { map } from "lodash";
import { toast } from "react-toastify";

import { v4 as uuidv4 } from "uuid";
import "firebase/firestore";
import "firebase/storage";
const db = firebase.firestore(firebase);
const AddAlbumForm = (props) => {
  const { setShowModal } = props;
  const [albumImage, setAlbumImage] = useState(null);
  const [file, setFile] = useState(null);
  const [artistas, setArtistas] = useState([]);
  const [formData, setFormData] = useState(initialValueForm());
  const [isloading, setisloading] = useState(false);
  useEffect(() => {
    db.collection("artist")
      .get()
      .then((response) => {
        const arrayArtist = [];
        map(response?.docs, (art) => {
          const data = art.data();
          arrayArtist.push({
            key: art.id,
            value: art.id,
            text: data.name,
          });
        });
        setArtistas(arrayArtist);
      });
  }, []);
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setAlbumImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (filename) => {
    const ref = firebase.storage().ref().child(`album/${filename}`);
    return ref.put(file);
  };
  const onSubmit = () => {
    if (!formData.name || !formData.artist) {
      toast.warn("Campos requeridos");
    } else if (!file) {
      toast.warn("Ingrese una imagen");
    } else {
      setisloading(true);
      const filename = uuidv4();
      uploadImage(filename)
        .then(() => {
          db.collection("albums")
            .add({
              name: formData.name,
              artist: formData.artist,
              banner: filename,
            })
            .then(() => {
              toast.success("Album agregado");
              resetForm();
              setisloading(false);
              setShowModal(false);
            })
            .catch(() => {
              toast.error("Error al guardar informacion");
              setisloading(false);
            });
        })
        .catch(() => {
          toast.error("Error al cargar la imagen");
          setisloading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm);
    setAlbumImage(null);
    setFile(null);
  };
  return (
    <Form className="add-album-form" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Field className="album-avatar" width={5}>
          <div
            {...getRootProps()}
            className="avatar"
            style={{ backgroundImage: `url('${albumImage}')` }}
          />
          <input {...getInputProps()} />
          {!albumImage && <Image src={NoImage} />}
        </Form.Field>
        <Form.Field className="album-inputs" width={11}>
          <Input
            placeHoder="Nombre del album"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Dropdown
            placeholder="El album pertenece"
            search
            fluid
            selection
            options={artistas}
            lazyLoad
            onChange={(e, data) =>
              setFormData({ ...formData, artist: data.value })
            }
          />
        </Form.Field>
      </Form.Group>
      <Button type="submit" loading={isloading}>
        Crear Album
      </Button>
    </Form>
  );
};

function initialValueForm() {
  return {
    name: "",
    artist: "",
  };
}
export default AddAlbumForm;
