import React, { Component } from 'react';
import { MdInsertDriveFile } from 'react-icons/md';
import Dropzone from 'react-dropzone';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';
import api from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';

class Box extends Component {
  state = { box: {} };

  async componentDidMount() {
    this.subscriteToNewFiles();
    const { match } = this.props;
    const box = match.params.id;
    const response = await api.get(`/boxes/${box}`);
    this.setState({ box: response.data });
  }

  subscriteToNewFiles = () => {
    const { match } = this.props;
    const { box } = this.state;
    const boxId = match.params.id;
    const io = socket('https://omnistack-backend-node.herokuapp.com/');
    io.emit('connectRoom', boxId);
    io.on('file', (data) => {
      this.setState({
        box: { ...box, files: [data, ...box.files] },
      });
    });
  };

  renderDropzoneContent = (getRootProps, getInputProps) => (
    <div className='upload' {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Arraste arquivos ou clique aqui</p>
    </div>
  );

  handleUpload = (files) => {
    const { box } = this.state;
    files.forEach((file) => {
      const data = new FormData();
      data.append('file', file);
      api.post(`/boxes/${box._id}/files`, data);
    });
  };

  render() {
    const { box } = this.state;
    return (
      <div id='box-container'>
        <header>
          <img src={logo} alt='' />
          <h1>{box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) =>
            this.renderDropzoneContent(getRootProps, getInputProps)
          }
        </Dropzone>
        <ul>
          {box.files &&
            box.files.map((file) => (
              <li key={file._id}>
                <a
                  className='fileInfo'
                  href={file.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <MdInsertDriveFile size={24} color='#a5cfff' />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  Há{' '}
                  {distanceInWords(file.createdAt, new Date(), {
                    locale: pt,
                  })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default Box;
