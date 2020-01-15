import React, { useState } from 'react';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import moment from 'moment';
import { Api } from './commonAdmin';

const Search = (props) => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [columns] = useState([
        { name: 'FirstName', title: 'First Name' },
        { name: 'LastName', title: 'Last Name' },
        { name: 'MiddleName', title: 'Middle Name' },
        { name: 'StateORVCIN', title: 'State/VCIN #' },
        { name: 'SSN', title: 'SSN' },
        { name: 'FormattedBirthDate', title: 'Birth Date' }, 
        { name: 'Gender', title: 'Gender' },        
      ]);
     const [rows, setRows] = useState([]);
     const [isGridVisible, setGridVisible] = useState(false);


    function handleLastNameChange (event)  {
        setLastName(event.target.value);
    }

    function handleFirstNameChange (event) {
        setFirstName(event.target.value);
    }

    function SearchButtonClickHandler() {
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");
        
        let fullSearchAddress = `${apiAddress}/api/ClientProfile/Search`;

        let postData = {
            lastName: lastName,
            firstName: firstName
        }

        try
        {
           var promise = fetch(fullSearchAddress, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(postData)
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    return result.json();
                } 
    
            }).then(finalResult => {
                //rows = finalResult;
                setRows(finalResult);
                setGridVisible(true);
                //isGridVisible === true;
                // this.setState({
                //     rows: finalResult,
                //     isGridVisible: true
                // });
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while searching;');
        }
    }

   const TableComponent = ({ ...restProps }) => (
        <Table.Table
          {...restProps}
          className="table-hover"
        />
      );

   const TableRow = ({ row, ...restProps }) => (
        <Table.Row
          {...restProps}
          onClick={() => GetSelectedRow(row) }/>
      );

    function ClearSearchFields() {
        setLastName('');
        setFirstName('');
    }

    // function EnableTabs() {

    //     // this.setState({
    //     //     isTabDisabled: false,
    //     //     defaultTab: "participantinfo",
    //     //     activeTab: "participantinfo"
    //     // });
    // }

    function GetSelectedRow(row) {
        console.log(row);

        //this.EnableTabs();
        props.enableTabsHandler();
        
        // let apiAddress = sessionStorage.getItem("baseApiAddress");

        // let token = sessionStorage.getItem("token");
        
        // let clientProfileAddress = `${apiAddress}/api/ClientProfile/${row.ID}`;

        // try
        // {
        //    var promise = fetch(clientProfileAddress, {
        //         method: 'get',
        //         mode: 'cors',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + token
        //         }               
        //     }); 

        //     promise.then(result =>  {
        //         if (result.status === 200) {
        //             return result.json();
                
        //         } else {
        //             return result.json();
        //         } 
    
        //     }).then(finalResult => {
        //         console.log(finalResult);

        //          //date of birth comes from the database as an ISO string. But the DatePicker needs it to be a UTC date object
        //          let birthDateJavascriptDateObject = new Date(finalResult.ClientProfile.Person.DOB);
        //          let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
        //          let utcBirthDate = new Date(formattedBirthDate); 
                 
        //          //for the age box
        //          //calculate age in years
        //          let difference = moment(new Date()).diff(birthDateJavascriptDateObject);
        //          //console.log(difference);
        //          let duration = moment.duration(difference, 'milliseconds');
        //          //console.log(duration);
        //          let diffInYears = Math.round(duration.asYears());
        //          //console.log(diffInYears);

        //          let raceObjectByClientRaceID = this.state.races.filter(function(race) {
        //             return race.ID === finalResult.ClientProfile.Person.RaceID
        //         });

        //         let genderObjectByClientGenderID = this.state.genders.filter(function(gender) {
        //             return gender.ID === finalResult.ClientProfile.Person.GenderID
        //         });

        //         //need to create variables for each- if it's null, set to empty string for controlled components
        //         let lastName = (finalResult.ClientProfile.Person.LastName !== null)  ? finalResult.ClientProfile.Person.LastName : '';
        //         let firstName = (finalResult.ClientProfile.Person.FirstName !== null)  ? finalResult.ClientProfile.Person.FirstName : '';
        //         let middleName = (finalResult.ClientProfile.Person.MiddleName !== null)  ? finalResult.ClientProfile.Person.MiddleName : '';
        //         let ssn = (finalResult.ClientProfile.Person.SSN != null)  ? finalResult.ClientProfile.Person.SSN : '';
        //         let fbiNcicNumber = (finalResult.ClientProfile.Person.FBINCIC !== null) ? finalResult.ClientProfile.Person.FBINCIC : '';
        //         let stateVcin = (finalResult.ClientProfile.Person.StateORVCIN !== null) ? finalResult.ClientProfile.Person.StateORVCIN : '';
        //         let alias = (finalResult.ClientProfile.Person.StateORVCIN !== null) ? finalResult.ClientProfile.Person.StateORVCIN : '';
        //         let raceID = (finalResult.ClientProfile.Person.RaceID !== null) ? finalResult.ClientProfile.Person.RaceID : 0;
        //         let raceDescription = (raceObjectByClientRaceID !== null) ? raceObjectByClientRaceID[0].Description : '';
        //         let genderID = (finalResult.ClientProfile.Person.GenderID !== null) ?  finalResult.ClientProfile.Person.GenderID : 0;
        //         let genderDescription = (genderObjectByClientGenderID !== null) ? genderObjectByClientGenderID[0].Description : '';

        //         this.setState({
        //             clientLastName: lastName,
        //             clientFirstName: firstName,
        //             clientMiddleName: middleName,
        //             clientSSN: ssn,
        //             clientFbiNcicNumber: fbiNcicNumber,
        //             clientDateOfBirth: utcBirthDate,
        //             clientCurrentAge: diffInYears.toString(),
        //             clientStateVCIN: stateVcin,
        //             clientAlias: alias,
        //             clientRaceID: raceID,
        //             clientRaceDescription: raceDescription,
        //             clientGenderID: genderID,
        //             clientGenderDescription: genderDescription,

        //             //state values for reset button
        //             originalLastName:  lastName,
        //             originalFirstName: firstName,
        //             originalMiddleName: middleName,
        //             originalSsn: ssn,
        //             originalFbiNcic: fbiNcicNumber,
        //             originalDateOfBirth: utcBirthDate,
        //             originalAge: diffInYears.toString(),
        //             originalStateVCIN: stateVcin,
        //             originalAlias: alias,
        //             originalRaceID: raceID,
        //             originalRaceDescription: raceDescription,
        //             originalGenderID: genderID,
        //             originalGenderDescription: genderDescription,
        //         });
                
        //     });
        // }
        // catch(error)
        // {
        //     console.log(error);
        //     alert('an error occurred while retrieving the Client Profile;');
        // }
    }

    return <div>
                <br></br>
                <h4>Search Client Profiles</h4>
                <p>Please search for an existing Client Profile, before creating a new one.</p>
                <div className="form-row">
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={handleLastNameChange} value={lastName}  placeholder="Enter Last Name"></input>
                    </div>
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={handleFirstNameChange} value={firstName} placeholder="Enter First Name"></input>
                    </div>
                    <div className="col-auto">
                        <button type="submit" onClick={SearchButtonClickHandler}  className="btn btn-primary mb-2">Search</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={ClearSearchFields} className="btn btn-primary mb-2">Clear Search</button>
                    </div>
                </div>
                <br/>
                {
                    isGridVisible === true ?
                    

                    <Grid className="card"
                        rows={rows }
                        columns={columns}>
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow />
                    </Grid> : <div></div>
                
                }
            </div>;
}

export default Search;