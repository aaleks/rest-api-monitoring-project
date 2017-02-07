import React, {Component} from 'react';

import Immutable from 'immutable';
import MainAppsContainer from '../MainAppsContainer/MainAppsContainer'
import BaseComponent from './../../components/BaseComponent.react.js';
import styles from './RestMonitoringPage.scss'
import _ from 'lodash'
import * as Utilities from '../../utils/Utilities.js';

export default class RestMonitoringPage extends BaseComponent {
    /*
     * Initiate component (states, functions binding, etc)
     */
    constructor() {
        super();
        this.state = {
            data: [],
            filteredData: Immutable.List(),
            initialmain: true
        };
    }


    componentWillMount() {
        var _this = this;
        var allAppsFound = [];
        $.ajax({
            url: Utilities.apiCall('/api/apps/getAllApplicationsList'),
            type: "GET",
            dataType: 'json',
            async: true
        }).done(function (responseApps) {
            //best uploaders
            allAppsFound = responseApps
            _this.setState({
                data: allAppsFound,
                filteredData: allAppsFound
            }, ()=> {


            });
        });
    }


    render() {

        return (
            <div>
                {/*
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                            <form>
                                <h1>Quick check app</h1>

                                <div className="form-group tags">
                                    <label htmlFor="tags">Apps: </label>
                                    <select style={{width: '100%'}} id="tags" name="tags"
                                            className="form-control select-apps"
                                            multiple="multiple"></select>
                                </div>
                                <div className="form-group tags" style={{float:"right"}}>

                                    <input className="btn btn-md btn-success btn-block" type="submit" id="login"
                                           value="Force check for rest services selected"/>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
                */}
                <MainAppsContainer id="apps-section" apps={this.state.filteredData}/>

            </div>
        );
    }
}
