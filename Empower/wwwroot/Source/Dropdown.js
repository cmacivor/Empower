import React, { Component } from 'react';
import { Api } from './commonAdmin';

export default class DropDown extends Component {
    constructor(props) {
        super(props);

        let previouslySelectedValue = this.props.selected;
        //let values = this.props.values;

        this.state = {
            values: [],
            selectedValue: previouslySelectedValue,
            selectedDescription: this.props.valueDescription,
            hideError: true,
            //isRequired: this.props.isRequired     
        }
    }

    componentDidMount() {
        let dropdownType = this.props.type;

        if (dropdownType === "suffix") {
            Api.getConfigDataByType("Suffix").then(options => this.setState({ values: options }));
            //Api.getConfigDataByType("Suffix").then(options => console.log(options) );
        }
        if (dropdownType === "race") {
            Api.getConfigDataByType("Race").then(options => this.setState({ values: options }));
            //Api.getConfigDataByType("Suffix").then(options => console.log(options));
        }
        if (dropdownType === "gender") {
            Api.getConfigDataByType("Gender").then(options => this.setState({ values: options }));
            //Api.getConfigDataByType("Gender").then(options => console.log(options) );
        }
    }

    onSelectHandler = (event) => {

        let selectedValue = event.currentTarget.getAttribute('value');

        if (this.props.isRequired && selectedValue === "0") {
            this.setState({
                hideError: false
            });
        } else {
            this.setState({
                hideError: true
            });
        }

        //pass the selected suffix value to the parent
        this.props.onSelectValue(event.currentTarget.getAttribute('value'));
        this.props.onSelectValueDescription(event.currentTarget.getAttribute('description'));
    }

    render() {

        let valueOptions = [];
        if (this.state.values.length > 0) {

            valueOptions = this.state.values.map((value) =>
                <a key={value.ID} value={value.ID} description={value.Description} onClick={this.onSelectHandler} className="dropdown-item">{value.Description}</a>
            );

        }

        return (
            <div>
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        {this.props.valueDescription}
                    </button>
                    <div className="dropdown-menu">
                        {valueOptions}
                    </div>
                </div>
                {this.state.hideError || <div className='errorDiv'>Please select a value.</div>}
            </div>

        );
    }
}