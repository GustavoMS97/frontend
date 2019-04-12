import React, { Component } from 'react';
import api from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';

class Main extends Component {
  state = {
    newBox: '',
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { newBox } = this.state;
    const { history } = this.props;
    const response = await api.post('/boxes', { title: newBox });
    const { _id } = response.data;
    history.push(`/box/${_id}`);
  };

  handleInputChange = (e) => {
    this.setState({ newBox: e.target.value });
  };

  render() {
    const { newBox } = this.state;
    return (
      <div id='main-container'>
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt='' />
          <input
            placeholder='Criar um box'
            value={newBox}
            onChange={this.handleInputChange}
          />
          <button type='submit'>Criar</button>
        </form>
      </div>
    );
  }
}

export default Main;
