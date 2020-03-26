import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useStore } from './StateStores/store';
import SuffixDropdown from './SuffixDropdown';
import RaceDropDown from './RaceDropdown';
import GenderDropDown from './GenderDropdown';
import moment from 'moment';
import { useCacheService } from './useCacheService';
import DropDown from './Dropdown';
import { useForm, ErrorMessage } from 'react-hook-form';
import { Api } from './commonAdmin';
import { GenerateUniqueID } from './NewClient';
import { getSessionData } from './commonAdmin';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
//const {state, dispatch} = useStore();

//using forwardRef as described here: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
//this allows the updateBirthDate() function to be called from the CaseManagement parent component
const Info = forwardRef((props, ref) => {
    //to test the global state
    const { state, dispatch } = useStore();

    let clientLastName = '';
    let clientFirstName = '';
    let clientMiddleName = '';
    let clientSuffixID = '';
    let clientSSN = '';
    let clientFbiNcic = '';
    let clientStateVcin = '';
    let clientAlias = '';
    let clientGenderID = '';
    let clientRaceID = '';
    let utcBirthDate = new Date();
    let diffInYears = '';
    let saveButtonShow = false;
    let personID = '';
    let clientCreatedDate = '';
    let clientCreatedBy = '';
    let clientUpdatedDate = '';
    let clientUpdatedBy = '';



    //the user clicked on a row in the search grid
    if (props.clientProfile !== undefined) {
        let clientInfo = props.clientProfile.Person;

        //need to create variables for each- if it's null, set to empty string for React controlled components
        clientLastName = (clientInfo.LastName !== null) ? clientInfo.LastName : '';
        clientFirstName = (clientInfo.FirstName !== null) ? clientInfo.FirstName : '';
        clientMiddleName = (clientInfo.MiddleName !== null) ? clientInfo.MiddleName : '';
        clientSuffixID = (clientInfo.SuffixID !== null) ? clientInfo.SuffixID : '';
        clientSSN = (clientInfo.SSN !== null) ? clientInfo.SSN : '';
        clientFbiNcic = (clientInfo.FBINCIC !== null) ? clientInfo.SSN : '';
        clientStateVcin = (clientInfo.StateORVCIN !== null) ? clientInfo.StateORVCIN : '';
        clientAlias = (clientInfo.Alias !== null) ? clientInfo.Alias : '';
        clientGenderID = (clientInfo.GenderID !== null) ? clientInfo.GenderID : '';
        clientRaceID = (clientInfo.RaceID !== null) ? clientInfo.RaceID : '';
        personID = (clientInfo.PersonID !== null) ? clientInfo.PersonID : '';
        clientCreatedDate = (clientInfo.CreatedDate !== null) ? clientInfo.CreatedDate : '';
        clientCreatedBy = (clientInfo.CreatedBy !== null) ? clientInfo.CreatedBy : '';
        clientUpdatedDate = (clientInfo.UpdatedDate !== null) ? clientInfo.UpdatedDate : '';
        clientUpdatedBy = (clientInfo.UpdatedBy !== null) ? clientInfo.UpdatedBy : '';

        //get the birthdate in UTC format- the datepicker plugin needs it that way
        let birthDateJavascriptDateObject = new Date(clientInfo.DOB);

        utcBirthDate = convertDateToUtcFormat(clientInfo.DOB);


        //calculate age
        diffInYears = calculateAge(birthDateJavascriptDateObject);

        saveButtonShow = false;
    } else {
        saveButtonShow = true;
        
    }

    //for validation
    const { register, handleSubmit, watch, errors, triggerValidation } = useForm();

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
    const [currentAge, setCurrentAge] = useState(diffInYears);
    const [ID, setPersonID] = useState(personID);
    const [createdDate, setCreatedDate] = useState(createdDate);
    const [createdBy, setCreatedBy] = useState(createdBy);
    const [updatedDate, setUpdatedDate] = useState(updatedDate);
    const [updatedBy, setUpdatedBy] = useState(updatedBy);

    const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(saveButtonShow);

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
    const [raceDdlErrorDivCss, setRaceDdlErrorDivCss] = useState('invalid-feedback');

    const [genderValues, setGenderValues] = useState([]);
    const [suffixValues, setSuffixValues] = useState([]);
    const [raceValues, setRaceValues] = useState([]);

    const [hideGenderError, setHideGenderError] = useState(true);
    const [hideRaceError, setHideRaceError] = useState(true);


    let clientSuffixDescription = 'Please Select';
    let clientGenderDescription = 'Please Select';
    let clientRaceDescription = 'Please Select';


    const [genderDescription, setGenderDescription] = useState(clientGenderDescription);
    const [raceDescription, setRaceDescription] = useState(clientRaceDescription);
    const [suffixDescription, setSuffixDescription] = useState(clientSuffixDescription);


    //variables to hold previous state- for when a value changes
    const [prevLastName, setPrevLastName] = useState(clientLastName);
    const [prevFirstName, setPrevFirstName] = useState(clientFirstName);
    const [prevMiddleName, setPrevMiddleName] = useState(clientMiddleName);
    const [prevSsn, setPrevSsn] = useState(clientSSN);
    const [prevFbiNcicNumber, setPrevFbiNcicNumber] = useState(clientFbiNcic);
    const [prevBirthDate, setPrevBirthDate ] = useState(utcBirthDate);
    const [prevStateVcin, setPrevStateVcin] = useState(clientStateVcin);
    const [prevAlias, setPrevAlias] = useState(clientAlias);
    const [prevGenderID, setPrevGenderId] = useState(clientGenderID);
    const [prevRaceID, setPrevRaceId] = useState(clientRaceID);
    const [prevSuffixID, setPrevSuffixID] = useState(clientSuffixID);
    const [prevGenderDescription, setPrevGenderDescription] = useState(clientGenderDescription);
    const [prevRaceDescription, setPrevRaceDescription] = useState(clientRaceDescription);
    const [prevSuffixDescription, setPrevSuffixDescription] = useState(clientSuffixDescription);

    //Audit details
    const [prevID, setPrevId] = useState(personID);
    const [prevCreatedDate, setPrevCreatedDate] = useState(clientCreatedDate);
    const [prevCreatedBy, setPrevCreatedBy] = useState(clientCreatedBy);
    const [prevUpdatedDate, setPrevUpdatedDate] = useState(clientUpdatedDate);
    const [prevUpdatedBy, setPrevUpdatedBy ] = useState(clientUpdatedBy);

    const [formClass, setFormClass] = useState('needs-validation');

    //Modal window
    const [modal, setModal] = useState(false);
    const [mergeOptions, setMergeOptions ] = useState([]);
    const toggle = () => setModal(!modal);
    const [mergeModalTableRows, setMergeModalTableRows] = useState('');


  
    //see note at the top- this method is being called from the CaseManagement function. the ref and useImperativeHandle are necessary for this to work
    //because the DatePicker is not a function component, we have to update the date of birth field this way. Doing it in useEffect() creates an endless loop- this is a quirk of React Hooks
    useImperativeHandle(ref, () => ({
        updateBirthDate(birthDate) {

            let utcBirthDate = convertDateToUtcFormat(birthDate);

            setBirthDate(utcBirthDate);
        },

        //have to wrap resetForm() because it's not accessible from the parent at all- but defining clearForm() here means that clearForm() is accessible in the parent
        clearForm() {
            resetForm();
        }
    }));




    //this will re-render the first name, last name, middle name, etc each time something changes, but NOT the dropdown values- those are handled in the select event handlers.
    //otherwise, when a selection in the dropdown is made, the useEffect overwrites what was just selected
    useEffect(() => {
        setFirstName(clientFirstName);
        setLastName(clientLastName);
        setMiddleName(clientMiddleName);
        setSuffixID(clientSuffixID);
        setSSN(clientSSN);
        setGenderID(clientGenderID);
        setRaceID(clientRaceID);
        setCurrentAge(diffInYears);

        //TODO:need to update the prev variables as well for the reset button
        // setPrevFirstName(clientFirstName);
        // setPrevLastName(clientLastName);
        // setPrevSsn(clientSSN);
        // setPrevFbiNcicNumber(clientFbiNcic);
        // setPrevBirthDate(utcBirthDate);
        // setPrevStateVcin(clientStateVcin);
        // setPrevAlias(clientAlias);
        // setPrevGenderId(clientGenderID);
        // setPrevRaceId(clientRaceID);
        // setPrevSuffixID(clientSuffixID);
        
        // setPrevCreatedDate(clientCreatedDate);
        // setPrevCreatedDate(clientCreatedBy);
        // setPrevUpdatedDate(clientUpdatedDate);
        // setPrevUpdatedBy(clientUpdatedBy);

        if (state.isNewClient) {

            let birthDateReset = new Date();
            let birthDateUTC = convertDateToUtcFormat(birthDateReset);
            setBirthDate(birthDateUTC);
        }


        Api.getConfigDataByType("Gender").then(options => {
            //populate the options
            let completeOptions = addPleaseSelect(options);
            setGenderValues(completeOptions);

            if (clientGenderID === '') {
                return;
            }

            let selectedGenderOption = genderValues.filter(function (gender) {
                return gender.ID === parseInt(clientGenderID);
            });
            setGenderDescription(selectedGenderOption[0].Description);
            setPrevGenderDescription(selectedGenderOption[0].Description)

        });

        Api.getConfigDataByType("Suffix").then(options => {
            let completeOptions = addPleaseSelect(options);
            setSuffixValues(completeOptions);

            if (clientSuffixID === '') {
                return;
            }

            let selectedSuffixOption = suffixValues.filter(function (suffix) {
                return suffix.ID === parseInt(clientSuffixID);
            });

            setSuffixDescription(selectedSuffixOption[0].Description);
            setPrevSuffixDescription(selectedSuffixOption[0].Description)
        });


        Api.getConfigDataByType("Race").then(options => {
            let completeOptions = addPleaseSelect(options);

            setRaceValues(completeOptions);

            if (clientRaceID === '') {
                return;
            }

            let selectedRaceOption = raceValues.filter(function (race) {
                return race.ID === parseInt(clientRaceID);
            });

            setRaceDescription(selectedRaceOption[0].Description);
            setPrevRaceDescription(selectedRaceOption[0].Description);
        });


        setRaceDescription(clientRaceDescription);
        setGenderDescription(clientGenderDescription);
        setRaceDescription(clientRaceDescription);


    }, [clientFirstName, clientLastName, clientRaceDescription, clientGenderDescription]); //see this article: https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

    function calculateAge(birthDate) {
        let difference = moment(new Date()).diff(birthDate);
        let duration = moment.duration(difference, 'milliseconds');
        diffInYears = Math.round(duration.asYears());
        return diffInYears;
    }

    function addPleaseSelect(options) {
        let pleaseSelectItem = {
            Name: "PleaseSelect",
            Description: "Please Select",
            Active: true,
            ID: 0,
            CreatedDate: new Date()
        }

        options.splice(0, 0, pleaseSelectItem);

        return options;
    }

    function convertDateToUtcFormat(date) {
        let birthDateJavascriptDateObject = new Date(date);
        let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
        let utcBirthDate = new Date(formattedBirthDate);
        return utcBirthDate;
    }

    function infoTabOnChangeHandler(e, field) {
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
                setSsnRequired(true);
                setErroDivCss('invalid-feedback d-block');
            } else {
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
        let dateObject = new Date(d.date);
        return Object.prototype.toString.call(dateObject) === '[object Date]';
    }



    function handleDatePickerChange(birthDate) {

        if (birthDate.date === null) {
            return;
        }

        let isValid = isDateofBirthValid(birthDate);

        if (!isValid) {
            setBirthDateRequired(true);
            setDobErrorDivCss('invalid-feedback d-block')
        } else {
            setBirthDateRequired(false);
            setDobErrorDivCss('invalid-feedback');
        }

        setResetButtonDisabled(false);
        setBirthDate(birthDate.date);

        let diffInYears = calculateAge(birthDate.date);
        setCurrentAge(diffInYears);
    }

    function isDateofBirthValid(birthDate) {

        let isValid = isValidDate(birthDate);

        //let today = new Date();
        //let isLessThanCurrent = (birthDate < today);

        if (!isValid) {
            return false;
        }

        return true;
    }


    function resetForm() {
        setLastName(prevLastName);
        setFirstName(prevFirstName);
        setMiddleName(prevMiddleName);
        setSSN(prevSsn);
        setFbiNcicNumber(prevFbiNcicNumber);
        
        utcBirthDate = new Date();   
        setBirthDate(utcBirthDate);
        setCurrentAge('');
        
        setStateVcin(prevStateVcin);
        setAlias(prevAlias);

        setGenderID(prevGenderID);
        setSuffixID(prevSuffixID);
        setRaceID(prevRaceID);
        setGenderDescription(prevGenderDescription);
        setRaceDescription(prevRaceDescription);
        setSuffixDescription(prevSuffixDescription);

        //setCurrentAge('');
        //setPersonID('');

    }

    //this will fire when submission of the form is successful
    const updateButtonClickHandler = (event) => {
        //event.preventDefault();
    }

    const TriggerValidationHandler = () => {

        setFormClass('needs-validation was-validated');

        //validate the dropdowns
        if (raceID === '') {
            setHideRaceError(false);
        }

        if (genderID === '') {
            setHideGenderError(false);
        }

        //need to convert the birthDate a date object first
        let birthDateObj = new Date(birthDate);

        let isBirthDateValid = isDateofBirthValid(birthDateObj);
        if (!isBirthDateValid) {
            setBirthDateRequired(true);
            setDobErrorDivCss('invalid-feedback d-block')
        } else {
            setBirthDateRequired(false);
            setDobErrorDivCss('invalid-feedback');
        }

        //need to check last name, first name, date of birth, race/ethnicity, and gender
        let currentDate = new Date();
        //all data is valid
        if (lastName !== '' && firstName !== '' && birthDate < currentDate && raceID !== '' && genderID !== '') {

            let id = GenerateUniqueID(lastName, firstName, middleName, birthDate, genderID);

            let apiAddress = sessionStorage.getItem("baseApiAddress");
            let fullPersonAddress = `${apiAddress}/api/Person`;
            let sessionStorageData = getSessionData();

            let postData = {
                LastName: lastName,
                FirstName: firstName,
                MiddleName: middleName,
                SuffixID: suffixID,
                StateORVCIN: stateVcin,
                FBINCIC: fbiNcicNumber,
                Alias: alias,
                DOB: birthDate,
                RaceID: raceID,
                GenderID: genderID,
                SSN: ssn,
                Active: true,
                UniqueID: id,
            }

            //they already exist, and this is an update
            if (ID !== '') {
       
                let uniqueID = GenerateUniqueID(lastName, firstName, middleName, birthDate, genderID);
                alert('The Unique License Number is: ' + uniqueID);

                UpdateClient(fullPersonAddress, postData);

            }
            else //this is a new client
            {
                postData.CreatedDate =  new Date();
                postData.CreatedBy = sessionStorageData.CurrentUser;
                postData.UpdatedDate = new Date();
                postData.UpdatedBy = sessionStorageData.CurrentUser;

                let uniqueID = GenerateUniqueID(lastName, firstName, middleName, birthDate, genderID);

                alert('The Unique License Number is: ' + uniqueID);

                let duplicatePersonsAddress = `${apiAddress}/api/Person/GetduplicatePersons/${uniqueID}`;

                fetch(duplicatePersonsAddress, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorageData.Token
                    }
                    //body: JSON.stringify(postData)
                })
                .then(result => result.json())
                .then(result => {
                    console.log(result); 

                    //if there are duplicates returned, display them on the modal
                    if (result.length > 0 ) {
                        
                    }
                   
                    //no duplicates: should be good to go to update the UniqueIds for the addded person
                    else { 

                        CreateNewClient(postData, uniqueID);
                    }

                });
            }

            setHideRaceError(true);
            setHideGenderError(true);
        }
    }

    function UpdateClient(fullPersonAddress, postData) {
        let sessionStorageData = getSessionData();

        postData.CreatedDate = createdDate;
        postData.CreatedBy = createdBy;
        postData.UpdatedDate = updatedDate;
        postData.UpdatedBy = updatedBy;
        postData.ID = ID;

         //make a PUT call with all of the parameters
         fetch(fullPersonAddress, {
            //mode: 'cors',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(postData)
        })
        .then(result => result.json())
        .then(result => {
            props.createNotification('The client profile was successfully updated.');
        });
    }


    function CreateNewClient(postData, uniqueID){

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let createPersonAddress = `${apiAddress}/api/Person`;
        let sessionStorageData = getSessionData();

        fetch(createPersonAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
        },
            body: JSON.stringify(postData)
        })
        .then(result => result.json())
        .then(savedPersonResult => {

            //if the return result is "SSN", then a record with this SSN already exists in the database
            if (savedPersonResult === "SSN") {
                props.createErrorNotification("A record with this social security number already exists in the database.");
                return;
            }

            //console.log('the newly created');
            //console.log(savedPersonResult);
        
            //update unique ID for the newly added person
            let uniqueIdPostData = [];

            uniqueIdPostData[0] = {
                PersonId: savedPersonResult.PersonID,
                UniqueId: uniqueID
            }

            let listToUpdate = {
                "list": uniqueIdPostData
            }

            let updateUniquIdUrl = `${apiAddress}/api/Person/UpdateAlluniqueIds`;

            fetch(updateUniquIdUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                },
                body: JSON.stringify(listToUpdate)
            }).then(result => {
                
           

                //need to update the state with the return result

                let birthDateJavascriptDateObject = new Date(savedPersonResult.Person.DOB);
                let utcBirthDate = convertDateToUtcFormat(birthDateJavascriptDateObject);
                let diffInYears = calculateAge(birthDateJavascriptDateObject);

                setLastName(savedPersonResult.Person.LastName);
                setFirstName(savedPersonResult.Person.FirstName);
                setMiddleName(savedPersonResult.Person.MiddleName);
                setSuffixID(savedPersonResult.Person.SuffixID);
                setSSN(savedPersonResult.Person.SSN);
                setFbiNcicNumber(savedPersonResult.Person.FBINCIC);
                setBirthDate(utcBirthDate);
                setStateVcin(savedPersonResult.Person.StateORVCIN);
                setAlias(savedPersonResult.Person.Alias);
                setGenderID(savedPersonResult.Person.GenderID);
                setRaceID(savedPersonResult.Person.RaceID);
                setCurrentAge(diffInYears);
                setPersonID(savedPersonResult.PersonID);
                setCreatedDate(savedPersonResult.Person.CreatedDate);
                setCreatedBy(savedPersonResult.Person.CreatedBy);
                setUpdatedDate(savedPersonResult.Person.UpdatedDate);
                setUpdatedBy(savedPersonResult.Person.UpdatedBy);

                //saveButtonShow = false;
                setIsSaveButtonVisible(false);
                
                props.createNotification('The client profile was successfully created.');
            });
            
        });
    }


    function onSelectGenderHandler(event) {

        let selectedValue = event.currentTarget.getAttribute('value');
        setGenderID(selectedValue);

        let selectedGenderOption = genderValues.filter(function (gender) {
            return gender.ID === parseInt(selectedValue)
        });

        setGenderDescription(selectedGenderOption[0].Description);

        if (selectedValue !== '' && parseInt(selectedValue) !== 0) {
            setHideGenderError(true);
        } else {
            setHideGenderError(false);
        }

    }

    function onSelectSuffixHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        setSuffixID(selectedValue);

        let selectedSuffixOption = suffixValues.filter(function (suffix) {
            return suffix.ID === parseInt(selectedValue)
        });

        setSuffixDescription(selectedSuffixOption[0].Description);
    }

    function onSelectRaceHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        setRaceID(selectedValue);

        let selectedRaceOption = raceValues.filter(function (race) {
            return race.ID === parseInt(selectedValue);
        });

        setRaceDescription(selectedRaceOption[0].Description);

        if (selectedValue !== '' && parseInt(selectedValue) !== 0) {
            setHideRaceError(true);
        } else {
            setHideRaceError(false);
        }

    }

    let buttonType;
    if (isSaveButtonVisible) {

        buttonType = <div className="col-auto">
            <button type="button" onClick={TriggerValidationHandler} className="btn btn-primary mb-2">Save</button>
        </div>;

    } else {

        buttonType = <div className="col-auto">
            <input type="submit" onClick={TriggerValidationHandler} className="btn btn-primary mb-2" value="Update" />
        </div>;
    }


    //set up the options for the Gender dropdown
    let genderValueOptions = [];
    if (genderValues.length > 0) {

        genderValueOptions = genderValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={onSelectGenderHandler} className="dropdown-item">{value.Description}</a>
        );

    }

    let suffixValueOptions = [];
    if (suffixValues.length > 0) {
        suffixValueOptions = suffixValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={onSelectSuffixHandler} className="dropdown-item">{value.Description}</a>
        );
    }

    let raceValueOptions = [];
    if (raceValues.length > 0) {
        raceValueOptions = raceValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={onSelectRaceHandler} className="dropdown-item">{value.Description}</a>
        );
    }

  

    return <div>
        <br></br>
        <form onSubmit={handleSubmit(updateButtonClickHandler)} className={formClass} noValidate>
            <div className="form-row">
                <div className="col-3">
                    <div className="form-group">
                        <label htmlFor="txtLastName"><strong>Last Name *</strong></label>
                        <input type="text"
                            ref={register({ required: true, maxLength: 50 })}
                            value={lastName}
                            onChange={e => infoTabOnChangeHandler(e, "txtLastName")}
                            className="form-control"
                            id="txtLastName"
                            name="txtLastName"
                            required>
                        </input>
                        {errors.txtLastName && <div className="invalid-feedback" >This field is required</div>}
                    </div>
                </div>
                <div className="col-3">
                    <div className="form-group">
                        <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                        <input type="text"
                            ref={register({ required: true, maxLength: 50 })}
                            value={firstName}
                            onChange={e => infoTabOnChangeHandler(e, "txtFirstName")}
                            className="form-control"
                            id="txtFirstName"
                            name="txtFirstName"
                            required>
                        </input>
                        {errors.txtFirstName && <div className="invalid-feedback" >This field is required</div>}
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
                        {errors.txtMiddleName && <div className="invalid-feedback" >This field may not exceed 50 characters.</div>}
                    </div>

                </div>
                <div className="col-3">
                    <label htmlFor="ddlSuffix"><strong>Suffix</strong></label>
                    <div className="dropdown">
                        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                            {suffixDescription}
                        </button>
                        <div className="dropdown-menu">
                            {suffixValueOptions}
                        </div>
                    </div>
                    {/* <SuffixDropdown onSelectSuffix={handleSuffixChange} selected={props.infoTabSuffix} />           */}
                    {/* <DropDown
                                onSelectValue={handleSuffixChange}
                                onSelectValueDescription={handleSuffixDescriptionChange}
                                selected={suffixID}
                                valueDescription={suffixDescription}
                                type={"suffix"}
                                isRequired={true}>
                            </DropDown> */}
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
                        <input type="text" readOnly value={currentAge} className="form-control"></input>
                    </div>
                </div>
                <div className="col-3">
                    <label htmlFor="txtDateOfBirth"><strong> Date of Birth *</strong></label>
                    <div className="input-group mb-3">
                        <DatePicker
                            selected={birthDate}
                            required={isBirthDateRequired}
                            onChange={date => handleDatePickerChange({ date })}
                            className="form-control"
                            strictParsing
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
                    <div className="dropdown">
                        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                            {genderDescription}
                        </button>
                        <div className="dropdown-menu">
                            {genderValueOptions}
                        </div>
                    </div>
                    {hideGenderError || <div className='errorDiv'>Please select a value.</div>}
                    {/* <DropDown
                                onSelectValue={handleGenderChange}
                                onSelectValueDescription={handleGenderDescriptionChange}
                                selected={genderID}
                                valueDescription={genderDescription}
                                values={genderValues}
                                isRequired={true}>
                            </DropDown> */}

                </div>
                <div className="col-4">
                    <label><strong>Race/Ethnicity*</strong></label>
                    <div className="dropdown">
                        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                            {raceDescription}
                        </button>
                        <div className="dropdown-menu">
                            {raceValueOptions}
                        </div>
                    </div>
                    {hideRaceError || <div className='errorDiv'>Please select a value.</div>}
                    {/* <DropDown
                                onSelectValue={handleRaceChange}
                                onSelectValueDescription={handleRaceDescriptionChange}
                                selected={raceID}
                                valueDescription={raceDescription}
                                type={"race"}
                                isRequired={true}>
                            </DropDown> */}
                </div>
            </div>
            <div className="form-row float-right">
                {buttonType}
                <div className="col-auto">
                    <button type="button" onClick={resetForm} disabled={isResetButtonDisabled} className="btn btn-primary mb-2">Reset</button>
                </div>
            </div>
        </form>
        <Modal size="lg" isOpen={modal} toggle={toggle}>
                  <ModalHeader toggle={toggle}>Duplicates</ModalHeader>
                  <ModalBody>
                    <table id="mergeTable" className="table">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col">First Name</th>
                          <th scope="col">Last Name</th>
                          <th scope="col">Middle Name</th>
                          <th scope="col">Date of Birth</th>
                          <th scope="col">Gender</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mergeModalTableRows}
                      </tbody>
                    </table>
                  </ModalBody>
                  <ModalFooter>
                    {/* <Button color="primary" onClick={mergeProfiles}>Merge Services</Button>{' '} */}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                  </ModalFooter>
                </Modal>
    </div>;

});

export default Info;