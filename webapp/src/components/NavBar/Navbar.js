import React, {Component} from 'react';
import BaseComponent from './../BaseComponent.react.js';
import style from './Navbar.style.scss';
import * as Utilities from '../../utils/Utilities'
import {Link} from 'react-router'
export default class Navbar extends BaseComponent {

    constructor(props) {
        super(props);
    }


    render() {
        return (<nav className="navbar navbar-default navbar-static-top" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </button>
                        {/* Brand */}
                        <Link className="navbar-brand" to="/">My Monitor</Link>
                    </div>
                    <div className="collapse navbar-collapse animated fadeIn" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav animated fadeIn">
                            <li><Link to="/appchecker">Quick app checker</Link></li>
                        </ul>

                    </div>
                    {/* /.navbar-collapse */}
                </div>
                {/* /.container-fluid */}
            </nav>

        );
    }
}