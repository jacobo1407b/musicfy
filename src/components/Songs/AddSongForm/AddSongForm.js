import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import "./addSongForm.scss";
import firebase from "../../../utils/Firebase";
import { useDropzone } from "react-dropzone";
import { map } from "lodash";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import "firebase/firestore";
import "firebase/storage";
const db = firebase.firestore(firebase);

const AddSongForm = (props) => {
  const { setShowModal } = props;

  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialValueForm());

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((response) => {
        const arrayAlbum = [];
        map(response?.docs, (alb) => {
          const data = alb.data();
          arrayAlbum.push({
            key: alb.is,
            value: alb.id,
            text: data.name,
          });
        });
        setAlbums(arrayAlbum);
      });
  }, []);

  const onDrop = useCallback(
    (acceptFile) => {
      const files = acceptFile[0];
      setFile(files);
      setFormData({
        ...formData,
        name: files.name,
      });
    },
    [formData]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const uploadSong = (nombre) => {
    const ref = firebase.storage().ref().child(`song/${nombre}`);
    return ref.put(file);
  };
  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.error("Complete el formulario");
    } else if (!file) {
      toast.error("Suba una canción");
    } else {
      setLoading(true);
      const fileName = uuidv4();
      uploadSong(fileName)
        .then(() => {
          db.collection("songs")
            .add({
              name: formData.name,
              album: formData.album,
              fileName,
            })
            .then(() => {
              toast.success("Cancion subida correctamente");
              resetForm();
              setLoading(false);
              setShowModal(false);
            })
            .catch(() => {
              toast.error("Error al cargar la cancion");
              setLoading(false);
            });
        })
        .catch(() => {
          setLoading(false);
          toast.error("Error en la conexión");
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setAlbums([]);
  };
  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Nombre de la canción"
          defaultValue={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          options={albums}
          placeholder="Asigna un album"
          onChange={(e, data) =>
            setFormData({
              ...formData,
              album: data.value,
            })
          }
          search
          selection
          lazyLoad
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name="cloud upload" className={file && "load"} />
          <div>
            <p>
              Arrastra tu cancion o haz click <span>aqui</span>
            </p>
            {file && (
              <p>
                Cancion subida: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit" loading={loading}>
        Subir cancion
      </Button>
    </Form>
  );
};

function initialValueForm() {
  return {
    name: "",
    album: "",
  };
}
export default AddSongForm;
