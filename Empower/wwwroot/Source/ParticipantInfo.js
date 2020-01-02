import React, { Component, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment';
import moment from 'moment';
import { Api } from './commonAdmin';
require ('.//commonAdmin');

export default class ParticipantInfo extends Component {

    constructor(props){
        super(props);

        this.state = {
            lastName: '',
            middleName: '',
            fbiNcicNumber: '',
            Suffix: '',
            race: '',
            stateVCIN: '',
            alias: '',
            firsName: '',
            ssn: '',
            dateOfBirth: new Date(),
            currentAge: '',
            gender: '',
            suffixes:  []      
        }

        //Api.getAll().then(rowData => this.setState({ rowData }));
        Api.getConfigDataByType("Suffix").then(suffixes => this.setState({suffixes}));

        //console.log(this.state.suffixes);

    }

    handleDatePickerChange = date => {
        this.setState({
            dateOfBirth: date.date
        });
    }

    datePickerOnClick = () => {
        alert('on click');
    }

    render() {
        //console.log(this.state.suffixes);

        // let suffixOptions = this.state.suffixes.map((suffix) =>
        //     <option key = {suffix.ID }>{suffix.Name}</option>
        // );

        let suffixOptions = this.state.suffixes.map((suffix) =>
           <a className="dropdown-item">{suffix.Name}</a>
        );

        console.log(suffixOptions);

        return (
            <div>
                <br></br>
                <div className="form-row">
                    <div className="col-4">
                        <label htmlFor="txtLastName"><strong>Last Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtLastName"></input>
                        </div>
                    </div>
                    <div className="col-4">
                        <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtFirstName"></input>
                        </div>
                    </div>
                    <div className="col-4">
                        <label htmlFor="txtMiddleName"><strong>Middle Name</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtMiddleName"></input>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-4">
                        <label htmlFor="txtSSN"><strong> SSN</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtSSN"></input>
                        </div>
                    </div>
                    <div className="col-4">
                        <label htmlFor="txtFbiNcicNumber"><strong> FBI/NCIC Number </strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtFbiNcicNumber"></input>
                        </div>
                    </div>
                    <div className="col-4">
                        <label htmlFor="txtFirstName"><strong> Date of Birth *</strong></label>
                        <div className="input-group mb-3">
                        <DatePicker
                             selected={ this.state.dateOfBirth }
                             
                             onChange={date => this.handleDatePickerChange({date})}
                             className="form-control"                             
                         />
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-4">
                        <label htmlFor="ddlSuffix"><strong>Suffix</strong></label>
                        <div className="dropdown">
                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                Please Select
                            </button>
                            <div className="dropdown-menu">
                                {suffixOptions}
                            </div>
                        </div>
                       
                    </div>
                </div>




                {/* <div className="form-row">
                    <div className="col-6">
                        
                    </div>
                    <div className="col-6">
                    
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-6">
                   
                    </div>
                    <div className="col-6">
                        <label htmlFor="txtFirstName"><strong> SSN</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtSSN"></input>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-6">
                        <label htmlFor="txtFirstName"><strong> FBI/NCIC Number </strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtFbiNcicNumber"></input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label htmlFor="txtFirstName"><strong> Date of Birth *</strong></label>
                        <div className="input-group mb-3">
                        <DatePicker
                             selected={ this.state.dateOfBirth }
                             
                             onChange={date => this.handleDatePickerChange({date})}
                             className="form-control"                             
                         />
                        </div>
                    </div>
                </div> */}


            </div>
     
        )
    }

}