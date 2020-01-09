import React, { Component, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment';
import moment from 'moment';
import { Api } from './commonAdmin';
require ('.//commonAdmin');
import SuffixDropdown from './SuffixDropdown';

export default class ParticipantInfo extends Component {

    constructor(props){
        super(props);

        //calculate age
        let difference = moment(new Date()).diff(this.props.dateOfBirth);
        let duration = moment.duration(difference, 'milliseconds');
        let differenceInDays = duration.asYears();
        console.log(difference);
        console.log(duration);
        console.log(differenceInDays);

        this.state = {
          
            dateOfBirth: this.props.dateOfBirth,  
            currentAge: differenceInDays,                
        }
    }

    handleDatePickerChange = date => {

        //this is for display- actual value is held in parent component
        this.setState({
            dateOfBirth: date.date
        });
        console.log('this is the local state: '  + this.state.dateOfBirth);
        this.props.onDateOfBirthChange(date.date);
    }

    handleSuffixChange = (suffix) => {
        //pass it to CaseManagement
        this.props.onSuffixChange(suffix);
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
                            <input type="text" defaultValue={this.props.lastName} onChange={e => onChangeHandler(e, "txtLastName")} className="form-control" id="txtLastName"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" defaultValue={this.props.firstName} onChange={e => onChangeHandler(e, "txtFirstName")} className="form-control" id="txtFirstName"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtMiddleName"><strong>Middle Name</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" defaultValue={this.props.middleName} onChange={e => onChangeHandler(e, "txtMiddleName")} className="form-control" id="txtMiddleName"></input>
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
                            <input type="text" defaultValue={this.props.ssn} onChange={e => onChangeHandler(e, "txtSSN")} className="form-control" id="txtSSN"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtFbiNcicNumber"><strong> FBI/NCIC Number </strong></label>
                        <div className="input-group mb-3">
                            <input type="text" defaultValue={this.props.fbiNcicNumber} onChange={e => onChangeHandler(e, "txtFbiNcicNumber")} className="form-control" id="txtFbiNcicNumber"></input>
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
                    <div className="col-3">
                        <label htmlFor="txtCurrentAge"><strong>Current Age</strong></label>
                        <div className="inpu-group mb-3">
                            <input type="text" readOnly value={this.props.currentAge} className="form-control"></input>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-4">
                  
                       
                    </div>
                </div>
            </div>
     
        )
    }

}