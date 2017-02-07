import React, {Component} from 'react';
import NavBar from '../../components/NavBar/Navbar';
import {Link} from 'react-router'
export default class Header extends Component {
    render() {
        return (
            <div>
                <NavBar/>
            </div>
        );
    }
}
