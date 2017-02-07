import React, {Component, PropTypes} from 'react';

import Header from './Header/Header'
import Footer from './Footer/Footer'

export default class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    render() {
        return (
            <div className="mainclass">
                <Header/>
                {this.props.children}
                <Footer/>
            </div>
        );
    }
}
