import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useStore} from './StateStores/store';
import SuffixDropdown from './SuffixDropdown';
import moment from 'moment';

const Info = (props) => {

    console.log(props);

    if (props.clientProfile === undefined) return null;

    let clientInfo = props.clientProfile.Person;

   //need to create variables for each- if it's null, set to empty string for React controlled components
    let clientLastName = (clientInfo.LastName !== null)  ? clientInfo.LastName : '';
    let clientFirstName = (clientInfo.FirstName !== null)  ? clientInfo.FirstName : '';
    let clientMiddleName = (clientInfo.MiddleName !== null) ? clientInfo.MiddleName : '';
    let clientSuffixID = (clientInfo.Suffix !== null) ? clientInfo.Suffix : 'Please Select';
    let clientSSN = (clientInfo.SSN !== null) ? clientInfo.SSN : '';
    let clientFbiNcic = (clientInfo.FBINCIC !== null) ? clientInfo.SSN : '';

    //calculate age
    let birthDateJavascriptDateObject = new Date(clientInfo.DOB);
    let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
    let utcBirthDate = new Date(formattedBirthDate);
    let difference = moment(new Date()).diff(birthDateJavascriptDateObject);
    //console.log(difference);
    let duration = moment.duration(difference, 'milliseconds');
    //console.log(duration);
    let diffInYears = Math.round(duration.asYears());
    //console.log(diffInYears); 
    

    //need to get the suffixValues and get the Name from the suffixID


    const [lastName, setLastName] = useState(clientLastName);
    const [firstName, setFirstName] = useState(clientFirstName);
    const [middleName, setMiddleName] = useState(clientMiddleName);
    const [suffixID, setSuffixID] = useState(clientSuffixID);
    const [ssn, setSSN] = useState(clientSSN);
    const [fbiNcicNumber, setFbiNcicNumber] = useState(clientFbiNcic);
    const [birthDate, setBirthDate] = useState(utcBirthDate);

    //console.log(clientLastName);
    //console.log(clientFirstName);


   
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
            setLastName(e.target.value);
        }

        if (field === "txtFirstName") {
            setFirstName(e.target.value);
        }

        if (field === "txtMiddleName") {
            setMiddleName(e.target.value);
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

    function handleSuffixChange (suffix)  {
       console.log('this is the handleSuffixChange in Info.js ');
       console.log(suffix);
    }

    function handleDatePickerChange(birthDate) {
        //console.log('this is the date picker in Info.js ');
        //console.log(birthDate);
        setBirthDate(birthDate.date);
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
                    <div className="col-3">
                        <label htmlFor="txtMiddleName"><strong>Middle Name</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={middleName} onChange={e => infoTabOnChangeHandler(e, "txtMiddleName")} className="form-control" id="txtMiddleName"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="ddlSuffix"><strong>Suffix</strong></label>
                        <SuffixDropdown onSelectSuffix={handleSuffixChange} selected={props.infoTabSuffix} />          
                    </div>
                </div>
                <div className="form-row">
                <div className="col-3">
                        <label htmlFor="txtSSN"><strong> SSN</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={ssn} onChange={e => infoTabOnChangeHandler(e, "txtSSN")} className="form-control" id="txtSSN"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtFbiNcicNumber"><strong> FBI/NCIC Number </strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={fbiNcicNumber} onChange={e => infoTabOnChangeHandler(e, "txtFbiNcicNumber")} className="form-control" id="txtFbiNcicNumber"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtCurrentAge"><strong>Current Age</strong></label>
                        <div className="inpu-group mb-3">
                            <input type="text" readOnly value={diffInYears} className="form-control"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtDateOfBirth"><strong> Date of Birth *</strong></label>
                        <div className="input-group mb-3">
                        <DatePicker 
                             selected={ birthDate }
                             
                             onChange={date => handleDatePickerChange({date})}
                             className="form-control"                             
                         />
                        </div>
                    </div> 
                </div>
                <br></br>
                {state.count}
                {state.message}
            </div>;

}

export default Info;