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
            isParticipantTabDisabled: true
        }
    }

    render() {
        return (
            <div>
                {/* <Nav variant="tabs" defaultActiveKey="/search">
                    <Nav.Item>
                        <Nav.Link href="/search">Search</Nav.Link>
                        
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/participantinfo">Participant Info</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/supplemental" >Supplemental</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/address" >Address</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/familyinfo" >familyinfo</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/program" >program</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/assessment" >Assessment</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="disabled" disabled>
                        Disabled
                        </Nav.Link>
                    </Nav.Item>
                </Nav> */}
         
                <Tabs defaultActiveKey="familyinfo" id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                       <Search/>
                    </Tab>
                    <Tab eventKey="participantinfo" title="Participant Info">
                       participant info content
                    </Tab>
                    <Tab eventKey="supplemental" title="Supplemental">
                       supplemental content
                    </Tab>
                    <Tab eventKey="address" title="Address">
                       address content
                    </Tab>
                    <Tab eventKey="familyinfo" title="Family Info">
                       Family info content
                    </Tab>
                    <Tab eventKey="program" title="Program">
                       program content
                    </Tab>
                    <Tab eventKey="assessment" title="Assessment">
                       assessment content
                    </Tab>
                    <Tab eventKey="contact" title="Contact" disabled>
                        contact content
                    </Tab>
                </Tabs>
            </div>

            // <br></br>
            // <br></br>
            // <Tabs style={{cursor: 'pointer' }} onSelect={(index, label) => console.log(label + ' selected')}>
            //     <Tab label="Search"><Search/></Tab>
            //     <Tab disabled={ this.state.isParticipantTabDisabled } label="Participant Info">Participant info content</Tab>
            //     <Tab disabled={ this.state.isTabDisabled } label="Supplemental">Supplemental content</Tab>
            //     <Tab disabled={ this.state.isTabDisabled } label="Address">Address content</Tab>
            //     <Tab disabled={ this.state.isTabDisabled } label="Family Info">Family Info</Tab>
            //     <Tab disabled={ this.state.isTabDisabled } label="Program">Program</Tab>
            //     <Tab disabled={ this.state.isTabDisabled } label="Assessment">Assessment</Tab>
            // </Tabs>
        );
    }
}