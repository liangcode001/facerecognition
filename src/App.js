import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register'

import Particles from 'react-particles-js';
import 'tachyons';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: "1d9dd66a82b2404c91f2ac97f7013ea5",
});

const particalesOptions = {
  particles: {
   number:{
     value: 20,
     density:{
       enable:true,
       value_area:300
     }
   }
  }
}

const initialState = {
  input:'',
  imageurl:'',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user:{
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser =(data) =>{
    this.setState({user:
      {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
    }})
  }

 
  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      buttomRow: height - clarifaiFace.bottom_row * height
    }
  }  

  onInputChange = (event)=>{
    this.setState({input: event.target.value});
    
  }

  onButtonSubmit =()=>{
    this.setState({imageurl: this.state.input});
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then(response => {
          if(response){
            console.log(response);
            fetch('https://mysterious-oasis-26356.herokuapp.com/image',{
              method:'put',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                  id: this.state.user.id
              })
          })
          .then(res=>res.json().then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))
          }))
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err))
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
    console.log(box);
  }
  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route})
  }

  render()
  {
    return (
      <div className="App">
        <Particles className = 'particles'
                params={particalesOptions} />
       <Navigation isSignedIn={this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
       { this.state.route === 'home'
            ? <div>
              <Logo/>
              <Rank name = {this.state.user.name} entries = {this.state.user.entries}
              />
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit= {this.onButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageurl={this.state.imageurl}/>
              </div> 
          : (
            this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/> 
            : <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
            )  
       }
      </div>
    )
  }
}

export default App;
