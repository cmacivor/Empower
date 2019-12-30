import React, { Component } from 'react';
// import {Tabs, Tab } from 'react-bootstrap-tabs'
import Search from './SearchClientProfile'
import Nav from 'react-bootstrap/Nav'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'


export default class CaseManagement extends Component { 

    constructor(props) {
        super(props);

        this.state = {
            isTabDisabled: true,
            isParticipantTabDisabled: true,
            defaultTab: "search"
        }
    }

    render() {
        return (
            <div>         
                <Tabs defaultActiveKey={this.state.defaultTab} id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                       <Search/>
                    </Tab>
                    <Tab eventKey="participantinfo" title="Participant Info" disabled={this.state.isTabDisabled}>
                       participant info content
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