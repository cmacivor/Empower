import React, { Component, useState } from 'react';


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
            dateOfBirth: '',
            currentAge: '',
            gender: ''            
        }
    }

    render() {
        return (
            <div>
                <div className="form-row">
                    <div className="col-6">
                        <label for="txtFirstName"><strong>Last Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtLastName"></input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label for="txtFirstName"><strong> First Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtFirstName"></input>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-6">
                        <label for="txtFirstName"><strong>Middle Name</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtMiddleName"></input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label for="txtFirstName"><strong> SSN</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtSSN"></input>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-6">
                        <label for="txtFirstName"><strong> FBI/NCIC Number </strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtFbiNcicNumber"></input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label for="txtFirstName"><strong> Date of Birth *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="txtDob"></input>
                        </div>
                    </div>
                </div>
            </div>
     
        )
    }

}