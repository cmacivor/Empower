import React, { Component } from 'react';
//import { Api } from './commonAdmin';
//require ('./commonAdmin');

export default class DropDown extends Component {
    constructor(props) {
        super(props);

        let previouslySelectedValue = this.props.selected;
        let values = this.props.values;

        this.state = {
            values:  values,
            selectedValue: previouslySelectedValue,
            selectedDescription: this.props.valueDescription     
        }

        //Api.getConfigDataByType("Gender").then(genders => this.setState({genders}));
  
    }

    onSelectHandler = (event) => {
        //console.log(this.props.genderDescription);
        //console.log('the race value being passed is: ' + this.props.selected);


        //console.log('in dropdown: ' + event.currentTarget.getAttribute('description')); //description is getting the correct value
        //console.log('this is he key: ' + event.currentTarget.getAttribute('value'));


        //pass the selected suffix value to the parent- could be one of several components
        this.props.onSelectValue(event.currentTarget.getAttribute('value'));
        this.props.onSelectValueDescription(event.currentTarget.getAttribute('description'));
    }

    render() {

        let valueOptions = this.state.values.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={this.onSelectHandler} className="dropdown-item">{value.Description}</a>
        );

        return (
            <div>
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                        {this.props.valueDescription }
                    </button>
                    <div className="dropdown-menu">
                        {valueOptions}
                    </div>
                </div>
            </div>
        );
    }
}