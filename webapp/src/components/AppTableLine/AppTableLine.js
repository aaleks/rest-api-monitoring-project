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

    forceCheck() {
        //force check here ->>>  alert("force check ")
        this.props.forceCheckApp(this.props.appName);
    }

    render() {


        return (

            <tr id={"line-" + this.props.appName} data-status={""} className=""
                style={{textAlign: "center"}}>
                <td ><input type="checkbox" className="checkthis" id={this.props.appName} name={this.props.appName}
                            value={this.props.appName}/></td>
                {/*<td>
                 <a className="btn btn-info"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
                 </td>*/}
                <td className="hidden-xs">{this.props.appName}</td>
                <td>{this.props.appContent.context.description}</td>
                <td><a href={this.props.appContent.context.urlDocumentLink} className="btn btn-info"><span
                    className="glyphicon glyphicon-folder-open" aria-hidden="true"/></a></td>
                <td>{this.props.appContent.context.criticity}</td>
                <td>
                    <a onClick={this.forceCheck.bind(this)} className="btn btn-success"><span
                        className="glyphicon glyphicon-check" aria-hidden="true"/></a>
                </td>
            </tr>

        );
    }
}