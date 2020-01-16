import React, { useState } from 'react';
import {useStore} from './StateStores/store';

const Info = (props) => {

    console.log(props);

    if (props.clientProfile === undefined) return null;

    let clientInfo = props.clientProfile.Person;

   //need to create variables for each- if it's null, set to empty string for controlled components
    let clientLastName = (clientInfo.LastName !== null)  ? clientInfo.LastName : '';
    let clientFirstName = (clientInfo.FirstName !== null)  ? clientInfo.FirstName : '';

    const [lastName, setLastName] = useState(clientLastName);
    const [firstName, setFirstName] = useState(clientFirstName);
    //console.log(clientLastName);
    //console.log(clientFirstName);


    // let birthDateJavascriptDateObject = new Date(finalResult.ClientProfile.Person.DOB);
    // let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
    // let utcBirthDate = new Date(formattedBirthDate); 
    
    //for the age box
    //calculate age in years
    //let difference = moment(new Date()).diff(birthDateJavascriptDateObject);
    //console.log(difference);
    //let duration = moment.duration(difference, 'milliseconds');
    //console.log(duration);
    //let diffInYears = Math.round(duration.asYears());
    //console.log(diffInYears);

   //console.log(races);
   //console.log(genders);

//     let raceObjectByClientRaceID = races.races.filter(function(race) {
//        return race.ID === finalResult.ClientProfile.Person.RaceID
//    });

//    let genderObjectByClientGenderID = genders.genders.filter(function(gender) {
//        return gender.ID === finalResult.ClientProfile.Person.GenderID
//    });


   
//    let middleName = (finalResult.ClientProfile.Person.MiddleName !== null)  ? finalResult.ClientProfile.Person.MiddleName : '';
//    let ssn = (finalResult.ClientProfile.Person.SSN != null)  ? finalResult.ClientProfile.Person.SSN : '';
//    let fbiNcicNumber = (finalResult.ClientProfile.Person.FBINCIC !== null) ? finalResult.ClientProfile.Person.FBINCIC : '';
//    let stateVcin = (finalResult.ClientProfile.Person.StateORVCIN !== null) ? finalResult.ClientProfile.Person.StateORVCIN : '';
//    let alias = (finalResult.ClientProfile.Person.StateORVCIN !== null) ? finalResult.ClientProfile.Person.StateORVCIN : '';
//    let raceID = (finalResult.ClientProfile.Person.RaceID !== null) ? finalResult.ClientProfile.Person.RaceID : 0;
   //let raceDescription = (raceObjectByClientRaceID !== null) ? raceObjectByClientRaceID[0].Description : '';
   //let genderID = (finalResult.ClientProfile.Person.GenderID !== null) ?  finalResult.ClientProfile.Person.GenderID : 0;
   //let genderDescription = (genderObjectByClientGenderID !== null) ? genderObjectByClientGenderID[0].Description : '';

 
    // const [middleName, setMiddleName] = useState('');
    // const [ssn, setSsn] = useState('');
    // const [fbiNcicNumber, setFbiNcicNumber] = useState('');
    // const [dateOfBirth, setDateOfBirth] = useState(new Date());
    // const [currentAge, setCurrentAge] = useState('');
    // const [suffix, setSuffix] = useState('Please Select');
    // const [stateVcin, setStateVcin] = useState('');
    // const [alias, setAlias] = useState('');

    //to test the global state
    const {state, dispatch} = useStore();

    function infoTabOnChangeHandler (e, field) {
        console.log(e.target.value);
        if (field === "txtLastName") {
            // this.setState({
            //     clientLastName:  e.target.value
            // });
            setLastName(e.target.value);
        }

        if (field === "txtFirstName") {
            // this.setState({
            //     clientFirstName:  e.target.value
            // });
            setFirstName(e.target.value);
        }

        if (field === "txtMiddleName") {
            // this.setState({
            //     clientMiddleName:  e.target.value
            // });
        }

        if (field === "txtSSN") {
            // this.setState({
            //     clientSSN:  e.target.value
            // });
        }

        if (field === "txtFbiNcicNumber") {
            // this.setState({
            //     clientFbiNcicNumber:  e.target.value
            // });
        }

        if (field === "txtStateVCIN") {
            // this.setState({
            //     clientStateVCIN:  e.target.value
            // });
        }

        if (field === "txtAlias") {
            // this.setState({
            //     clientAlias:  e.target.value
            // });
        }
    }

    return <div>
                <br></br>
                <div className="form-row">
                    <div className="col-3">
                        <label htmlFor="txtLastName"><strong>Last Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text"  value={lastName} onChange={e => infoTabOnChangeHandler(e, "txtLastName")} className="form-control" id="txtLastName"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={firstName} onChange={e => infoTabOnChangeHandler(e, "txtFirstName")} className="form-control" id="txtFirstName"></input>
                        </div>
                    </div>
                </div>
                <br></br>
                {state.count}
                {state.message}
            </div>;

}

export default Info;