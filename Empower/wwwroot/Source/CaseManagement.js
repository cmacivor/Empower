import React, { Component } from 'react';
import Search from './Search'
import ParticipantInfo from './ParticipantInfo'
import Nav from 'react-bootstrap/Nav'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import moment from 'moment';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import { Api } from './commonAdmin';


export default class CaseManagement extends Component { 

    constructor(props) {
        super(props);

        this.state = {
            //Tab State
            isTabDisabled: true,
            isParticipantTabDisabled: true,
            defaultTab: "search",
            activeTab: "search",

            //Search Tab State
            isSearchButtonDisabled: true,
            firstName: '',
            lastName: '',
            columns: [
                { name: 'FirstName', title: 'First Name' },
                { name: 'LastName', title: 'Last Name' },
                { name: 'MiddleName', title: 'Middle Name' },
                { name: 'StateORVCIN', title: 'State/VCIN #' },
                { name: 'SSN', title: 'SSN' },
                { name: 'FormattedBirthDate', title: 'Birth Date' }, 
                { name: 'Gender', title: 'Gender' },        
              ],
            rows: [],
            isGridVisible: false,

            //Participant Info (CWB) / Adult Info (Adult) / Juvenile Info (Juvenile)
            clientLastName: '',
            clientFirstName: '',
            clientMiddleName: '',
            clientSSN: '',
            clientFbiNcicNumber: '',
            clientDateOfBirth: new Date(),
            clientCurrentAge: '',
            clientSuffix: 'Please Select',
            clientStateVCIN: '',
            clientAlias: '',
            clientRaceID: 0,
            races:  [],
            clientRaceDescription: 'Please Select',
            clientGenderID: 0,
            genders: [],
            clientGenderDescription: 'Please Select',

             //have to handle reset button- store original state in separate set of variables
             originalLastName: '',
             originalFirstName: '',
             originalMiddleName: '',
             originalSuffix: '',
             originalSsn: '',
             originalFbiNcic: '',
             originalAge: 0,
             originalDateOfBirth: new Date(),
             originalStateVCIN: '',
             originalAlias: '',
             originalRaceID: 0,
             originalRaceDescription: '',
             originalGenderID: 0,
             originalGenderDescription: ''
        }

        Api.getConfigDataByType("Race").then(races => this.setState({races}));
        Api.getConfigDataByType("Gender").then(genders => this.setState({genders}));

        this.EnableTabs = this.EnableTabs.bind(this);
        this.SetActiveTab = this.SetActiveTab.bind(this);
    }

    EnableTabs() {
        this.setState({
            isTabDisabled: false,
            defaultTab: "participantinfo",
            activeTab: "participantinfo"
        });
    }

    SetActiveTab(key) {
        this.setState({
            activeTab: key
        });
    }

    // TableComponent = ({ ...restProps }) => (
    //     <Table.Table
    //       {...restProps}
    //       className="table-hover"
    //     />
    //   );

    // TableRow = ({ row, ...restProps }) => (
    //     <Table.Row
    //       {...restProps}
    //       onClick={() => this.GetSelectedRow(row) }/>
    //   );

    // GetSelectedRow(row) {
    //     this.EnableTabs();
        
    //     let apiAddress = sessionStorage.getItem("baseApiAddress");

    //     let token = sessionStorage.getItem("token");
        
    //     let clientProfileAddress = `${apiAddress}/api/ClientProfile/${row.ID}`;

    //     try
    //     {
    //        var promise = fetch(clientProfileAddress, {
    //             method: 'get',
    //             mode: 'cors',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + token
    //             }               
    //         }); 

    //         promise.then(result =>  {
    //             if (result.status === 200) {
    //                 return result.json();
                
    //             } else {
    //                 return result.json();
    //             } 
    
    //         }).then(finalResult => {
    //             console.log(finalResult);

    //              //date of birth comes from the database as an ISO string. But the DatePicker needs it to be a UTC date object
    //              let birthDateJavascriptDateObject = new Date(finalResult.ClientProfile.Person.DOB);
    //              let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
    //              let utcBirthDate = new Date(formattedBirthDate); 
                 
    //              //for the age box
    //              //calculate age in years
    //              let difference = moment(new Date()).diff(birthDateJavascriptDateObject);
    //              //console.log(difference);
    //              let duration = moment.duration(difference, 'milliseconds');
    //              //console.log(duration);
    //              let diffInYears = Math.round(duration.asYears());
    //              //console.log(diffInYears);

    //              let raceObjectByClientRaceID = this.state.races.filter(function(race) {
    //                 return race.ID === finalResult.ClientProfile.Person.RaceID
    //             });

    //             let genderObjectByClientGenderID = this.state.genders.filter(function(gender) {
    //                 return gender.ID === finalResult.ClientProfile.Person.GenderID
    //             });

    //             //need to create variables for each- if it's null, set to empty string for controlled components
    //             let lastName = (finalResult.ClientProfile.Person.LastName !== null)  ? finalResult.ClientProfile.Person.LastName : '';
    //             let firstName = (finalResult.ClientProfile.Person.FirstName !== null)  ? finalResult.ClientProfile.Person.FirstName : '';
    //             let middleName = (finalResult.ClientProfile.Person.MiddleName !== null)  ? finalResult.ClientProfile.Person.MiddleName : '';
    //             let ssn = (finalResult.ClientProfile.Person.SSN != null)  ? finalResult.ClientProfile.Person.SSN : '';
    //             let fbiNcicNumber = (finalResult.ClientProfile.Person.FBINCIC !== null) ? finalResult.ClientProfile.Person.FBINCIC : '';
    //             let stateVcin = (finalResult.ClientProfile.Person.StateORVCIN !== null) ? finalResult.ClientProfile.Person.StateORVCIN : '';
    //             let alias = (finalResult.ClientProfile.Person.StateORVCIN !== null) ? finalResult.ClientProfile.Person.StateORVCIN : '';
    //             let raceID = (finalResult.ClientProfile.Person.RaceID !== null) ? finalResult.ClientProfile.Person.RaceID : 0;
    //             let raceDescription = (raceObjectByClientRaceID !== null) ? raceObjectByClientRaceID[0].Description : '';
    //             let genderID = (finalResult.ClientProfile.Person.GenderID !== null) ?  finalResult.ClientProfile.Person.GenderID : 0;
    //             let genderDescription = (genderObjectByClientGenderID !== null) ? genderObjectByClientGenderID[0].Description : '';

    //             this.setState({
    //                 clientLastName: lastName,
    //                 clientFirstName: firstName,
    //                 clientMiddleName: middleName,
    //                 clientSSN: ssn,
    //                 clientFbiNcicNumber: fbiNcicNumber,
    //                 clientDateOfBirth: utcBirthDate,
    //                 clientCurrentAge: diffInYears.toString(),
    //                 clientStateVCIN: stateVcin,
    //                 clientAlias: alias,
    //                 clientRaceID: raceID,
    //                 clientRaceDescription: raceDescription,
    //                 clientGenderID: genderID,
    //                 clientGenderDescription: genderDescription,

    //                 //state values for reset button
    //                 originalLastName:  lastName,
    //                 originalFirstName: firstName,
    //                 originalMiddleName: middleName,
    //                 originalSsn: ssn,
    //                 originalFbiNcic: fbiNcicNumber,
    //                 originalDateOfBirth: utcBirthDate,
    //                 originalAge: diffInYears.toString(),
    //                 originalStateVCIN: stateVcin,
    //                 originalAlias: alias,
    //                 originalRaceID: raceID,
    //                 originalRaceDescription: raceDescription,
    //                 originalGenderID: genderID,
    //                 originalGenderDescription: genderDescription,
    //             });
                
    //         });
    //     }
    //     catch(error)
    //     {
    //         console.log(error);
    //         alert('an error occurred while retrieving the Client Profile;');
    //     }
    // }
      

    // ClearSearchFields = () => {
    //     this.setState({
    //         firstName: '',
    //         lastName: ''
    //     });
    // }

    // HandleSearchFieldChange = (event, field) => {
    //     this.setState({
    //         isSearchButtonDisabled: false,            
    //     });

    //     if (field === "firstname") {
    //         this.setState({
    //             firstName: event.target.value
    //         });
    //     }

    //     if (field === "lastname") {
    //         this.setState({
    //             lastName: event.target.value
    //         });
    //     }
    // }

    // SearchButtonClickHandler = () => {
    //     let apiAddress = sessionStorage.getItem("baseApiAddress");

    //     let token = sessionStorage.getItem("token");
        
    //     let fullSearchAddress = `${apiAddress}/api/ClientProfile/Search`;

    //     let postData = {
    //         lastName: this.state.lastName,
    //         firstName: this.state.firstName
    //     }

    //     try
    //     {
    //        var promise = fetch(fullSearchAddress, {
    //             method: 'post',
    //             mode: 'cors',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + token
    //             },
    //             body: JSON.stringify(postData)
    //         }); 

    //         promise.then(result =>  {
    //             if (result.status === 200) {
    //                 return result.json();
                
    //             } else {
    //                 return result.json();
    //             } 
    
    //         }).then(finalResult => {
    //             this.setState({
    //                 rows: finalResult,
    //                 isGridVisible: true
    //             });
    //         });
    //     }
    //     catch(error)
    //     {
    //         console.log(error);
    //         alert('an error occurred while searching;');
    //     }
    // }

    infoTabOnChangeHandler = (e, field) => {

        if (field === "txtLastName") {
            this.setState({
                clientLastName:  e.target.value
            });
        }

        if (field === "txtFirstName") {
            this.setState({
                clientFirstName:  e.target.value
            });
        }

        if (field === "txtMiddleName") {
            this.setState({
                clientMiddleName:  e.target.value
            });
        }

        if (field === "txtSSN") {
            this.setState({
                clientSSN:  e.target.value
            });
        }

        if (field === "txtFbiNcicNumber") {
            this.setState({
                clientFbiNcicNumber:  e.target.value
            });
        }

        if (field === "txtStateVCIN") {
            this.setState({
                clientStateVCIN:  e.target.value
            });
        }

        if (field === "txtAlias") {
            this.setState({
                clientAlias:  e.target.value
            });
        }
    }

    //parent change handler for Suffix dropdown in Info Tab.
    handleSuffixChange = (suffix) => {
        this.setState({
            clientSuffix: suffix
        });
    }

    handleRaceChange = (race) => {
        console.log('this is the handleRaceChange in CaseManagement: ' + race);
        this.setState({
            clientRaceID: race
        });
    }

    handleRaceDescriptionChange = (raceDescription) => {
        console.log('this is the handleRaceDescriptionChange in CaseManagememtn: ' + raceDescription);

        this.setState({
            clientRaceDescription: raceDescription
        })
    }

    handleGenderChange = (gender) => {
        this.setState({
            clientGenderID: gender
        });
    }

    handleGenderDescriptionChange = (genderDescription) => {
        this.setState({
            clientGenderDescription: genderDescription
        });
    }
    
    handleDateOfBirthChange = (dateOfBirth) => {
        console.log('handleDateOfBirthChange in CaseManagement: ' + dateOfBirth);

        this.setState({
            clientDateOfBirth: dateOfBirth
        });
    }

    handlePartipantInfoResetClick = () => {
        console.log('this is handlePartipantInfoResetClick in case management');

        console.log('original state: ' + this.state.originalGenderID);
        console.log('original state description: ' + this.state.originalRaceDescription);


        console.log('the state: ' + this.state.clientLastName);

        this.setState({
            clientLastName: this.state.originalLastName,
            clientFirstName: this.state.originalFirstName,
            clientMiddleName: this.state.originalMiddleName,
            clientSuffix: this.state.originalSuffix,
            clientSSN: this.state.originalSsn,
            clientStateVCIN: this.state.originalStateVCIN,
            clientFbiNcicNumber: this.state.originalFbiNcic,
            clientDateOfBirth: this.state.originalDateOfBirth,
            clientAlias: this.state.originalAlias,
            clientRaceID: this.state.originalRaceID,
            clientRaceDescription: this.state.originalRaceDescription,

            clientGenderID: this.state.originalGenderID,
            clientGenderDescription: this.state.originalGenderDescription
        });
    }

    // testState = () => {
    //     console.log(this.state.clientSuffix);
    //     console.log(this.state.clientDateOfBirth);
    //     console.log(this.state.clientRaceID);
    // }

    render() {
        return (
            <div>         
                <Tabs defaultActiveKey={this.state.defaultTab} activeKey={this.state.activeTab} onSelect={k => this.SetActiveTab(k) } id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                    <Search enableTabsHandler={this.EnableTabs} ></Search>
                    {/* <br></br>
                    <h4>Search Client Profiles</h4>
                    <p>Please search for an existing Client Profile, before creating a new one.</p>
                    <div className="form-row">
                        <div className="col-3">
                            <input type="text" className="form-control" onChange={e => this.HandleSearchFieldChange(e, "lastname")} value={this.state.lastName}  placeholder="Enter Last Name"></input>
                        </div>
                        <div className="col-3">
                            <input type="text" className="form-control" onChange={e => this.HandleSearchFieldChange(e, "firstname")} value={this.state.firstName} placeholder="Enter First Name"></input>
                        </div>
                        <div className="col-auto">
                            <button type="submit" onClick={this.SearchButtonClickHandler}  disabled={this.state.isSearchButtonDisabled} className="btn btn-primary mb-2">Search</button>
                        </div>
                        <div className="col-auto">
                            <button type="button" onClick={this.ClearSearchFields} className="btn btn-primary mb-2">Clear Search</button>
                            <button type="button" onClick={this.testState}>Test state</button>
                        </div>
                    </div>
                    <br/>
                    {
                        this.state.isGridVisible === true ?
                        
                        <Grid className="card"
                            rows={this.state.rows }
                            columns={this.state.columns}>
                            <Table tableComponent={this.TableComponent} rowComponent={this.TableRow}  />
                            <TableHeaderRow />
                        </Grid> : <div></div>
                    
                    } */}
                    </Tab>
                    <Tab eventKey="participantinfo" title="Participant Info" disabled={this.state.isTabDisabled}>
                       <ParticipantInfo
                        lastName={this.state.clientLastName}
                        firstName={this.state.clientFirstName}
                        middleName={this.state.clientMiddleName}
                        ssn={this.state.clientSSN}
                        fbiNcicNumber={this.state.fbiNcicNumber}                        
                        ssn={this.state.clientSSN}
                        fbiNcicNumber={this.state.clientFbiNcicNumber}
                        dateOfBirth={this.state.clientDateOfBirth }
                        currentAge={this.state.clientCurrentAge}
                        stateVCIN={this.state.clientStateVCIN}
                        alias={this.state.clientAlias}
                        infoTabSuffix={this.state.clientSuffix}
                        infoTabRace={this.state.clientRaceID}
                        raceDescription={this.state.clientRaceDescription }
                        genderDescription={this.state.clientGenderDescription}
                        onSuffixChange={this.handleSuffixChange}
                        onRaceChange={this.handleRaceChange}
                        onRaceDescriptionChange={this.handleRaceDescriptionChange}
                        onGenderChange={this.handleGenderChange}
                        onGenderDescriptionChange={this.handleGenderDescriptionChange}
                        onDateOfBirthChange={this.handleDateOfBirthChange}
                        infoTabOnChangeHandler={this.infoTabOnChangeHandler}
                        participantInfoResetClick={this.handlePartipantInfoResetClick}/>
                    </Tab>
                    <Tab eventKey="supplemental" title="Supplemental" disabled={this.state.isTabDisabled}>
                       supplemental content
                    </Tab>
                    <Tab eventKey="address" title="Address" disabled={this.state.isTabDisabled}>
                       address content
                    </Tab>
                    <Tab eventKey="familyinfo" title="Family Info" disabled={this.state.isTabDisabled}>
                       Family info content
                    </Tab>
                    <Tab eventKey="program" title="Program" disabled={this.state.isTabDisabled}>
                       program content
                    </Tab>
                    <Tab eventKey="assessment" title="Assessment" disabled={this.state.isTabDisabled}>
                       assessment content
                    </Tab>
                    <Tab eventKey="contact" title="Contact" disabled={this.state.isTabDisabled}>
                        contact content
                    </Tab>
                </Tabs>
            </div>    
        );
    }
}