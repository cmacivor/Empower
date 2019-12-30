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
            <div className="form-row">
                <div className="col-6">
                    <label for="txtFirstName">First Name *</label>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" id="txtFirstName"></input>
                    </div>
                </div>
                <div className="col-6">

                </div>
            </div>
        )
    }

}