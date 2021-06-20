import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css'
import logo from './logo.png'

const Logo = () => {
    return(
        <div className = 'ma4 mt0'>
            <Tilt className="tilt br2 shadow-2" options={{ max : 25 }} style={{ height:100, width: 300 }} >
                <div className="Tilt-inner pa3 tc tj"> <img style={{paddingTop: '5px'}} alt = 'logo' src={logo}/> </div>
            </Tilt>
        </div>
    );
}

export default Logo;


