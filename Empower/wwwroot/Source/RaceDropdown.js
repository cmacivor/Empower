import React, { Component } from 'react';
import { Api } from './commonAdmin';
require ('./commonAdmin');

export default class SuffixDropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            races:  [],
            selectedValue: this.props.selected     
        }

        Api.getConfigDataByType("Race").then(races => this.setState({races}));
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

        let raceOptions = this.state.races.map((race) =>
            <a key={race.ID} value={race.ID} onClick={this.onSelectHandler} className="dropdown-item">{race.Description}</a>
        );

        return (
            <div>
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        {this.state.selectedValue}
                    </button>
                    <div className="dropdown-menu">
                        {raceOptions}
                    </div>
                </div>
            </div>
        );
    }
}