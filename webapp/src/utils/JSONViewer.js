import React, {Component} from 'react';
import JSONTree from 'react-json-tree'

const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
};

export default React.createClass({

    style: {
        backgroundColor: '#1f4662',
        color: '#fff',
        fontSize: '12px',
    },

    headerStyle: {
        backgroundColor: '#193549',
        padding: '5px 10px',
        fontFamily: 'monospace',
        color: '#ffc600',
    },

    preStyle: {
        display: 'block',
        padding: '0px!important',
        margin: '0!important',
        overflow: 'scroll',
    },

    getInitialState() {
        return {
            show: true,
        };
    },

    toggle() {
        this.setState({
            show: !this.state.show,
        });
    },

    render() {
        return (
            <div style={this.style}>

                {( this.state.show ?
                    <JSONTree data={this.props.data === undefined ? {} : this.props.data} theme={theme}
                              invertTheme={false}/>
                    : false )}
            </div>
        );
    }
});