import React, {Component} from 'react';

import Immutable from 'immutable';
import BaseComponent from './../../components/BaseComponent.react.js';
import styles from './QuickChecker.scss'
import  JSONViewver from '../../utils/JSONViewer.js';
import * as Utilities from '../../utils/Utilities.js';

export default class QuickChecker extends BaseComponent {
    /*
     * Initiate component (states, functions binding, etc)
     */
    constructor() {
        super();
        this.state = {
            data: [],
            filteredData: Immutable.List(),
            initialmain: true,
            response: []
        };
    }


    componentDidMount() {
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

                $(".select-apps").select2({
                    data: allAppsFound,
                    templateResult: function (result, container) {
                        if (!result.id) {
                            return result.text;
                        }
                        container.className += ' needsclick';
                        return result.text;
                    }
                })

            });
        });
    }

    checkApps(e) {
        e.preventDefault();
        /*
         var _this = this;
         $.ajax({
         url: Utilities.apiCall('/api/video/snapshotPreview'),
         data: {
         vignetteduration: vignetteInterval,
         edition: _this.props.params.videoID,
         categoryid: _this.state.video.videoSubSection,
         extension: $("#extension").val(),
         owner: _this.state.video['owner_user']
         },
         type: "POST",
         dataType: 'json',
         async: true
         }).always(function (response) {

         if (response.response == "ok") {
         var htmlContent = '<img id="bootboxid" src="' + Utilities.apiCall('/uploads/tmp/snapshot-video-tmp' + window.localStorage.getItem('userid') + '.png?dummy=' + Math.random()) + '" />'

         if (_this.props.params.videoID) {
         htmlContent = '<img id="bootboxid" src="' + Utilities.apiCall('/uploads/videos/' + _this.state.video.videoSubSection + '/snapshot-video-' + _this.props.params.videoID + '-' + _this.state.video['owner_user'] + '.png?dummy=' + Math.random()) + '" />'
         }

         swal({
         title: "Cover Image Preview",
         text: htmlContent,
         html: true
         });

         } else {
         swal("Error...", "Something went wrong during the snapshot creation try to refresh the page !", "error");
         }


         //alert("reponse " + JSON.stringify(response));

         });

         */


        var arr = $("#appsfilter").val();
        //var a = ["a", "b", "c"];
        if (arr != undefined && arr.length != 0) {
            arr.forEach(function (entry) {
                //alert(entry);
            });
        }

        var that = this;

        NProgress.start();

        Utilities.apiCallAppChecker(arr, {prod: ($("#prod").prop("checked") === true ) ? "PROD" : "STG"}).always(function (response) {
            //alert("res" + response)
            that.setState({
                response: response
            }, ()=> {
                NProgress.done();

            });
        });

    }


    render() {

        return (
            <div>

                <div className="container">
                    <div className="row">
                        <div className="col-md-10 col-md-offset-1">
                            <form onSubmit={this.checkApps.bind(this)} style={{textAlign: "center"}}>
                                <h1>Quick check app</h1>
                                <div className="form-group tags">
                                    <label htmlFor="tags">Apps: </label>
                                    <select style={{width: '100%'}} id="appsfilter" name="appsfilter"
                                            className="form-control select-apps"
                                            multiple="multiple"></select>
                                </div>
                                <div className="form-group tags" style={{float: "right"}}>

                                    <input className="btn btn-md btn-success btn-block" id="login"
                                           value="Force check for rest services selected" type="submit"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-md-10 col-md-offset-1">
                            <li className="list-group-item">
                                Disable testing on PROD
                                <div className="material-switch pull-right">
                                    <input id="prod" name="prod" type="checkbox" defaultChecked/>
                                    <label htmlFor="prod" className="label-success"></label>
                                </div>
                            </li>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-md-10 col-md-offset-1">
                            <h2 style={{padding: "0px !important"}}>Response application Failed:</h2>
                            <JSONViewver data={this.state.response.failed}/>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-md-10 col-md-offset-1">
                            <h2 style={{padding: "0px !important"}}>Response application Succed:</h2>
                            <JSONViewver data={this.state.response.succed}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
