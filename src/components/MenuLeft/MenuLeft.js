import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import "./MenuLeft.scss";
import { isUserAdmin } from "../../utils/Api";
import BasicModal from "../Modal/BasicModal/BasicModal";
import AddArtistForm from '../Artists/AddArtistForm/AddArtistForm';
class MenuLeft extends Component {
  constructor(props) {
    super(props);
    const { user, location } = props;
    this.state = {
      user,
      activeMenu: location.pathname,
      userAdmin: false,
      showModal: false,
      titleModal: null,
      contentModal: null
    };
  }

  async componentDidMount() {
    const { location } = this.props;
    const { user } = this.state;
    let respuesta = await isUserAdmin(user.uid);
    this.setState({
      userAdmin: respuesta,
      activeMenu: location.pathname
    });
  }
  handlermenu = (e, menu) => {
    this.setState({
      activeMenu: menu.to
    });
  };
  setShowModal = data => {
    this.setState({
      showModal: data
    });
  };

  handleModal = type => {
    switch (type) {
      case "artist":
        this.setState({
          titleModal: "Nuevo artista",
          contentModal: <AddArtistForm setShowModal={this.setShowModal} />,
          showModal: true
        });
        break;
      case "song":
        this.setState({
          titleModal: "Nuevo cancion",
          contentModal: <h2>Formulario nueva cancion</h2>,
          showModal: true
        });
        break;
      default:
        this.setState({
          titleModal: null,
          contentModal: null,
          showModal: false
        });
        break;
    }
  };
  render() {
    this.componentDidMount();
    const { activeMenu, userAdmin } = this.state;
    return (
      <>
        <Menu className="menu-left" vertical>
          <div className="top">
            <Menu.Item
              as={Link}
              to="/"
              active={activeMenu === "/"}
              onClick={this.handlermenu}
            >
              <Icon name="home" /> Inicio
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/artistas"
              active={activeMenu === "/artistas"}
              onClick={this.handlermenu}
            >
              <Icon name="music" /> Artistas
            </Menu.Item>
          </div>

          {userAdmin && (
            <div className="footer">
              <Menu.Item onClick={() => this.handleModal("artist")}>
                <Icon name="plus square outline" /> Nuevo artista
              </Menu.Item>
              <Menu.Item onClick={() => this.handleModal("song")}>
                <Icon name="plus square outline" /> Nuevo canción
              </Menu.Item>
            </div>
          )}
        </Menu>
        <BasicModal
          algo={this.state}
          show={this.state.showModal}
          setShow={this.setShowModal}
          title={this.state.titleModal}
        >
          {this.state.contentModal}
        </BasicModal>
      </>
    );
  }
}


export default withRouter(MenuLeft);
