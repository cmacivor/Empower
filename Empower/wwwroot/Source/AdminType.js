import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import ChildMessageRenderer from './ChildMessageRenderer'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css'


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

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
    }


    Validate = async() => {

        if (this.state.name === '' || this.state.description === '') {
            this.setState({
                ErrorMessage: "Both fields must contain a value."
            });
        }       

        if (this.state.name.length > 20) {
            this.setState({
                ErrorMessage: "the Name field must be 20 characters or less."
            });
        }
        if (this.state.description.length > 100) {
            this.setState({
                ErrorMessage: "the Description field must 100 characters or less."
            });
        }
    }

    

    SaveNew = async() => {

        // await this.Validate();

        // if (this.state.ErrorMessage !== '') {
        //     this.showForm();
        //     return;
        // }

        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");

        let currentUser = sessionStorage.getItem("userName");

        let fullAddress = apiAddress + '/api/AddressType/Create';

        var postData = {
            Name: this.state.name,
            Description: this.state.description,
            Active: this.state.active,
            CreatedDate: new Date().toLocaleString(), 
            CreatedBy:  currentUser, 
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

            if (response.status === 400) {

                var responseData = await response.json();
                
                console.log(responseData);

                //this works
                console.log(responseData.Message);

                //this works
                console.log(responseData.ModelState);

                //it's a Javascript object
                console.dir(responseData.ModelState);

                //the property we need is called "entity.name"
                console.log(Object.keys(responseData.ModelState));

                //Need to get errors this way. This produces an array.
                console.log(responseData.ModelState["entity.Name"]);


                //this doesn't work, throws TypeError cannot read property Name of undefined
                //console.log(responseData.ModelState.entity.Name[0]);


                //doesn't work. undefined.
                //console.log(responseData.ModelState.entity);
                

                //this doesn't work - undefined
                //console.log(responseData.ModelState.Name);

                //this doesn't work. undefined
                //console.log(responseData.ModelState[0]);


                //this doesn't work. anything after ModelState doesn't work.
                //console.log(responseData.ModelState.Name);

                //console.log(responseData.ModelState.entity);
                
                //console.log(errors);
                // responseData.ModelState.forEach(item => {
                //     console.log(item);
                // });

            }

            //let errors = await response.ModelState;

            //console.log(errors);
            //console.log(response.ModelState);

            // .then(result =>
            //     {
            //         //console.log(result);
            //         if (result.status === 400) {
            //             //console.log(result.status);

            //             //console.log(result.json());
            //             console.log(result);

            //             let modelErrors = result.json();
            //             console.log(modelErrors);
            //         }

            //     });
           
            await this.loadGrid();

            this.resetState();

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
            isDeleteConfirmButtonVisible: false
         });
    }

    DeleteSelectedRow = async() => {

        let selectedRowId = this.state.ID;

        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");

        let currentUser = sessionStorage.getItem("userName");

        let fullAddress = apiAddress + `/api/AddressType/Delete/${selectedRowId}`;
        
        try {
               const response =  await fetch(fullAddress, {
                    mode: 'cors',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                await this.loadGrid();

                this.resetState();

        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while deleting the data.');
        }
    }

    UpdateSelectedRow = async () => {

        // await this.Validate();

        // if (this.state.ErrorMessage !== '') {
        //     this.showForm();
        //     return;
        // }

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

            await this.loadGrid();

            this.resetState();

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

    showForm() {
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
                    this.state.isVisible &&
                    <div className="col-6">
                       {/* {this.state.ErrorMessage !== '' ? <div className="alert alert-danger" role="alert">{this.state.ErrorMessage}</div> : <div></div> } */}
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
                    }
                </div>
            </div>
        );
    }

}