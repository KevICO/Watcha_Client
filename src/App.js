import React, { Component } from 'react';
import watcha_logo from './watcha-logo-nav.png'
import './App.css';
import sdk from 'matrix-js-sdk';

class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      client: null,
      isLogged: false,
    }
    this.updateIsLoggedHandle = this.updateIsLoggedHandle.bind(this)
    this.getClientFromLogin = this.getClientFromLogin.bind(this)
  }

  updateIsLoggedHandle(stateOfConnection){
    this.setState(
      {isLogged: stateOfConnection}
    )
  }

  getClientFromLogin(loginClient){
    this.setState({client: loginClient})
  }

  render() {
    return(
      <div className="d-flex flex-column align-items-center">
        <Header />
        {this.state.isLogged ? <HomePage /> : <Login getClient={this.getClientFromLogin} onConnection={this.updateIsLoggedHandle}/>}
        <Footer />
      </div>
    )
  }
}

class Login extends Component{
  constructor(props){
    super(props)
    this.state = {
      serverUrl: "https://matrix.org",
      userID: "",
      password: ""
    }
    //Bind des 'this' sur les fonctions de classe : 
    this.updateValueHandle = this.updateValueHandle.bind(this)
    this.submitHandle = this.submitHandle.bind(this)
  }

  updateValueHandle(e){
    //Changement de l'état du login lors du renseignement des champs userID et password du formulaire: 
    const eventID = e.target.id
    const eventValue = e.target.value
    this.setState(state => ({
      [eventID]: eventValue,
    }))
  }

  submitHandle(e){
    //Création du client et tentative de connexion :
    e.preventDefault()
    const client = sdk.createClient(this.state.serverUrl)
    client.login("m.login.password", {"user": this.state.userID, "password": this.state.password}).then(
      //Login OK :
      (resolve) => {client.startClient() //Démarrage du client
                    client.once('sync', (state, prevState, res) => {console.log(state)}) //Synchronisation avec le serveur matrix.org
                    this.props.getClient(client) //On passe l'objet client a Apps
                    this.props.onConnection(true)}, //On remonte l'état a Apps.
      //Echec du login :
      (reject) => {this.props.onConnection(false)
                   this.setState({userID:'', 
                                  password:''})})
  }

  render() {
     return(
        <div className="d-flex flex-column my-2 text-center" >
          <form className="form-signin justify-content-center" onSubmit={this.submitHandle}>
            <div className="form-group">
              <label htmlFor="user">User ID : </label>
              <input className="form-control" type="text" id="userID" value={this.state.userID} onChange={this.updateValueHandle} required/>
            </div>
            <div className="form-group mb-5">
              <label htmlFor="password">Password : </label>
              <input className="form-control" type="password" id="password" value={this.state.password} onChange={this.updateValueHandle} required/>
            </div>
              <button className="btn btn-primary" type="submit">Submit</button>
          </form>
        </div>
    )
  }
}

function HomePage(){
  //A FAIRE
  /*client.on("Room.timeline", function(event, room, toStartOfTimeline) {
    console.log(event.event);
  });*/
  
  return(
    <div>
      <p>Bienvenu sur la page d'accueil!!</p>
    </div>
  )
}

function Header(){
  return(
      <div className="col-4 my-5 text-center">
        <header>
          <h1 >Matrix Client</h1>
        </header> 
    </div>
    
  )
}

function Footer(){
  return(
      <div className="col-4 my-5 text-center">
        <img src={watcha_logo} width="200px"></img>
      </div>  
  )
}

export default App;
