import React, { Component } from 'react';
import { Api } from './commonAdmin';
require ('./commonAdmin');

export default class RaceDropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            races:  [],
            selectedValue: this.props.selected,
            //selectedDescription: 'Please Select'     
        }

        Api.getConfigDataByType("Race").then(races => this.setState({races}));

        
    }

    onSelectHandler = (event) => {

        console.log('the race value being passed is: ' + this.props.selected);

        console.log(' the array is ' + this.state.races);
         

        this.setState({
            selectedDescription: event.currentTarget.getAttribute('description')
        });

        let valueToSendToParent = event.currentTarget.getAttribute('key');
        //pass the selected suffix value to the parent- could be one of several components
        this.props.onSelectRace(valueToSendToParent);
    }


    render() {

        let raceOptions = this.state.races.map((race) =>
            <a key={race.ID} description={race.Description} onClick={this.onSelectHandler} className="dropdown-item">{race.Description}</a>
        );

        return (
            <div>
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        {/* {this.state.selectedValue } */}
                        {this.props.selected }
                    </button>
                    <div className="dropdown-menu">
                        {raceOptions}
                    </div>
                </div>
            </div>
        );
    }
}