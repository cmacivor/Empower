import React, { Component } from 'react';
import {Tabs, Tab } from 'react-bootstrap-tabs'


export default class CaseManagement extends Component { 

    render() {
        return (
            <Tabs onSelect={(index, label) => console.log(label + ' selected')}>
                <Tab label="Tab1">Tab 1 content</Tab>
                <Tab label="Tab2">Tab 2 content</Tab>
            </Tabs>
        );
    }
}