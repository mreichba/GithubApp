import React, { Component } from 'react';
import './Avatar.scss';
import Image from 'react-bootstrap/Image';

class Avatar extends Component {

    render() {

        const imgSrc = this.props.src;
        const home = this.props.home;

        return (
            <div className="avatarContainer">
                <a href={home} target='_blank' rel='noopener noreferrer'>
                    <Image alt="userImage" src={imgSrc} roundedCircle />
                </a>
            </div>
        )
    }
}

export default Avatar;
