import React, { useState } from 'react';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import moment from 'moment';
import { Api } from './commonAdmin';

const Search = () => {
    const [isTabDisabled, setTabs] = useState(true);

    return <div>
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
                        </div>
                    </div>
                    <br/>
                    {
                        // this.state.isGridVisible === true ?
                        
                        // <Grid className="card"
                        //     rows={this.state.rows }
                        //     columns={this.state.columns}>
                        //     <Table tableComponent={this.TableComponent} rowComponent={this.TableRow}  />
                        //     <TableHeaderRow />
                        // </Grid> : <div></div>
                    
                    }
                    </Tab>
                    <Tab eventKey="participantinfo" title="Participant Info" disabled={this.state.isTabDisabled}>
               
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
            </div>;
}

export default Search;