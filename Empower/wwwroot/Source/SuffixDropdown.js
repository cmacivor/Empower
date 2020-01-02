import React, { Component } from 'react';
import { Api } from './commonAdmin';
require ('.//commonAdmin');

export default class SuffixDropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suffixes:  []   
        }

        Api.getConfigDataByType("Suffix").then(suffixes => this.setState({suffixes}));

    }


    render() {

        let suffixOptions = this.state.suffixes.map((suffix) =>
        <a key= {suffix.ID} className="dropdown-item">{suffix.Name}</a>
        );

        return (
            <div>
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        Please Select
                    </button>
                    <div className="dropdown-menu">
                        {suffixOptions}
                    </div>
                </div>
            </div>
        );
    }
}