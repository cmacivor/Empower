import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import ChildMessageRenderer from './ChildMessageRenderer'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css'
import { getSessionData, Api } from './commonAdmin';
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
            isUploadServiceProfile: false,
            selectedFile: null,
            fileName: '',
            columnDefs: [
            {
                headerName: "ID", field: "ID", hide: true
            },
            {
                headerName: "FileName", field: "FileName", hide: true
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
                headerName: "",
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

    componentDidMount() {
        let sessionStorageData = getSessionData();
        if (sessionStorageData.AdminType === "document") {
            this.setState({
                isUploadServiceProfile: true
            });
        }
    }
    
    addSystemID = (postData) => {
        
        let sessionStorageData = getSessionData();

        if (sessionStorageData.AdminType === "assessmenttype" ||
            sessionStorageData.AdminType === "document" ||
            sessionStorageData.AdminType === "assessmentsubtype" ||
            sessionStorageData.AdminType === "judge" ||
            sessionStorageData.AdminType === "servicecategory" ||
            sessionStorageData.AdminType === "servicerelease" || 
            sessionStorageData.AdminType === "serviceoutcome" ||
            sessionStorageData.AdminType === "contacttype" ) {

              postData.SystemID = sessionStorageData.SystemID

            }

        return postData;
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

    
    
       postData = this.addSystemID(postData);
        
       let promise = Api.SaveNew(postData).then(response => {return response });

        promise.then(result => {
            if (result.status === 200) {
                this.loadGrid();

                if (this.state.ErrorMessage === '') {
                    this.resetState();
                }
            } else {
                return result.json();
            } 

        }).then(finalResult => {
            this.handleError(finalResult);
                    
        });
    }

    handleError = (finalResult) => {
        if (finalResult !== undefined && finalResult !== null && finalResult.ModelState !== null) {
            let nameError = finalResult.ModelState["entity.Name"];

            nameError.forEach(error => {

                this.state.ErrorMessage += error;
                
                this.setState({
                    isVisible: true
                });  
            });  
        }
    }

    showAlert = () => {
       alert('an error occurred while saving the data.');
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
            active: true,
            fileName: ''
         });
    }

    DeleteSelectedRow = () => {

        let selectedRowId = this.state.ID;

        let sessionStorageData = getSessionData();

        let fullDeleteUrl = `${sessionStorageData.DeleteApiUrl}/${selectedRowId}`; 

        let promise = Api.DeleteRow(fullDeleteUrl, sessionStorageData.Token);

        promise.then(result => {
            this.loadGrid();

            this.resetState();
        });
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

        
        postData = this.addSystemID(postData);

        let promise = Api.UpdateRow(postData).then(response => {return response });

        promise.then(result => {
            if (result.status === 200) {
                this.loadGrid();

                if (this.state.ErrorMessage === '') {
                    this.resetState();
                }
            } else {
                return result.json();
            } 

        }).then(finalResult => {
            this.handleError(finalResult);
                    
        }); //.catch(this.showAlert());
    }


    SaveClickEventHandler = async () => {

        if (this.state.isUploadServiceProfile === true ) {
            this.saveFile();
        }
        else {
            if (this.state && !this.state.ID) {
                this.SaveNew();
                             
            } else {
                this.UpdateSelectedRow();
                this.state.ID = '';
                this.state.CreatedBy = '';
                this.state.CreatedDate = '';
            }  
        }
    }

    ResetClickEventHandler = async() => {
        
        this.loadGrid();

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
            addButtonDisabled: true,
            fileName: selected.FileName
        });

        this.showForm();
    }

    loadGrid = () => {

        // Api.getAll().then(result => {
        //     console.log(result);
        // });

         Api.getAll().then(rowData => this.setState({ rowData }));

    }

    setActive = event => {

        this.setState({
            saveButtonDisabled: false
        });

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

    onFileChangeHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    }

    saveFile = () => {
    
      //save a new one
      //first call the Upload controller
      let sessionStorageData = getSessionData();
      let baseApiAddress = sessionStorage.getItem("baseApiAddress");
      let fullUploadUrl = `${baseApiAddress}/api/Upload`;
      
      const data = new FormData();
      data.append('file', this.state.selectedFile);

        //post the file to the upload controller
        try 
        {
            return  fetch(fullUploadUrl, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                },
                body: data
            }).then(result => { 
                console.log(result);
            });
        }
        catch (error) {
            console.log('the file failed to upload');
            console.log(error);
        }
        
        //for the document controller
        var postData = {
            Name: this.state.name,
            Description: this.state.description,
            Active: this.state.active,
            CreatedDate: new Date().toLocaleString(), 
            CreatedBy:  sessionStorageData.CurrentUser, 
            UpdatedDate: new Date().toLocaleString(),
            UpdatedBy: sessionStorageData.CurrentUser,
            FileName: this.state.selectedFile.name
        };

        postData = this.addSystemID(postData);

         var methodType;
         if (this.state && !this.state.ID) {
            methodType = 'post';
         } else {
            methodType = 'put';
         }

        try {

            //create the new record
            return fetch(sessionStorageData.CreateApiUrl, {
                method: methodType,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                },
                body: JSON.stringify(postData)
            }).then(result => {
                if (result.status === 200) {
                    this.loadGrid();
    
                    if (this.state.ErrorMessage === '') {
                        this.resetState();
                    }
                } else {
                    return result.json();
                } 
            }).then(finalResult => {
                this.handleError(finalResult);
            });

        } catch (error) {
            console.log(error);
            alert('an error occurred while saving the data.');
        }
       

        promise.then(result => {
            if (result.status === 200) {
                this.loadGrid();

                if (this.state.ErrorMessage === '') {
                    this.resetState();
                }
            } else {
                return result.json();
            } 

        }).then(finalResult => {
            this.handleError(finalResult);
                    
        }); 

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
                            pagination={true}
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
                                    {
                                        this.state.isUploadServiceProfile ?
                                        <div className="form-group">
                                            <input type="file" name="file"  onChange={this.onFileChangeHandler} /><br></br>
                                            <label>Current file: {this.state.fileName}</label>
                                            
                                        </div> : <div></div>
                                    }        
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