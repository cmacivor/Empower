﻿import React, { Component } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css'

export default class AdminType extends Component {

    constructor(props) {
        super(props);

        this.state = {
            saveButtonDisabled: true,
            addButtonDisabled: false,
            isVisible: false,
            name: '',
            description: '',
            active: true,
            ID: '',
            CreatedBy: '',
            CreatedDate: '',
          columnDefs: [
            {
                headerName: "ID", field: "ID", hide: true
            },
            {
                headerName: "CreatedBy", field: "CreatedBy", hide: true
            },
            {
                headerName: "CreatedDate", field: "CreatedDate", hide: true
            },
            {
                headerName: "Name",
                field: "Name",                    
                sortable: true,
                width: 150,
                floatCell: true,
                headerClass: 'agGridHeader'
             
            },
            {
                headerName: "Description",
                field: "Description",                   
                sortable: true,
                width: 200,
                floatCell: true,
                headerClass: 'agGridHeader'
               
            },
            {
                headerName: "DeleteButton",
                field: "price",
                width: 50
            }],
            rowSelection: "single"
      
        }
        
        this.loadGrid(); 

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
    }

    SaveNew = async() => {

        console.log(this.state.active);

        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");

        let currentUser = sessionStorage.getItem("userName");

        let fullAddress = apiAddress + '/api/AddressType/Create';

        var postData = {
            Name: this.state.name,
            Description: this.state.description,
            Active: this.state.active,
            CreatedDate: new Date().toLocaleString(), //this.state.CreatedDate,
            CreatedBy:  currentUser, //this.state.CreatedBy,
            UpdatedDate: new Date().toLocaleString(),
            UpdatedBy: currentUser
        };

        try {

            //create the new record
            const response = await fetch(fullAddress, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(postData)
            });


            //second call to get updated rows
            const refreshResponse = await fetch(apiAddress + '/api/AddressType/GetAll', {
                //method: 'put',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            let refreshedData = await refreshResponse.json();

            this.setState({ rowData: refreshedData, name: '', description: '' });

        } catch (error) {
            //alert(error);
            console.log(error);
            alert('an error occurred while saving the data.');
        }

    }

    UpdateSelectedRow = async () => {

        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");

        let currentUser = sessionStorage.getItem("userName");

        let fullAddress = apiAddress + '/api/AddressType/Update';

        var postData = {
            ID: this.state.ID,
            Name: this.state.name,
            Description: this.state.description,
            Active: this.state.active, 
            CreatedDate: this.state.CreatedDate,
            CreatedBy: this.state.CreatedBy,
            UpdatedDate: new Date().toLocaleString(),
            UpdatedBy: currentUser
        };

        try {

            const response = await fetch(fullAddress, {
                method: 'put',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(postData)
            });


            //second call
            const refreshResponse = await fetch(apiAddress + '/api/AddressType/GetAll', {
                //method: 'put',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            let refreshedData = await refreshResponse.json();

            this.setState({ rowData: refreshedData, name: '', description: '' });

        } catch (error) {
            //alert(error);
            console.log(error);
            alert('an error occurred while saving the data.');
        }  
    }


    SaveClickEventHandler = async () => {
        if (this.state && !this.state.ID) {
            //console.log('its null')
            this.SaveNew();
                         
        } else {
            this.UpdateSelectedRow();
            this.state.ID = '';
            this.state.CreatedBy = '';
            this.state.CreatedDate = '';
        }      
    }

    handleChange = (e, field) => {

        if (this.state.saveButtonDisabled === true) {
            this.setState({ saveButtonDisabled: false });
        }


        if (field === "name") {
            this.setState({
                name: e.target.value
            });
        }

        if (field === "description") {
            this.setState({
                description: e.target.value
            });
        }
    }

    showForm() {
        this.setState({ isVisible: true });
    }

    hideForm() {
        this.setState({ isVisible: false });
    }

    onRowSelected(event) {

        let selected = this.refs.agGrid.api.getSelectedRows()[0];

        this.setState({
            name: selected.Name,
            description: selected.Description,
            ID: selected.ID,
            CreatedBy: selected.CreatedBy,
            CreatedDate: selected.CreatedDate,
            addButtonDisabled: true
        });

        this.showForm();
    }

    loadGrid() {
        //get the route, use it to call the correct api
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");

        let fullAddress = apiAddress + '/api/AddressType/GetAll';

        fetch(fullAddress, {
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(result => result.json())
            .then(rowData => this.setState({ rowData }));
    }

    setActive = event => {
        //console.log(event.target.value);

        //const {name, value } = event.target;

        if (event.target.value === "yes") {
            this.setState({ 
                active: true
            });
        }

        if (event.target.value == "no") {
            this.setState({ 
                active: false
            });
        }       
    }


    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-6">
                        <input id="btnAdd" style={{cursor: 'pointer' }} onClick={this.showForm} className="btn btn-primary" defaultValue="Add" />
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-6 ag-theme-bootstrap" style={{ height: '180px', width: '400px' }}>
                        <AgGridReact
                            ref="agGrid"
                            rowSelection={this.state.rowSelection}
                            onRowSelected={this.onRowSelected.bind(this)}
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            onGridReady={this.onGridReady}>
                        </AgGridReact>
                    </div>
                    { 
                    this.state.isVisible &&
                    <div className="col-6">
                           <form>
                                <input type="hidden" id="txtID" name="ID" value={this.state.ID} />
                                <input type="hidden" id="txtCreatedBy" name="CreatedBy" value={this.state.CreatedBy} />
                                <input type="hidden" id="txtCreatedDate" name="CreatedDate" value={this.props.CreatedDate} />
                                <div className="form-group">
                                    <input type="text" className="form-control" onChange={e => this.handleChange(e, "name") } value={this.state.name}  name="name" id="txtName" placeholder="Name"/>
                                </div>
                                <div className="form-group">
                                    <input type="textarea" name="description" onChange={e => this.handleChange(e, "description")} className="form-control" id="txtDescription" value={this.state.description} placeholder="Description" />
                                </div>
                                <div onChange={this.setActive }>
                                    <div className="form-check-inline">
                                        <div className="form-group">
                                            <input id="rdYes" type="radio" style={{cursor: 'pointer' }} defaultChecked value="yes" name="active"/>{' '}
                                            Yes
                                        </div>                          
                                    </div>
                                    <div className="form-check-inline">
                                        <div className="form-group">
                                            <input id="rdNo" type="radio" style={{cursor: 'pointer' }} value="no" name="active"/>{' '}
                                            No
                                        </div>                          
                                    </div>
                                </div>        
                            </form>
                            <button type="button" onClick={this.SaveClickEventHandler } disabled={this.state.saveButtonDisabled} className="btn btn-primary mr-2">Save</button>
                            <button type="button" onClick={this.hideForm } className="btn btn-primary" value="Cancel">Cancel</button>       
                    </div>  
                    }
                </div>
            </div>
        );
    }

}