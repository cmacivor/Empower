import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useStore} from './StateStores/store';
import SuffixDropdown from './SuffixDropdown';
import RaceDropDown from './RaceDropdown';
import GenderDropDown from './GenderDropdown';
import moment from 'moment';
import {useCacheService} from './useCacheService';
import DropDown from './Dropdown';

//using forwardRef as described here: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
//this allows the updateBirthDate() function to be called from the CaseManagement parent component
const Info = forwardRef((props, ref) => {

    if (props.clientProfile === undefined) return null;

    let clientInfo = props.clientProfile.Person;

   //need to create variables for each- if it's null, set to empty string for React controlled components
    let clientLastName = (clientInfo.LastName !== null)  ? clientInfo.LastName : '';
    let clientFirstName = (clientInfo.FirstName !== null)  ? clientInfo.FirstName : '';
    let clientMiddleName = (clientInfo.MiddleName !== null) ? clientInfo.MiddleName : '';
    let clientSuffixID = (clientInfo.Suffix !== null) ? clientInfo.Suffix : 'Please Select';
    let clientSSN = (clientInfo.SSN !== null) ? clientInfo.SSN : '';
    let clientFbiNcic = (clientInfo.FBINCIC !== null) ? clientInfo.SSN : '';
    let clientStateVcin = (clientInfo.StateORVCIN !== null) ? clientInfo.StateORVCIN : '';
    let clientAlias = (clientInfo.Alias !== null) ? clientInfo.Alias : ''; 
    let clientGenderID = (clientInfo.GenderID !== null) ? clientInfo.GenderID : '';
    let clientRaceID = (clientInfo.RaceID !== null) ? clientInfo.RaceID : '';

    //get the birthdate in UTC format- the datepicker plugin needs it that way
    let birthDateJavascriptDateObject = new Date(clientInfo.DOB);
    
    let utcBirthDate = convertDateToUtcFormat(clientInfo.DOB);

    //calculate age
    let difference = moment(new Date()).diff(birthDateJavascriptDateObject);
    let duration = moment.duration(difference, 'milliseconds');
    let diffInYears = Math.round(duration.asYears());

    //set the state variables
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
    const [raceID, setRaceID] = useState(clientRaceID);
    const [isResetButtonDisabled, setResetButtonDisabled] = useState(true);

    //variables to hold previous state- for when a value changes
    const [prevLastName] = useState(clientLastName);
    const [prevFirstName] = useState(clientFirstName);
    const [prevMiddleName] = useState(clientMiddleName);
    const [prevSuffixID] = useState(clientSuffixID);
    const [prevSsn] = useState(clientSSN);
    const [prevFbiNcicNumber] = useState(clientFbiNcic);
    const [prevBirthDate] = useState(utcBirthDate);
    const [prevStateVcin] = useState(clientStateVcin);
    const [prevAlias] = useState(clientAlias);
    const [prevGenderID] = useState(clientGenderID);
    const [prevRaceID] = useState(clientRaceID);

    //from the cache service, initialized in the parent case management component
    const genderValues = props.genderValues;
    const raceValues = props.raceValues;

    let genderObjectByClientGenderID = genderValues.filter(function(gender) {
       return gender.ID === clientGenderID
    });

   let raceObjectByClientRaceID = raceValues.filter(function(race) {
       return race.ID === clientRaceID
   });

    let clientGenderDescription = (genderObjectByClientGenderID.length > 0) ? genderObjectByClientGenderID[0].Description : '';
    let clientRaceDescription = (raceObjectByClientRaceID !== null) ? raceObjectByClientRaceID[0].Description : '';
   
    const [genderDescription, setGenderDescription] = useState(clientGenderDescription);
    const [raceDescription, setRaceDescription] = useState(clientRaceDescription);
    const [prevGenderDescription] = useState(clientGenderDescription);
    const [prevRaceDescription] = useState(clientRaceDescription);

    //see note at the top- this method is being called from the CaseManagement function. the ref and useImperativeHandle are necessary for this to work
    //because the DatePicker is not a function component, we have to update the date of birth field this way. Doing it in useEffect() creates an endless loop- this is a quirk of React Hooks
    useImperativeHandle(ref, () => ({
        updateBirthDate(birthDate) {

            let utcBirthDate = convertDateToUtcFormat(birthDate);

            setBirthDate(utcBirthDate);
        }
    }));


    //to test the global state
    const {state, dispatch} = useStore();

    //this will re-render the first name, last name, middle name, etc each time something changes, but NOT the dropdown values- those are handled in the select event handlers.
    //otherwise, when a selection in the dropdown is made, the useEffect overwrites what was just selected
    useEffect(() => {
        setFirstName(clientFirstName);
        setLastName(clientLastName);
        setMiddleName(clientMiddleName);
        setSuffixID(clientSuffixID);
        setSSN(clientSSN);

        setRaceDescription(clientRaceDescription);
        setGenderDescription(clientGenderDescription);
    }, [clientRaceDescription, clientGenderDescription]); //see this article: https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

    function convertDateToUtcFormat(date)
    {
        let birthDateJavascriptDateObject = new Date(date);
        let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
        let utcBirthDate = new Date(formattedBirthDate);
        return utcBirthDate;
    }

    function infoTabOnChangeHandler (e, field) {
        setResetButtonDisabled(false);
       
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
       setResetButtonDisabled(false);
       console.log('this is the handleSuffixChange in Info.js ');
       console.log(suffix);
    }

    function handleDatePickerChange(birthDate) {
        setResetButtonDisabled(false); 
        setBirthDate(birthDate.date);
    }

    function handleGenderChange(gender){
        setResetButtonDisabled(false);
        console.log('this is the handleGenderChange in Info.js ');
        console.log(gender);
        setGenderID(gender);
    }

    function handleGenderDescriptionChange(genderDescription) {
        setResetButtonDisabled(false);
        console.log('this is the handlGenderDescription in Info.js');
        console.log(genderDescription);
        setGenderDescription(genderDescription);
    }

    function handleRaceChange(race) {
        setResetButtonDisabled(false);
        console.log('this is handleRaceChange ');
        console.log(race);
        setRaceID(race);
    }

    function handleRaceDescriptionChange(raceDescription) {
        setResetButtonDisabled(false);
        console.log('this is the handleRaceDescriptionChange ');
        console.log(raceDescription);
        setRaceDescription(raceDescription);
    }

    function resetForm() {
        setLastName(prevLastName);
        setFirstName(prevFirstName);
        setMiddleName(prevMiddleName);
        setSSN(prevSsn);
        setFbiNcicNumber(prevFbiNcicNumber);
        setBirthDate(prevBirthDate);
        setStateVcin(prevStateVcin);
        setAlias(prevAlias);
        
        setGenderID(prevGenderID);
        setSuffixID(prevSuffixID);
        setRaceID(prevRaceID);
        setGenderDescription(prevGenderDescription);
        setRaceDescription(prevRaceDescription);
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
                        <DropDown
                         onSelectValue={handleGenderChange}
                         onSelectValueDescription={handleGenderDescriptionChange}
                         selected={genderID}
                         valueDescription={genderDescription}
                         values={genderValues}>
                        </DropDown>
                    </div>
                    <div className="col-4">
                        <label><strong>Race/Ethnicity*</strong></label>
                        <DropDown
                            onSelectValue={handleRaceChange}
                            onSelectValueDescription={handleRaceDescriptionChange}
                            selected={raceID}
                            valueDescription={raceDescription}
                            values={raceValues}>
                        </DropDown>
                    </div>
                </div>
                <div className="form-row float-right">
                    <div className="col-auto">
                        <button type="button"  className="btn btn-primary mb-2">Update</button>     
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={resetForm} disabled={isResetButtonDisabled} className="btn btn-primary mb-2">Reset</button>
                    </div>
                </div>
                <br></br>
                {state.count}
                {state.message}
            </div>;

});

export default Info;