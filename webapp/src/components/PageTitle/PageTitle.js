import React, {Component} from 'react';
import BaseComponent from './../BaseComponent.react.js';

export default class PageTitle extends BaseComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }


    render() {

        return (
            <div className="page-title-container">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 wow fadeIn">
                            <i className="fa fa-user"/>
                            <h1>About Us /</h1>
                            <p>Below you can find more information about our company</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}