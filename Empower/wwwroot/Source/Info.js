import React, { useState } from 'react';

const Info = (props) => {
    const [lastName, setLastName] = useState(props.lastName);
    const [firstName, setFirstName] = useState(props.firstName);
    // const [middleName, setMiddleName] = useState('');
    // const [ssn, setSsn] = useState('');
    // const [fbiNcicNumber, setFbiNcicNumber] = useState('');
    // const [dateOfBirth, setDateOfBirth] = useState(new Date());
    // const [currentAge, setCurrentAge] = useState('');
    // const [suffix, setSuffix] = useState('Please Select');
    // const [stateVcin, setStateVcin] = useState('');
    // const [alias, setAlias] = useState('');



    return <div>
                <br></br>
                <div className="form-row">
                    <div className="col-3">
                        <label htmlFor="txtLastName"><strong>Last Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text"  value={lastName} onChange={e => onChangeHandler(e, "txtLastName")} className="form-control" id="txtLastName"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={firstName} onChange={e => onChangeHandler(e, "txtFirstName")} className="form-control" id="txtFirstName"></input>
                        </div>
                    </div>
                </div>
            </div>;

}

export default Info;