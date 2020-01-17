import React, { Component } from 'react';

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

    }

    onSelectHandler = (event) => {
        //pass the selected suffix value to the parent
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