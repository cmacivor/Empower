import React, { Component } from 'react';
import { Api } from './commonAdmin';
require ('.//commonAdmin');

export default class SuffixDropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suffixes:  [],
            selectedValue: (this.props.selected !== '' || this.props.selected !== null) ? this.props.selected : ''    
        }

        Api.getConfigDataByType("Suffix").then(suffixes => this.setState({suffixes}));

    }

    onSelectHandler = (event) => {
        this.setState({
            selectedValue: event.currentTarget.getAttribute('value')
        });

        let valueToSendToParent = event.currentTarget.getAttribute('value');
        //pass the selected suffix value to the parent- could be one of several components
        this.props.onSelectSuffix(valueToSendToParent);

    }


    render() {

        let suffixOptions = this.state.suffixes.map((suffix) =>
        <a key={suffix.ID} value={suffix.Name} onClick={this.onSelectHandler} className="dropdown-item">{suffix.Name}</a>
        );

        return (
            <div>
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        {this.state.selectedValue}
                    </button>
                    <div className="dropdown-menu">
                        {suffixOptions}
                    </div>
                </div>
            </div>
        );
    }
}