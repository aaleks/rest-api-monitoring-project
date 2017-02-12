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
            var $target = $(this).data('target');
            if ($target != 'all') {
                $('.table tbody tr').css('display', 'none');
                $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
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

            Utilities.apiCallAppChecker(appArray).always(function (response) {
                //alert("res" + response)
                that.setState({
                    response: response
                }, ()=> {
                });
            });
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
                                                <label className="btn btn-danger btn-filter" data-target="failed">
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
                        <h1>Response Failed:</h1>
                        <JSONViewver data={this.state.response.failed}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <h1>Response Succed:</h1>
                        <JSONViewver data={this.state.response.succed}/>
                    </div>
                </div>
            </div>
        );

    }
}
