import React, {Component} from 'react';
import AppTableLine from '../../components/AppTableLine/AppTableLine'
import style from './MainAppsContainer.scss'
import * as Utilities from '../../utils/Utilities.js';
import  JSONViewver from '../../utils/JSONViewer.js';

export default class MainAppsContainer extends Component {


    constructor() {
        super();
        this.state = {
            response: []
        }
    }


    componentDidMount() {

        $('.btn-filter').on('click', function () {
            var target = $(this).data('target');
            if (target != 'all') {
                $('.table tbody tr').css('display', 'none');
                $('.table tbody tr[data-status="' + target + '"]').fadeIn('slow');
            } else {
                $('.table tbody tr').css('display', 'none').fadeIn('slow');
            }
        });

        $('#checkall').on('click', function () {
            if ($("#mytable #checkall").is(':checked')) {
                $("#mytable input[type=checkbox]").each(function () {
                    $(this).prop("checked", true);
                });

            } else {
                $("#mytable input[type=checkbox]").each(function () {
                    $(this).prop("checked", false);
                });
            }
        });

    }

    checkApps(e) {
        e.preventDefault();

        var appArray = [];
        $("#mytable input[type=checkbox]:checked").each(function () {
            if ($(this).val() != "on") {
                appArray.push($(this).val());
            }
        });

        if (appArray.length != 0) {
            // alert("check" + JSON.stringify(appArray))
            var that = this;
            Utilities.apiCallAppChecker(appArray, {prod: ($("#prod").prop("checked") === true ) ? "PROD" : "STG"}).always(function (response) {
                if (response.status === 500) {
                    that.setState({
                        response: {succed: [], failed: {"error": response.responseJSON.error}}
                    }, ()=> {
                    });

                } else {
                    that.setState({
                        response: response
                    }, ()=> {

                        response.succed.forEach(function (elm) {
                            var key = Object.keys(elm)[0];
                            $('#line-' + key).attr('data-status', 'success');
                            $('#line-' + key).attr('class', 'success');
                        })

                        response.failed.forEach(function (elm) {
                            var key = Object.keys(elm)[0];
                            $('#line-' + key).attr('data-status', 'danger');
                            $('#line-' + key).attr('class', 'danger');

                        });

                    });
                }

            });
        }
    }

    enableProd() {
        if ($("#prod").prop("checked")) {
        } else {
        }
    }


    render() {

        var allApplications = [];


        var that = this;
        Object.keys(this.props.apps).forEach(function (key) {
            allApplications.push(
                <AppTableLine key={key} appContent={that.props.apps[key]} appName={key}
                              currentCounter={allApplications.length}/>
            );
        });

        return (

            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <div className="panel panel-default panel-table">
                            <div className="panel-heading">
                                <div className="row">
                                    <div className="col col-xs-6">
                                        <h3 className="panel-title">API Monitoring</h3>
                                    </div>
                                    <div className="col col-xs-6 text-right">
                                        <div className="pull-right">
                                            <div className="btn-group" data-toggle="buttons">
                                                <label className="btn btn-success btn-filter active"
                                                       data-target="success">
                                                    <input type="radio" name="options" id="option1" autoComplete="off"
                                                           defaultChecked/>
                                                    Success
                                                </label>
                                                <label className="btn btn-danger btn-filter" data-target="danger">
                                                    <input type="radio" name="options" id="option2" autoComplete="off"/>
                                                    Failed
                                                </label>
                                                <label className="btn btn-default btn-filter" data-target="all">
                                                    <input type="radio" name="options" id="option3" autoComplete="off"/>
                                                    All
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-body">
                                <table id="mytable" className="table table-striped table-bordered table-list">
                                    <thead>
                                    <tr>
                                        <th className="col-check"><input type="checkbox" id="checkall"/></th>
                                        {/*
                                         <th className="col-tools"><span className="glyphicon glyphicon-wrench"
                                         aria-hidden="true"/>
                                         </th>
                                         */}
                                        <th className="hidden-xs" style={{textAlign: "center"}}>Name</th>
                                        <th className="col-text">Description</th>
                                        <th className="col-text">Documentation Link</th>
                                        <th className="col-text">Criticity</th>
                                        <th className="col-text">Force check</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {allApplications}

                                    </tbody>
                                </table>
                            </div>
                            <div className="panel-footer">
                                <div className="row">
                                    <div className="col col-xs-offset-3 col-xs-6">

                                    </div>
                                    <div className="col col-xs-3">
                                        <div className="pull-right">
                                            <button type="button" className="btn btn-primary"
                                                    onClick={this.checkApps.bind(this)}>
                                                <span className="glyphicon glyphicon-check" aria-hidden="true"/>
                                                Force check for selected apps
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <li className="list-group-item">
                            Disable testing on PROD
                            <div className="material-switch pull-right">
                                <input id="prod" name="prod" type="checkbox" onChange={this.enableProd.bind(this)}
                                       defaultChecked/>
                                <label htmlFor="prod" className="label-success"></label>
                            </div>
                        </li>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <h2 style={{padding: "0px !important"}}>Response application Failed:</h2>
                        <JSONViewver data={this.state.response.failed}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <h2 style={{padding: "0px!important"}}>Response application Succed:</h2>
                        <JSONViewver data={this.state.response.succed}/>
                    </div>
                </div>
            </div>
        );

    }
}
