import React, { Component } from 'react';
import Search from './SearchClientProfile'
import ParticipantInfo from './ParticipantInfo'
import Nav from 'react-bootstrap/Nav'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';


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
            clientSuffix: 'Please Select'

        }

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

    TableComponent = ({ ...restProps }) => (
        <Table.Table
          {...restProps}
          className="table-hover"
        />
      );

    TableRow = ({ row, ...restProps }) => (
        <Table.Row
          {...restProps}
          onClick={() => this.GetSelectedRow(row) }/>
      );

    GetSelectedRow(row) {
        this.EnableTabs();
        
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");
        
        let clientProfileAddress = `${apiAddress}/api/ClientProfile/${row.ID}`;

        try
        {
           var promise = fetch(clientProfileAddress, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }               
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    return result.json();
                } 
    
            }).then(finalResult => {
                console.log(finalResult);
                this.setState({
                    clientLastName: finalResult.ClientProfile.Person.LastName,
                    clientFirstName: finalResult.ClientProfile.Person.FirstName,
                    clientMiddleName: finalResult.ClientProfile.Person.MiddleName,
                    clientSSN: finalResult.ClientProfile.Person.SSN,
                    clientFbiNcicNumber: finalResult.ClientProfile.Person.FBINCIC,
                    clientDateOfBirth: finalResult.ClientProfile.Person.DOB
                });
                
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while retrieving the Client Profile;');
        }
    }
      

    ClearSearchFields = () => {
        this.setState({
            firstName: '',
            lastName: ''
        });
    }

    HandleSearchFieldChange = (event, field) => {
        this.setState({
            isSearchButtonDisabled: false,            
        });

        if (field === "firstname") {
            this.setState({
                firstName: event.target.value
            });
        }

        if (field === "lastname") {
            this.setState({
                lastName: event.target.value
            });
        }
    }

    SearchButtonClickHandler = () => {
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");
        
        let fullSearchAddress = `${apiAddress}/api/ClientProfile/Search`;

        let postData = {
            lastName: this.state.lastName,
            firstName: this.state.firstName
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
                this.setState({
                    rows: finalResult,
                    isGridVisible: true
                });
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while searching;');
        }
    }

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
    }

    //parent change handler for all Suffix dropdowns.
    handleSuffixChange = (suffix) => {
        this.setState({
            clientSuffix: suffix
        });
    }
    
    handleDateOfBirthChange = (dateOfBirth) => {
        this.setState({
            clientDateOfBirth: dateOfBirth
        });
    }

    testState = () => {
        console.log(this.state.clientSuffix);
        console.log(this.state.clientDateOfBirth);
    }

    render() {
        return (
            <div>         
                <Tabs defaultActiveKey={this.state.defaultTab} activeKey={this.state.activeTab} onSelect={k => this.SetActiveTab(k) } id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                    <br></br>
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
                    
                    }
                    </Tab>
                    <Tab eventKey="participantinfo" title="Participant Info" disabled={this.state.isTabDisabled}>
                       <ParticipantInfo
                        lastName={this.state.clientLastName}
                        firstName={this.state.clientFirstName}
                        middleName={this.state.clientMiddleName}
                        ssn={this.state.clientSSN}
                        fbiNcicNumber={this.state.fbiNcicNumber}                        
                        ssn={this.state.clientSSN}
                        dateOfBirth={this.state.clientDateOfBirth }
                        infoTabSuffix={this.state.clientSuffix}
                        onSuffixChange={this.handleSuffixChange}
                        onDateOfBirthChange={this.handleDateOfBirthChange}
                        infoTabOnChangeHandler={this.infoTabOnChangeHandler} />
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