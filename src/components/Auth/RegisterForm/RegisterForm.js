import React, { Component } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import firebase from "../../../utils/Firebase";
import "firebase/auth";
import "./RegisterForm.scss";
import { validateEmail } from "../../../utils/Validations";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    const { setSelectedForm } = props;
    this.state = {
      setSelectedForm,
      email: "",
      password: "",
      username: "",
      showPassword: false,
      formError: {},
      isLoading: false
    };
  }
  onSubmit = () => {
    this.setState({ formError: {} });
    const { email, password, username } = this.state;
    let errors = {};
    let formOk = true;
    if (!validateEmail(email)) {
      errors.email = true;
      formOk = false;
    }
    if (password.length < 6) {
      errors.password = true;
      formOk = false;
    }
    if (!username) {
      errors.username = true;
      formOk = false;
    }
    this.setState({
      formError: errors
    });
    if (formOk) {
      this.setState({
        isLoading: true
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          this.changeUserName();
          this.sendVerificationEmail();
        })
        .catch(() => {
          toast.error("Error al crear la cuenta.");
        })
        .finally(() => {
          this.setState({
            isLoading: false
          });
          this.state.setSelectedForm(null);
        });
    }
  };

  handleShowPassword = () => {
    var value = this.state.showPassword;
    this.setState({
      showPassword: !value
    });
  };
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  changeUserName = () => {
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: this.state.username
      })
      .catch(() => {
        toast.error("Error al asignar nombre de usuario");
      });
  };

  sendVerificationEmail = () => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        toast.success("Se ha enviado un email de verificacion");
      })
      .catch(() => {
        toast.error("Error al enviar el email de verificacion");
      });
  };
  render() {
    const { formError, showPassword, isLoading } = this.state;
    return (
      <div className="register-form">
        <h1>Empieza a escuchar con una cuenta de Musicfy gratis </h1>
        <Form onSubmit={this.onSubmit} onChange={this.onChange}>
          <Form.Field>
            <Input
              type="text"
              name="email"
              placeholder="correo electronico"
              icon="mail outline"
              //onChange={}
              error={formError.email}
            />
            {formError.email && (
              <span className="error-text">
                Por favor, ingresa un correo valido
              </span>
            )}
          </Form.Field>
          <Form.Field>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="contraseña"
              icon={
                showPassword ? (
                  <Icon
                    name="eye slash outline"
                    link
                    onClick={this.handleShowPassword}
                  />
                ) : (
                  <Icon name="eye" link onClick={this.handleShowPassword} />
                )
              }
              //onChange={}
              error={formError.password}
            />
            {formError.password && (
              <span className="error-text">
                Por favor, elige una contraseña superior a 5 caracteres
              </span>
            )}
          </Form.Field>
          <Form.Field>
            <Input
              type="text"
              name="username"
              placeholder="¿Como deberiamos llamarte?"
              icon="user circle outline"
              //onChange={}
              error={formError.username}
            />
            {formError.username && (
              <span className="error-text">Por favor, ingresa un nombre</span>
            )}
          </Form.Field>
          <Button type="submit" loading={isLoading}>
            Continuar
          </Button>
        </Form>
        <div className="register-form__options">
          <p onClick={() => this.state.setSelectedForm(null)}>Volver</p>
          <p>
            ¿Ya tienes Musicfy?
            <span onClick={() => this.state.setSelectedForm("login")}>
              Inicia sesion
            </span>
          </p>
        </div>
      </div>
    );
  }
} /*
function RegisterForm(props){
  const {setSelectedForm}=props;
  return (
    <div className="register-form">
      <h1>Formulario de registro</h1>
    </div>
  );
}*/
/*
function defaultValueForm(){
  return{
    email:"",
    password:"",
    username:""
  }
}*/
export default RegisterForm;
