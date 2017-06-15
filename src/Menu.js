import React from 'react';

export class Menu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <h2 id="menu-nav" onClick={this.props.openMenuModal}>Menu</h2>
        )
    }
}
