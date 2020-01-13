import React, { Component } from 'react';
import { Api } from './commonAdmin';
require ('./commonAdmin');

export default class GenderDropDown extends Component {
    constructor(props) {
        super(props);

        let previouslySelectedGender = this.props.selected;

        this.state = {
            genders:  [],
            selectedValue: previouslySelectedGender,
            selectedDescription: this.props.genderDescription     
        }

        Api.getConfigDataByType("Gender").then(genders => this.setState({genders}));
  
    }

    onSelectHandler = (event) => {
        console.log(this.props.genderDescription);
        //console.log('the race value being passed is: ' + this.props.selected);


        console.log('in dropdown: ' + event.currentTarget.getAttribute('description')); //description is getting the correct value
        console.log('this is he key: ' + event.currentTarget.getAttribute('value'));


        //pass the selected suffix value to the parent- could be one of several components
        this.props.onSelectGender(event.currentTarget.getAttribute('value'));
        this.props.onSelectGenderDescription(event.currentTarget.getAttribute('description'));
    }

    render() {

        let genderOptions = this.state.genders.map((gender) =>
            <a key={gender.ID} value={gender.ID} description={gender.Description} onClick={this.onSelectHandler} className="dropdown-item">{gender.Description}</a>
        );

        return (
            <div>
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                        {this.props.genderDescription}
                    </button>
                    <div className="dropdown-menu">
                        {genderOptions}
                    </div>
                </div>
            </div>
        );
    }
}