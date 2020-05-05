import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertError";
import firebase from "../../utils/Firebase";
import "firebase/auth";

const UserEmail = (props) => {
  const { user, setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setTitleModal("Actualizar email");
    setContentModal(
      <ChangeEmailForm email={user.email} setShowModal={setShowModal} />
    );
    setShowModal(true);
  };
  return (
    <div className="user-email">
      <h3>Emai: {user.email}l</h3>
      <Button onClick={onEdit}>Actualizar</Button>
    </div>
  );
};

const ChangeEmailForm = (props) => {
  const { email, setShowModal } = props;
  const [showPasword, setShowPasword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = () => {
    if (!formData.email) {
      toast.warn("El email es iguals");
    } else {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updateEmail(formData.email)
            .then(() => {
              toast.success("Email actualizado");
              setIsLoading(false);
              setShowModal(false);
              currentUser.sendEmailVerification().then(() => {
                firebase.auth().signOut();
              });
            })
            .catch((err) => {
              console.log(err);
              alertErrors(err.code);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          alertErrors(err?.code);
          setIsLoading(false);
        });
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={email}
          type="email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Contraseña"
          type={showPasword ? "text" : "password"}
          icon={
            <Icon
              name={showPasword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowPasword(!showPasword)}
            />
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar email
      </Button>
    </Form>
  );
};

export default UserEmail;
