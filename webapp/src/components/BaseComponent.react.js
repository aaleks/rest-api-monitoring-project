/**
 * BaseComponent.react.js
 * @author Aleksandar ANTONIJEVIC
 * @description Some useful methods for react components
 */

import React from 'react';

class BaseComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * @author Aleksandar ANTONIJEVIC
     * @param ...methods Name (string) of methods to bind in the component
     * @description Bind methods to the root context of the component
     */
    _bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }
}

export default BaseComponent;
