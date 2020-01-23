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
import {useForm, ErrorMessage} from 'react-hook-form';

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

    //for validation
    const {register, handleSubmit, watch, errors, triggerValidation } = useForm();

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
    
    //for the reset button, it will enable if anything is changed
    const [isResetButtonDisabled, setResetButtonDisabled] = useState(true);
    //SSN field 
    const [isSsnRequired, setSsnRequired] = useState(false);
    const [errorDivCss, setErroDivCss] = useState('invalid-feedback');
    //Date of Birth field
    const [isBirthDateRequired, setBirthDateRequired] = useState(false);
    const [dobErrorDivCss, setDobErrorDivCss] = useState('invalid-feedback');
    //Race dropddown
    const [isRaceDropdownRequired, setIsRaceDropdownRequired] = useState(false);
    const [raceDdlErrorDivCss , setRaceDdlErrorDivCss] = useState('invalid-feedback');
    


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

    //add "Please Select" options to race and gender dropdowns if not there
    let genderPleaseSelectOption = genderValues.filter(function(gender) {
        return gender.ID === 0
    });

    //console.log('does select exist');
    //console.log(genderPleaseSelectOption);

    if (genderPleaseSelectOption.length === 0) {
        let pleaseSelectItem = {
            Name: "PleaseSelect",
            Description: "Please Select",
            Active: true,
            ID: 0,
            CreatedDate: new Date()
        }

        genderValues.splice(0, 0, pleaseSelectItem);       
    }

    let racePleaseSelectionOption = raceValues.filter(function(race) {
        return race.ID === 0
    }); 

    if (racePleaseSelectionOption.length === 0) {

        let pleaseSelectItem = {
            Name: "PleaseSelect",
            Description: "Please Select",
            Active: true,
            ID: 0,
            CreatedDate: new Date()
        }

        raceValues.splice(0, 0, pleaseSelectItem);
    }

    //doesn't work
    //let sortedGenderValues = genderValues.sort((a, b) => { return  a.ID > b.ID;  });
    //console.log('sorted genders: ');
    //console.log(genderValues);
    //console.log(raceValues);

    //genderValues = genderValues.sort();
    //raceValues = raceValues.sort();

    //console.log(genderValues);
    //console.log(raceValues);

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

    const [formClass, setFormClass] = useState('needs-validation');

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
            const ssnRegex = RegExp(/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/);
            const isValidSsn = ssnRegex.test(e.target.value);
            if (!isValidSsn) {
                //console.log('not valid');
                //setShowValidSsn(true);
                setSsnRequired(true);
                setErroDivCss('invalid-feedback d-block'); 
            } else { 
                //console.log('valid');
                //setShowValidSsn(false);
                setSsnRequired(undefined);
                setErroDivCss('invalid-feedback');
            }

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

    function isValidDate(d) {
        //return d.date instanceof Date && !isNaN(d);
        return Object.prototype.toString.call(d.date) === '[object Date]';
    }

    function handleSuffixChange (suffix)  {
       setResetButtonDisabled(false);
       //console.log('this is the handleSuffixChange in Info.js ');
       //console.log(suffix);
    }

    function handleDatePickerChange(birthDate) {
       // console.log('this is the birth date');
       // console.log(birthDate);
        let isValid = isValidDate(birthDate);
       // console.log(isValid);

        if (!isValid) {
            setBirthDateRequired(true);
            setDobErrorDivCss('invalid-feedback d-block')
        } else {
            setBirthDateRequired(false);
            setDobErrorDivCss('invalid-feedback');
        }

        setResetButtonDisabled(false); 
        setBirthDate(birthDate.date);
    }

    function handleGenderChange(gender){
        setResetButtonDisabled(false);
        //console.log('this is the handleGenderChange in Info.js ');
        //console.log(gender);
        setGenderID(gender);
    }

    function handleGenderDescriptionChange(genderDescription) {
        setResetButtonDisabled(false);
       // console.log('this is the handlGenderDescription in Info.js');
       // console.log(genderDescription);
        setGenderDescription(genderDescription);
    }

    function handleRaceChange(race) {
        setResetButtonDisabled(false);
        console.log('this is handleRaceChange ');
        console.log(race);


        if (race.ID === "0") {
            console.log('race is showing Please Select');
        }

        setRaceID(race);
    }

    function handleRaceDescriptionChange(raceDescription) {
        setResetButtonDisabled(false);
        //console.log('this is the handleRaceDescriptionChange ');
        //console.log(raceDescription);
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

    //this will fire when submission of the form is successful
    const updateButtonClickHandler = (event) => {
        //event.preventDefault();
    }

    const TriggerValidationHandler = () => {
        //triggerValidation("txtLastName");
        setFormClass('needs-validation was-validated');
        console.log('here are the errors:');
        console.log(errors);
       
        //need to check last name, first name, date of birth, race/ethnicity, and gender
        console.log(lastName);
        console.log(firstName);
        console.log(birthDate);
        console.log(genderID);
        console.log(raceID);
    }


    //this correctly gets errors
    //console.log(errors);

  

    return <div>
                <br></br>
                  <form onSubmit={handleSubmit(updateButtonClickHandler)} className={formClass} noValidate>
                    <div className="form-row">
                        <div className="col-3">
                            <div className="form-group">
                                <label htmlFor="txtLastName"><strong>Last Name *</strong></label>
                                <input type="text" 
                                    ref={register({required: true, maxLength: 50})} 
                                    value={lastName} 
                                    onChange={e => infoTabOnChangeHandler(e, "txtLastName")} 
                                    className="form-control" 
                                    id="txtLastName" 
                                    name="txtLastName" 
                                    required>
                                </input>
                                {errors.txtLastName && <div className="invalid-feedback" >This field is required</div> }
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="form-group">
                                <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                                <input type="text" 
                                    ref={register({required: true, maxLength: 50})} 
                                    value={firstName} 
                                    onChange={e => infoTabOnChangeHandler(e, "txtFirstName")} 
                                    className="form-control" 
                                    id="txtFirstName" 
                                    name="txtFirstName" 
                                    required>
                                </input>
                                {errors.txtFirstName && <div className="invalid-feedback" >This field is required</div> }
                            </div>

                        </div>
                        <div className="col-3">
                            <div className="form-group">
                                <label htmlFor="txtMiddleName"><strong>Middle Name</strong></label>
                                <input type="text"
                                    ref={register({ maxLength: 50 })} 
                                    value={middleName} 
                                    onChange={e => infoTabOnChangeHandler(e, "txtMiddleName")} 
                                    className="form-control" 
                                    id="txtMiddleName" 
                                    name="txtMiddleName">
                                 </input>
                                {errors.txtMiddleName && <div className="invalid-feedback" >This field may not exceed 50 characters.</div> }
                            </div>

                        </div>
                        <div className="col-3">
                            <label htmlFor="ddlSuffix"><strong>Suffix</strong></label>
                            <SuffixDropdown onSelectSuffix={handleSuffixChange} selected={props.infoTabSuffix} />          
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-3">
                            <div className="form-group">
                                <label htmlFor="txtSSN"><strong> SSN</strong></label>
                                <input type="text"
                                    value={ssn} 
                                    onChange={e => infoTabOnChangeHandler(e, "txtSSN")} 
                                    className="form-control" 
                                    id="txtSSN" 
                                    name="txtSSN" 
                                    required={isSsnRequired}>
                                 </input>
                               <div className={errorDivCss}>Please enter the SSN in a valid format.</div>  
                            </div>
                        </div>
                        <div className="col-3">
                            <label htmlFor="txtFbiNcicNumber"><strong> FBI/NCIC Number </strong></label>
                            <div className="input-group mb-3">
                                <input type="text" 
                                    value={fbiNcicNumber} 
                                    onChange={e => infoTabOnChangeHandler(e, "txtFbiNcicNumber")} 
                                    className="form-control" 
                                    id="txtFbiNcicNumber">
                                </input>
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
                                required={isBirthDateRequired}
                                onChange={date => handleDatePickerChange({date})}
                                className="form-control"                             
                            />
                            <div className={dobErrorDivCss}>Please enter a valid birth date.</div>
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
                            values={genderValues}
                            isRequired={true} >
                            </DropDown>
                        </div>
                        <div className="col-4">
                            <label><strong>Race/Ethnicity*</strong></label>
                            <DropDown
                                onSelectValue={handleRaceChange}
                                onSelectValueDescription={handleRaceDescriptionChange}
                                selected={raceID}
                                valueDescription={raceDescription}
                                values={raceValues}
                                isRequired={true}>
                            </DropDown>
                        </div>
                    </div>
                    <div className="form-row float-right">
                        <div className="col-auto">
                            <input type="submit" onClick={TriggerValidationHandler}  className="btn btn-primary mb-2" value="Update" />     
                        </div>
                        <div className="col-auto">
                            <button type="button" onClick={resetForm} disabled={isResetButtonDisabled} className="btn btn-primary mb-2">Reset</button>
                        </div>
                    </div>
                </form>
                <br></br>
                {state.count}
                {state.message}
            </div>;

});

export default Info;