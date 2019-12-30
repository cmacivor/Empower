import React, { Component } from 'react';
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
            defaultTab: "search",
            activeTab: "search"
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

    render() {
        return (
            <div>         
                <Tabs defaultActiveKey={this.state.defaultTab} activeKey={this.state.activeTab} onSelect={k => this.SetActiveTab(k) } id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                       <Search EnableTabs={this.EnableTabs} />
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