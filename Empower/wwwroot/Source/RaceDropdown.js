import React, { Component } from 'react';
import { Api } from './commonAdmin';
require ('./commonAdmin');

export default class RaceDropDown extends Component {
    constructor(props) {
        super(props);

        let previouslySelectedRace = this.props.selected;

        this.state = {
            races:  [],
            selectedValue: previouslySelectedRace,
            selectedDescription: this.props.raceDescription     
        }

        Api.getConfigDataByType("Race").then(races => this.setState({races}));
  
    }

    onSelectHandler = (event) => {
        console.log(this.props.raceDescription);
        //console.log('the race value being passed is: ' + this.props.selected);


        console.log('in dropdown: ' + event.currentTarget.getAttribute('description')); //description is getting the correct value
        console.log('this is he key: ' + event.currentTarget.getAttribute('value'));


        //pass the selected suffix value to the parent- could be one of several components
        this.props.onSelectRace(event.currentTarget.getAttribute('value'));
        this.props.onSelectRaceDescription(event.currentTarget.getAttribute('description'));
    }

    render() {

        let raceOptions = this.state.races.map((race) =>
            <a key={race.ID} value={race.ID} description={race.Description} onClick={this.onSelectHandler} className="dropdown-item">{race.Description}</a>
        );

        return (
            <div>
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                        {this.props.raceDescription}
                    </button>
                    <div className="dropdown-menu">
                        {raceOptions}
                    </div>
                </div>
            </div>
        );
    }
}