import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useStore} from './StateStores/store';
import SuffixDropdown from './SuffixDropdown';
import RaceDropDown from './RaceDropdown';
import GenderDropDown from './GenderDropdown';
import moment from 'moment';
import {useCacheService} from './useCacheService';

//using forwardRef as described here: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
const Info = forwardRef((props, ref) => {

   // console.log(props);



    if (props.clientProfile === undefined) return null;

    let clientInfo = props.clientProfile.Person;

   //need to create variables for each- if it's null, set to empty string for React controlled components
    let clientLastName = (clientInfo.LastName !== null)  ? clientInfo.LastName : '';
    let clientFirstName = (clientInfo.FirstName !== null)  ? clientInfo.FirstName : '';
    //console.log('the first name');
    //console.log(clientFirstName);

    let clientMiddleName = (clientInfo.MiddleName !== null) ? clientInfo.MiddleName : '';
    let clientSuffixID = (clientInfo.Suffix !== null) ? clientInfo.Suffix : 'Please Select';
    let clientSSN = (clientInfo.SSN !== null) ? clientInfo.SSN : '';
    let clientFbiNcic = (clientInfo.FBINCIC !== null) ? clientInfo.SSN : '';
    let clientStateVcin = (clientInfo.StateORVCIN !== null) ? clientInfo.StateORVCIN : '';
    let clientAlias = (clientInfo.Alias !== null) ? clientInfo.Alias : ''; 
    //GenderID, RaceID
    let clientGenderID = (clientInfo.GenderID !== null) ? clientInfo.GenderID : '';
    let clientRaceID = (clientInfo.RaceID !== null) ? clientInfo.RaceID : '';

    //get the birthdate in UTC format- the datepicker plugin needs it that way
    let birthDateJavascriptDateObject = new Date(clientInfo.DOB);
    let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
    let utcBirthDate = new Date(formattedBirthDate);


    //calculate age
    let difference = moment(new Date()).diff(birthDateJavascriptDateObject);
    let duration = moment.duration(difference, 'milliseconds');
    let diffInYears = Math.round(duration.asYears());



 
    const [lastName, setLastName] = useState(clientLastName);
    const [firstName, setFirstName] = useState(clientFirstName);
    const [middleName, setMiddleName] = useState(clientMiddleName);
    const [suffixID, setSuffixID] = useState(clientSuffixID);
    const [ssn, setSSN] = useState(clientSSN);
    const [fbiNcicNumber, setFbiNcicNumber] = useState(clientFbiNcic);
    const [birthDate, setBirthDate] = useState(utcBirthDate);
    const [stateVcin, setStateVcin] = useState(clientStateVcin);
    const [alias, setAlias] = useState(clientAlias);
    const [genderID, setGenderID] = useState(clientGenderID);
    //const [genders, setGenders] = useState([]);
    const [raceID, setRaceID] = useState(clientRaceID);

    //const genders = useCacheService();

    // if (!genders.length) {
    //     Api.getConfigDataByType("Gender").then(genders => setGenders(genders));
    // }


    // let genderObjectByClientGenderID = genders.filter(function(gender) {
    //    return gender.ID === clientGenderID
    // });

    //let clientGenderDescription = (genderObjectByClientGenderID.length > 0) ? genderObjectByClientGenderID[0].Description : '';
    
    const [genderDescription, setGenderDescription] = useState('clientGenderDescription');

    useImperativeHandle(ref, () => ({
        updateBirthDate(birthDate) {

            //get the birthdate in UTC format- the datepicker plugin needs it that way
            let birthDateJavascriptDateObject = new Date(birthDate);
            let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
            let utcBirthDate = new Date(formattedBirthDate);

            setBirthDate(utcBirthDate);
        }
    }));

//     let raceObjectByClientRaceID = races.races.filter(function(race) {
//        return race.ID === finalResult.ClientProfile.Person.RaceID
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

 

    //to test the global state
    const {state, dispatch} = useStore();

   // console.log(utcBirthDate);

    useEffect(() => {
        setFirstName(clientFirstName);
        setLastName(clientLastName);
        setMiddleName(clientMiddleName);
        setSuffixID(clientSuffixID);
        setSSN(clientSSN);
    });

    function infoTabOnChangeHandler (e, field) {
       
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
           setSSN(e.target.value);
        }

        if (field === "txtFbiNcicNumber") {
            setFbiNcicNumber(e.target.value);
        }

        if (field === "txtStateVCIN") {
            setStateVcin(e.target.value);
        }

        if (field === "txtAlias") {
            setAlias(e.target.value);
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

    function handleGenderChange(gender){
        console.log('this is the handleGenderChange in Info.js ');
        console.log(gender);
    }

    function handleGenderDescriptionChange(genderDescription) {
        console.log('this is the handlGenderDescription in Info.js');
        console.log(genderDescription);
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
                <div className="form-row">
                    <div className="col-3">
                        <label htmlFor="txtStateVCIN"><strong>State/VCIN Number</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={stateVcin} onChange={e => infoTabOnChangeHandler(e, "txtStateVCIN")} className="form-control" id="txtStateVCIN"></input>
                        </div>                       
                    </div>
                    <div className="col-2">
                        <label htmlFor="txtAlias"><strong>Alias</strong></label>
                        <div className="input-group mb-3">
                            <input type="text" value={alias} onChange={e => infoTabOnChangeHandler(e, "txtAlias")} className="form-control" id="txtAlias"></input>
                        </div>
                    </div>
                    <div className="col-2">
                        <label htmlFor="ddlGender"><strong>Gender*</strong></label>
                        <GenderDropDown 
                        onSelectGender={handleGenderChange} 
                        onSelectGenderDescription={handleGenderDescriptionChange} 
                        selected={genderID}
                        genderDescription={genderDescription}/>
                    </div>
                </div>
                <br></br>
                {state.count}
                {state.message}
            </div>;

});

export default Info;