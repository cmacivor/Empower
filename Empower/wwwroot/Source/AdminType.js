import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import ChildMessageRenderer from './ChildMessageRenderer'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css'
import { getCurrentUrl, getSessionData } from './commonAdmin';
require ('.//commonAdmin');


export default class AdminType extends Component {

    constructor(props) {
        super(props);

        this.state = {
            saveButtonDisabled: true,
            addButtonDisabled: false,
            isDeleteConfirmButtonVisible: false,
            isVisible: false,
            name: '',
            description: '',
            active: true,
            originallySelectedName: '',
            originallySelectedDescription: '',
            ID: '',
            CreatedBy: '',
            CreatedDate: '',
            ErrorMessage: '',
            ShowErrorMessage: false,
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
                width: 290,
                floatCell: true,
                headerClass: 'agGridHeader'
               
            },
            {
                headerName: "DeleteButton",
                field: "price",
                width: 100,
                cellRenderer: "childMessageRenderer"
            }],
            rowSelection: "single",
            context: { componentParent: this },
            frameworkComponents: {
                childMessageRenderer: ChildMessageRenderer
            }
      
        }
        
        this.loadGrid(); 

        this.hideForm = this.hideForm.bind(this);
       
    }    

    SaveNew = () => {

        let sessionStorageData = getSessionData();

        var postData = {
            Name: this.state.name,
            Description: this.state.description,
            Active: this.state.active,
            CreatedDate: new Date().toLocaleString(), 
            CreatedBy:  sessionStorageData.CurrentUser, 
            UpdatedDate: new Date().toLocaleString(),
            UpdatedBy: sessionStorageData.CurrentUser 
        };

        if (sessionStorageData.AdminType === "assessmenttype") {
            postData.SystemID = sessionStorageData.SystemID
        }
        

        try {

            //create the new record
            fetch(sessionStorageData.CreateApiUrl, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                },
                body: JSON.stringify(postData)
            }).then(response => {
                if (response.status === 400) {

                    let responseData = response.json();
                    
                    let errors = responseData.ModelState["entity.Name"];
    
                    errors.forEach(error => {
                        this.state.ErrorMessage += error;
                        
                        this.setState({
                            isVisible: true
                        });                   
                    });
                }
    
                 this.loadGrid();
    
                if (this.state.ErrorMessage === '') {
                    this.resetState();
                }
            });

        } catch (error) {
            console.log(error);
            alert('an error occurred while saving the data.');
        }
    }

    resetState = () => {
        this.setState({ 
            isVisible: false,
            name: '',
            description: '',
            ID: '',
            CreatedBy: '',
            CreatedDate: '',
            isDeleteConfirmButtonVisible: false,
            active: true
         });
    }

    DeleteSelectedRow = () => {

        let selectedRowId = this.state.ID;

        let sessionStorageData = getSessionData();

        let fullDeleteUrl = `${sessionStorageData.DeleteApiUrl}/${selectedRowId}`; 

        try {
               fetch(fullDeleteUrl, {
                    mode: 'cors',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorageData.Token
                    }
                }).then(result => {
                    this.loadGrid();

                    this.resetState();
                });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while deleting the data.');
        }
    }

    UpdateSelectedRow = () => {

        let sessionStorageData = getSessionData();

        var postData = {
            ID: this.state.ID,
            Name: this.state.name,
            Description: this.state.description,
            Active: this.state.active, 
            CreatedDate: this.state.CreatedDate,
            CreatedBy: this.state.CreatedBy,
            UpdatedDate: new Date().toLocaleString(),
            UpdatedBy: sessionStorageData.CurrentUser 
        };

        if (sessionStorageData.AdminType  === "assessmenttype") {
            postData.SystemID = sessionStorageData.SystemID  
        }

        try {

            fetch(sessionStorageData.UpdateApiUrl, {
                method: 'put',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                },
                body: JSON.stringify(postData)
            }).then(response => {
                this.loadGrid();

                this.resetState();
            });

        } catch (error) {
            console.log(error);
            alert('an error occurred while saving the data.');
        }  
    }


    SaveClickEventHandler = async () => {
        if (this.state && !this.state.ID) {
            this.SaveNew();
                         
        } else {
            this.UpdateSelectedRow();
            this.state.ID = '';
            this.state.CreatedBy = '';
            this.state.CreatedDate = '';
        }      
    }

    ResetClickEventHandler = async() => {
        
        await this.loadGrid();

        this.setState({
            name: this.state.originallySelectedName,
            description: this.state.originallySelectedDescription
        });
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

        if (this.state.name !== '' && this.state.description !== '') {
            this.setState({
                ErrorMessage: ''
            });
        }
    }

    showForm = () => {
        this.setState({ isVisible: true });
    }

    AddButtonClickHandler = () => {
        this.showForm();
        this.setState({ 
            name: '',
            description: '',
            ID: '',
            CreatedBy: '',
            CreatedDate: '',
            isDeleteConfirmButtonVisible: false
         });
    }

    hideForm() {
        this.setState({ 
            isVisible: false,
            name: '',
            description: '',
            ID: '',
            CreatedBy: '',
            CreatedDate: '',
            isDeleteConfirmButtonVisible: false,
            active: true
         });
    }

    onRowSelected = (event) => {

        let selected =  this.refs.agGrid.api.getSelectedRows()[0];

        this.setState({
            name: selected.Name,
            description: selected.Description,
            originallySelectedName: selected.Name,
            originallySelectedDescription: selected.Description,
            ID: selected.ID,
            CreatedBy: selected.CreatedBy,
            CreatedDate: selected.CreatedDate,
            addButtonDisabled: true
        });

        this.showForm();
    }

    loadGrid = async() => {
        //get the route, use it to call the correct api
        // let apiAddress = sessionStorage.getItem("baseApiAddress");

        // let token = sessionStorage.getItem("token");

        // let adminType = getCurrentUrl();

        // let fullAddress = `${apiAddress}/api/${adminType}/GetAll`;

        let sessionStorageData = getSessionData();

        fetch(sessionStorageData.GetAllApiUrl, {
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
            .then(rowData => this.setState({ rowData }));
    }

    setActive = event => {

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

    methodFromParent(cell) {

        let selected = this.refs.agGrid.api.getSelectedRows()[0];

        this.setState({
            name: selected.Name,
            description: selected.Description,
            ID: selected.ID,
            CreatedBy: selected.CreatedBy,
            CreatedDate: selected.CreatedDate,
            addButtonDisabled: true,
            isDeleteConfirmButtonVisible: true,           
        });

        this.showForm();

      }


    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-6">
                        <input id="btnAdd" style={{cursor: 'pointer' }} onClick={this.AddButtonClickHandler} className="btn btn-primary" defaultValue="Add" />
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-6 ag-theme-bootstrap" style={{ width: '400px' }}>
                        <AgGridReact
                            ref="agGrid"
                            domLayout="autoHeight"
                            rowSelection={this.state.rowSelection}
                            onRowSelected={this.onRowSelected}
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            context={this.state.context}
                            frameworkComponents={this.state.frameworkComponents}
                            onGridReady={this.onGridReady}>
                        </AgGridReact>
                    </div>
                    { 
                    this.state.isVisible === true ?
                        <div className="col-6">
                        {this.state.ErrorMessage !== '' ? <div className="alert alert-danger" role="alert">{this.state.ErrorMessage}</div> : <div></div> }
                            <form>
                                    <input type="hidden" id="txtID" name="ID" value={this.state.ID} />
                                    <input type="hidden" id="txtCreatedBy" name="CreatedBy" value={this.state.CreatedBy} />
                                    <input type="hidden" id="txtCreatedDate" name="CreatedDate" value={this.props.CreatedDate} />
                                    <div className="form-group">
                                        <input type="text" className="form-control" onChange={e => this.handleChange(e, "name") } value={this.state.name}  name="name" id="txtName" placeholder="Name"/>
                                    </div>
                                    <div className="form-group">
                                        <textarea name="description" onChange={e => this.handleChange(e, "description")} className="form-control" id="txtDescription" value={this.state.description} placeholder="Description"></textarea>
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
                                {this.state.isDeleteConfirmButtonVisible ? <button onClick={this.DeleteSelectedRow} className="btn btn-danger mr-2">Confirm</button> : 
                                <button type="button" onClick={this.SaveClickEventHandler } disabled={this.state.saveButtonDisabled} className="btn btn-primary mr-2">Save</button>}
                                <button type="button" onClick={this.ResetClickEventHandler} className="btn btn-primary mr-2" value="Reset">Reset</button>
                                <button type="button" onClick={this.hideForm } className="btn btn-primary" value="Cancel">Cancel</button>       
                        </div> 
                    : <div></div> 
                    }
                </div>
            </div>
        );
    }

}