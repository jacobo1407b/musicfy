import React, { Component } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/Firebase";
import "firebase/auth";
import "./LoginForm.scss";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    const { setSelectedForm } = props;
    this.state = {
      setSelectedForm,
      showPassword: false,
      email: "",
      password: "",
      formError: {},
      isLoading: false,
      userActive: true,
      user: null
    };
  }

  handlerShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  onSubmit = () => {
    const { email, password } = this.state;
    this.setState({
      formError: {}
    });
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
    this.setState({
      formError: errors
    });
    if (formOk) {
      this.setState({
        isLoading: true
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          this.setState({
            user: res.user,
            userActive: res.user.emailVerified
          });
          if (!res.user.emailVerified) {
            toast.warning("Verifica tu cuenta por favor");
          }
        })
        .catch(err => {
          console.log(err);
          handleErrors(err.code);
        })
        .finally(() => {
          this.setState({
            isLoading: false
          });
        });
    }
  };
  load = data => {
    this.setState({
      isLoading: data
    });
  };
  us = data => {
    this.setState({
      userActive: data
    });
  };
  render() {
    return (
      <div className="login-form">
        <h1>Musica para todos.</h1>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <Input
              type="text"
              name="email"
              placeholder="Correo electronico"
              icon="mail outline"
              error={this.state.formError.email}
              onChange={this.onChange}
            />
            {this.state.formError.email && (
              <span className="error-text">
                Por favor, ingresa un correo electronico
              </span>
            )}
          </Form.Field>
          <Form.Field>
            <Input
              type={this.state.showPassword ? "text" : "password"}
              name="password"
              onChange={this.onChange}
              placeholder="Contraseña"
              icon={
                this.state.showPassword ? (
                  <Icon
                    name="eye slash outline"
                    link
                    onClick={this.handlerShowPassword}
                  />
                ) : (
                  <Icon name="eye" link onClick={this.handlerShowPassword} />
                )
              }
              error={this.state.formError.password}
            />
            {this.state.formError.password && (
              <span className="error-text">
                Por favor, ingresa una contraseña valida
              </span>
            )}
          </Form.Field>
          <Button type="submit" loading={this.state.isLoading}>
            Iniciar Sesion
          </Button>
        </Form>
        {!this.state.userActive && (
          <ButtonResetSendVerification
            user={this.state.user}
            isLoading={this.load}
            userActive={this.us}
          />
        )}
        <div className="login-form__options">
          <p onClick={() => this.state.setSelectedForm(null)}>Volver</p>
          <p>
            ¿No tienes cuenta? {""}
            <span onClick={() => this.state.setSelectedForm("register")}>
              Registrarte
            </span>
          </p>
        </div>
      </div>
    );
  }
}

const ButtonResetSendVerification = props => {
  const { user, isLoading, userActive } = props;
  const resendVerificationEmail = () => {
    user
      .sendEmailVerification()
      .then(() => {
        toast.success("Se ha enviado un email de verificacion");
      })
      .catch(err => {
        handleErrors(err.code);
      })
      .finally(() => {
        isLoading(false);
        userActive(true);
      });
  };
  return (
    <div className="resend-verification-email">
      <p>
        si no has recibido el email de verificacion puedes volver a enviarlo
        haciendo click <span onClick={resendVerificationEmail}>aqui.</span>
      </p>
    </div>
  );
};

const handleErrors = code => {
  switch (code) {
    case "auth/wrong-password":
      toast.warning("El usuario o contraseña son incorrectos");
      break;
    case "auth/too-many-requests":
      toast.warning("Has enviado demasiadas solicitudes de envio");
      break;
    case "auth/user-not-found":
      toast.error("usuario no encontrado");
      break;
    default:
      break;
  }
};
export default LoginForm;
