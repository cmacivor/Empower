import React, { Component, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//import 'react-bo'
//import 'bootstrap/dist/css/bootstrap.css';

const Input = ({onChange, placeholder, value, isSecure, id, onClick}) => (
	<input
        onChange={onChange}
        className="form-control"
		value={value}
		id={id}
		onClick={onClick}
	/>
);


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
            gender: ''            
        }
    }

    handleDatePickerChange = date => {
        this.setState({
            dateOfBirth: date
        });
    }

    datePickerOnClick = () => {
        alert('on click');
    }

    // ExampleCustomInput = ({ value, onClick }) => (
    //     <button className="btn btn-primary" onClick={onClick}>
    //       {value}
    //     </button>
    //   );

    render() {
        return (
            <div>
                <br></br>
                <div className="form-row">
                    <div className="col-6">
                        <label htmlFor="txtFirstName"><strong>Last Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtLastName"></input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtFirstName"></input>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-6">
                        <label htmlFor="txtFirstName"><strong>Middle Name</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtMiddleName"></input>
                        </div>
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
                            <DatePicker selected={this.state.dateOfBirth }
                            onChange={this.handleDatePickerChange}
                             customInput={<Input 
                            onChange={this.handleDatePickerChange} 
                            value={this.state.dateOfBirth} 
                            id="txtDob" 
                            onClick={this.datePickerOnClick} /> } />

                            {/* <input type="text" className="form-control" id="txtDob"></input> */}
                        </div>
                    </div>
                </div>
            </div>
     
        )
    }

}