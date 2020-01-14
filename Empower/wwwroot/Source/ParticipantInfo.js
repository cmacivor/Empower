import React, { Component, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment';
import moment from 'moment';
import { Api } from './commonAdmin';
require ('.//commonAdmin');
import SuffixDropdown from './SuffixDropdown';
import RaceDropDown from './RaceDropdown';
import GenderDropDown from './GenderDropdown';

export default class ParticipantInfo extends Component {

    constructor(props){
        super(props);

        this.state = {
          
            dateOfBirth: this.props.dateOfBirth,  
        }
    }

    handleDatePickerChange = date => {

        //this is for display- actual value is held in parent component
        this.setState({
            dateOfBirth: date.date
        });
        //console.log('this is the local state: '  + this.state.dateOfBirth);
        this.props.onDateOfBirthChange(date.date);
    }

    handleSuffixChange = (suffix) => {
        //pass it to CaseManagement
        this.props.onSuffixChange(suffix);
    }

    handleRaceChange = (race) => {
        this.props.onRaceChange(race);
    }

    handleGenderChange = (gender) => {
        this.props.onGenderChange(gender);
    }

    handleRaceDescriptionChange = (raceDescription) => {
        console.log('this is the handleRaceDescriptionChange in Participant Info: ' + raceDescription);
        this.props.onRaceDescriptionChange(raceDescription);
    }

    handleGenderDescriptionChange = (genderDescription) => {
        this.props.onGenderDescriptionChange(genderDescription);
    }

    handleUpdateClick = () => {
        this.props.participantInfoResetClick();
    }

    handleResetClick = () => {
        this.props.participantInfoResetClick();
    }

    render() {

        let onChangeHandler = this.props.infoTabOnChangeHandler;
        

        return (
            <div>
                <br></br>
                <div className="form-row">
                    <div className="col-3">
                        <label htmlFor="txtLastName"><strong>Last Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text"  value={this.props.lastName} onChange={e => onChangeHandler(e, "txtLastName")} className="form-control" id="txtLastName"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={this.props.firstName} onChange={e => onChangeHandler(e, "txtFirstName")} className="form-control" id="txtFirstName"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtMiddleName"><strong>Middle Name</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={this.props.middleName} onChange={e => onChangeHandler(e, "txtMiddleName")} className="form-control" id="txtMiddleName"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="ddlSuffix"><strong>Suffix</strong></label>
                        <SuffixDropdown onSelectSuffix={this.handleSuffixChange} selected={this.props.infoTabSuffix} />          
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-3">
                        <label htmlFor="txtSSN"><strong> SSN</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={this.props.ssn} onChange={e => onChangeHandler(e, "txtSSN")} className="form-control" id="txtSSN"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtFbiNcicNumber"><strong> FBI/NCIC Number </strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={this.props.fbiNcicNumber} onChange={e => onChangeHandler(e, "txtFbiNcicNumber")} className="form-control" id="txtFbiNcicNumber"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtCurrentAge"><strong>Current Age</strong></label>
                        <div className="inpu-group mb-3">
                            <input type="text" readOnly value={this.props.currentAge} className="form-control"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtDateOfBirth"><strong> Date of Birth *</strong></label>
                        <div className="input-group mb-3">
                        <DatePicker 
                             selected={ this.props.dateOfBirth }
                             
                             onChange={date => this.handleDatePickerChange({date})}
                             className="form-control"                             
                         />
                        </div>
                    </div>  
                </div>
                <div className="form-row">
                    <div className="col-3">
                        <label htmlFor="txtStateVCIN"><strong>State/VCIN Number</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={this.props.stateVCIN} onChange={e => onChangeHandler(e, "txtStateVCIN")} className="form-control" id="txtStateVCIN"></input>
                        </div>                       
                    </div>
                    <div className="col-2">
                        <label htmlFor="txtAlias"><strong>Alias</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={this.props.alias} onChange={e => onChangeHandler(e, "txtAlias")} className="form-control" id="txtAlias"></input>
                        </div>
                    </div>
                    <div className="col-2">
                        <label htmlFor="ddlGender"><strong>Gender*</strong></label>
                        <GenderDropDown onSelectGender={this.handleGenderChange} onSelectGenderDescription={this.handleGenderDescriptionChange} selected={this.props.infoTabGender} genderDescription={this.props.genderDescription}/>
                    </div>
                    <div className="col-4">
                       <label htmlFor="ddlRace"><strong>Race/Ethnicity *</strong> </label>
                        <RaceDropDown onSelectRace={this.handleRaceChange } onSelectRaceDescription={this.handleRaceDescriptionChange} selected={this.props.infoTabRace} raceDescription={this.props.raceDescription } />
                    </div>
                </div>
                <div className="form-row float-right">
                    <div className="col-auto">
                        <button id="btnUpdate" className="btn btn-primary mb-2" onClick={this.handleUpdateClick}>Update</button>
                    </div>
                    <div className="col-auto">
                        <button id="btnReset" className="btn btn-primary mb-2" onClick={this.handleResetClick }>Reset</button>
                    </div>
                </div>         
            </div>
     
        )
    }

}