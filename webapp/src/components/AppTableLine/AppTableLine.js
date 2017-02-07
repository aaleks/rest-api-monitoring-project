import React, {Component} from 'react';
import BaseComponent from './../BaseComponent.react.js';


export default class AppTableLine extends BaseComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        /*


         */
    }

    render() {


        return (

            <tr id={"line-"+this.props.appName} data-status={"success"}  className="danger" style={{textAlign:"center"}}>
                <td ><input type="checkbox" className="checkthis" id={this.props.appName} name={this.props.appName} value={this.props.appName}/></td>
                <td>
                    <a className="btn btn-info"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
                </td>
                <td className="hidden-xs">2</td>
                <td>Jen Curtis</td>
                <td>{this.props.appName}</td>
                <td>{this.props.appName}</td>
                <td>
                    <a className="btn btn-success"><span className="glyphicon glyphicon-check" aria-hidden="true"/></a>
                </td>
            </tr>

        );
    }
}