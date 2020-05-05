import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from 'react-toastify';
import { reauthenticate } from '../../utils/Api';
import alerErrors from '../../utils/AlertError';
import firebase from '../../utils/Firebase';
import 'firebase/auth';

const UserPassword = (props) => {
  const { setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setTitleModal("Actualizar contraseña");
    setContentModal(<ChangePasswordForm setShowModal={setShowModal} />);
    setShowModal(true);
  };

  return (
    <div className="user-password">
      <h3>Contraseña: *** *** *** ***</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
};

const ChangePasswordForm = (props) => {
  const { setShowModal } = props
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.repeatNewPassword) {
      toast.warn('Llena todos los campos')
    } else if (formData.currentPassword === formData.newPassword) {
      toast.warn('La contraseña anterior no puede ser igual a la nueva')
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      toast.warn('Las nuevas contraseñas deben ser iguales')
    } else if (formData.newPassword.length < 6) {
      toast.warn('La contraseña debe ser mayor a 6 valores')
    } else {
      setIsLoading(true);
      reauthenticate(formData.currentPassword)
        .then(() => {
          const currentUser = firebase.auth().currentUser
          currentUser.updatePassword(formData.newPassword)
            .then(() => {
              toast.success('Contraseña actualizada')
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut()
            })
            .catch(err => {
              alerErrors(err?.code)
              setIsLoading(false);
            })
        })
        .catch(err => {
          alerErrors(err?.code)
          setIsLoading(false);
        })
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="contraseña actual"
          type={showPassword ? "text" : "password"}
          onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
          icon={
            <Icon
              name={showPassword ? "eye slash" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="contraseña nueva"
          type={showPassword ? "text" : "password"}
          onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
          icon={
            <Icon
              name={showPassword ? "eye slash" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="confirma contraseña nueva"
          type={showPassword ? "text" : "password"}
          onChange={e => setFormData({ ...formData, repeatNewPassword: e.target.value })}
          icon={
            <Icon
              name={showPassword ? "eye slash" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />}
        />
      </Form.Field>
      <Button
        loading={isLoading}
        type="submit">Actualizar contraseña</Button>
    </Form>
  );
};
export default UserPassword;
