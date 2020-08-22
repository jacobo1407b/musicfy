import React from "react";
import { Table, Icon } from "semantic-ui-react";
import { map } from "lodash";
import "./ListSong.scss";

const ListSong = ({ albumImage, songs, playerSong }) => {
  return (
    <Table inverted className="list-songs">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>Titulo</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {map(songs, (cancion) => (
          <Cancion
            key={cancion.id}
            album={albumImage}
            song={cancion}
            playerSong={playerSong}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

function Cancion(props) {
  const { song, album, playerSong } = props;

  const onPlay = () => {
    playerSong(album, song.name, song.fileName);
  };
  return (
    <Table.Row onClick={onPlay}>
      <Table.HeaderCell collapsing>
        <Icon name="play circle outline" />
      </Table.HeaderCell>
      <Table.HeaderCell>{song.name}</Table.HeaderCell>
    </Table.Row>
  );
}

export default ListSong;
