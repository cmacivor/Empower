import React, { Component } from 'react';
import { Api } from './commonAdmin';
require ('.//commonAdmin');

export default class SuffixDropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suffixes:  [],
            selectedValue: 'Please Select'   
        }

        Api.getConfigDataByType("Suffix").then(suffixes => this.setState({suffixes}));

    }

    onSelectHandler = (event) => {
        console.log(event);
        console.log(event.target);
        console.log(event.target.value);
        // this.setState({
        //     selectedValue: event.target.value
        // });

        // console.log('the new suffix is ' + this.state.selectedValue);
    }


    render() {

        let suffixOptions = this.state.suffixes.map((suffix) =>
        <a key={suffix.ID} onClick={e => this.onSelectHandler(e)} className="dropdown-item">{suffix.Name}</a>
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