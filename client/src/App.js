import React from 'react';
import axios from 'axios';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      message: null,
      idToDelete: null,
      idToUpdate: null,
      newMessage: null
    }
  }

  componentDidMount() {
    this.getDataFromDB();
    // Set up and interval to call the getdDataFromDB function every second.
    setInterval(this.getDataFromDB, 1000);
  }

  getDataFromDB = () => {
    axios({
      url: 'http://localhost:3001/api/getData',
      method: 'GET'
    }).then((response) => {
      console.log(response);
      // Update our response with the data from the backend.
      this.setState({ data: response.data.data })
    }).catch((error) => {
      console.log(error);
    });
  }

  // Made function as an arrow function to negate the binding of the "this" keyword.
  postDataToDB = message => {
    // 1. Figure out what ID this message needs to have.
    // 2. Use Axios to connect to our API server, which will send the data to our database.

    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      idToBeAdded++;
    }

    axios({
      url: 'http://localhost:3001/api/postData',
      method: 'POST',
      data: {
        id: idToBeAdded,
        message: message
      }
    }).then((reponse) => {
      console.log(reponse);
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteFromDB = idToDelete => {
    let objIdToDelete = null;

    this.state.data.forEach(dat => {
      if (String(dat.id) === String(idToDelete)) {
        objIdToDelete = dat.id;
      }

      axios({
        url: 'http://localhost:3001/api/deleteData',
        method: 'DELETE',
        data: {
          id: objIdToDelete
        }
      }).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  updateDataInDB = (idToUpdate, newMessage) => {
    console.log('update');
  }

  renderListItems() {
    const { data } = this.state;

    if (data.length === 0) {
      // If our data array doesn't have any contents, display a message letting the user know that the database doesn't have anything inside it yet.
      return 'No DB ENTRIES YET'
    } else {
      return data.map(dat => (
        <li key={dat}>
          <span> id: {dat.id} </span>
          <br />
          <span> message: {dat.message}</span>
        </li>
      ));
    }
  }

  render() {
    const { message, idToDelete, idToUpdate, newMessage } = this.state;

    return (
      <div className="App">

        {/* Disply the data we retrieve from the database */}
        <ul className='App-List'>
          {this.renderListItems()}
        </ul>

        <div className='App-section'>
          <input 
            type='text'
            placeholder='Add a New Message to the database'
            onChange={event => this.setState({ message: event.target.value})}
          />
          <button onClick={() => this.postDataToDB(message)}>ADD</button>
        </div>

        <div className='App-section'>
          <input
            type='text'
            placeholder='Enter ID of Message to delete'
            onChange={event => this.setState({ idToDelete: event.target.value})}
          />
          <button onClick={() => this.deleteFromDB(idToDelete)}>DELETE</button>
        </div>

        <div className='App-section'>
          <input 
            type='text'
            placeholder='Enter ID of Message to update'
            onChange={event => this.setState({ idToUpdate: event.target.value})}
          />
          <input 
            type='text'
            placeholder='Add a New Message to update'
            onChange={event => this.setState({ newMessage: event.target.value})}
          />
          <button onClick={() => this.updateDataInDB(idToUpdate, newMessage)}>UPDATE</button>
        </div>

      </div>
    );
  }
}
