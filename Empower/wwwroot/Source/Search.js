import React, { useState } from 'react';
import { EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditColumn, TableFixedColumns } from '@devexpress/dx-react-grid-bootstrap4';
import moment from 'moment';
import {getSessionData } from './commonAdmin';
import {useStore} from './StateStores/store';
import {Toast } from 'react-bootstrap';



const Search = (props) => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [ isAddNewProfileButtonVisible, setAddNewProfileButtonVisible ] = useState(false);
    //const [showDeleteToast, setShowDeleteToast] = useState(false);
    

    //grid state
    const [columns] = useState([
        { name: 'FirstName', title: 'First Name' },
        { name: 'LastName', title: 'Last Name' },
        { name: 'MiddleName', title: 'Middle Name' },
        { name: 'StateORVCIN', title: 'State/VCIN #' },
        { name: 'SSN', title: 'SSN' },
        { name: 'FormattedBirthDate', title: 'Birth Date' }, 
        { name: 'Gender', title: 'Gender' },        
      ]);

     const [rows, setRows] = useState([]);
     const [isGridVisible, setGridVisible] = useState(false);
     const [canDeleteRow, setCanDeleteRow ] = useState(true);
     const [leftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE]); 

     //to test the global state
     const {state, dispatch} = useStore();

     //const toggleDeleteToast = () => setShowDeleteToast(!showDeleteToast);

     const CommandButton = ({
        onExecute, icon, text, hint, color,
      }) => (
        <button
          type="button"
          className="btn btn-danger btn-sm"
         
          style={{ padding: 3 }}
          onClick={(e) => {
            onExecute();
            e.stopPropagation();
          }}
          title={hint}
         >
          {/* <span className={color || 'undefined'}>
            {icon ? <i className={`oi oi-${icon}`} style={{ marginRight: text ? 5 : 0 }} /> : null}
            {text}
          </span> */}
          Delete
        </button>
      );

      const DeleteButton = ({ onExecute }) => (
        <CommandButton
          icon="trash"
          hint="Delete row"
          color="text-danger"
          onExecute={() => {
            // eslint-disable-next-line
            if (window.confirm('Are you sure you want to delete this row?')) {
              onExecute();
            }
          }}
        />
      );

      const commandComponents = {
        //add: AddButton,
        //edit: EditButton,
        delete: DeleteButton,
        //commit: CommitButton,
        //cancel: CancelButton,
      };

      const Command = ({ id, onExecute }) => {
        const ButtonComponent = commandComponents[id];
        return (
          <ButtonComponent
            onExecute={onExecute}
          />
        );
      };

      const deleteRows = (deletedIds) => {
          //console.log(deletedIds);
          //console.log(rows);
        const rowsForDelete = rows.slice();
        deletedIds.forEach((rowId) => {
          const index = rowsForDelete.findIndex(row => row.id === rowId);
          if (index > -1) {
            rowsForDelete.splice(index, 1);
          }
        });
        return rowsForDelete;
      };

      const commitChanges = ({ added, changed, deleted }) => {
        let changedRows;
        if (added) {
          const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
          changedRows = [
            ...rows,
            ...added.map((row, index) => ({
              id: startingAddedId + index,
              ...row,
            })),
          ];
        }
        if (changed) {
          changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        }
        if (deleted) {
            console.log('this is the deleted in commitChanges');
            console.log(deleted);
            let index = deleted[0];
            let deletedRow = rows[index];
            console.log(deletedRow);
            //deletedRow(deletedRow.ID);
            deleteClient(deletedRow.ID);
          changedRows = deleteRows(deleted);
        }
        setRows(changedRows);
      };


    function SetClientProfile(clientProfile) {
         props.onSearchGridRowClick(clientProfile);
     }

    function handleLastNameChange (event)  {
        setLastName(event.target.value);
    }

    function handleFirstNameChange (event) {
        setFirstName(event.target.value);
    }

    function SearchButtonClickHandler() {
        //let apiAddress = sessionStorage.getItem("baseApiAddress");
        let apiAddress = "http://localhost:57612";

        //let token = sessionStorage.getItem("token");
        let sessionStorageData = getSessionData();
        
        let fullSearchAddress = `${apiAddress}/api/ClientProfile/Search`;

        let postData = {
            lastName: lastName,
            firstName: firstName
        }

        try
        {
           var promise = fetch(fullSearchAddress, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
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
                setRows(finalResult);
                setGridVisible(true);
                setAddNewProfileButtonVisible(true);        
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while searching;');
        }
    }

   const TableComponent = ({ ...restProps }) => (
        <Table.Table
          {...restProps}
          className="table-hover"
        />
      );

   const TableRow = ({ row, ...restProps }) => (
        <Table.Row
          {...restProps}
          onClick={() => GetSelectedRow(row) }/>
      );

    function ClearSearchFields() {
        setLastName('');
        setFirstName('');
    }

    // function testMethod() {
    //     console.log(clienProfile);
    // }

    function deleteClient(personID) {
        //let apiAddress = sessionStorage.getItem("baseApiAddress");
        let apiAddress = "http://localhost:57612";

        //let token = sessionStorage.getItem("token");
        let sessionStorageData = getSessionData();

        let token = sessionStorageData.Token;
        
        let clientProfileAddress = `${apiAddress}/api/ClientProfile/DeleteClient/${personID}`;

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
                //console.log(finalResult);
                //SetClientProfile(finalResult);
                //dispatch( { type: "existingClient"} ); 
                SearchButtonClickHandler();
                //setShowDeleteToast(true);
                props.createNotification('The client profile was successfully deleted.');
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while retrieving the Client Profile;');
        }
    }

    function GetSelectedRow(row) {
      
        props.enableTabsHandler();
        
        //let apiAddress = sessionStorage.getItem("baseApiAddress");
        let apiAddress = "http://localhost:57612";

        //let token = sessionStorage.getItem("token");
        let sessionStorageData = getSessionData();
        let token = sessionStorageData.Token;
        
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
                SetClientProfile(finalResult);
                dispatch( { type: "existingClient"} ); 
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while retrieving the Client Profile;');
        }
    }

    function addNewProfileClickHandler() {
        dispatch( { type: "newClient"} );
        props.setParticipantInfoAsActiveTab("participantinfo");
    }

    return <div>
            {/* {
                showDeleteToast ?

                <div aria-live="polite"
                    aria-atomic="true"
                    style={{
                    position: 'relative',
                    minHeight: '100px',
                    }}>      
                <Toast onClose={toggleDeleteToast} animation={true} delay={3000} autohide style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    }}>
                    <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                    <strong className="mr-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>The client profile was successfully deleted.</Toast.Body>
                </Toast></div> : <div></div>
            } */}
       
                <br></br>
                <h4>Search Client Profiles</h4>
                <p>Please search for an existing Client Profile, before creating a new one.</p>
                <div className="form-row">
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={handleLastNameChange} value={lastName}  placeholder="Enter Last Name"></input>
                    </div>
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={handleFirstNameChange} value={firstName} placeholder="Enter First Name"></input>
                    </div>
                    <div className="col-auto">
                        <button type="submit" onClick={SearchButtonClickHandler}  className="btn btn-primary mb-2">Search</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={ClearSearchFields} className="btn btn-primary mb-2">Clear Search</button>
                    </div>
                    {
                        isAddNewProfileButtonVisible ? <div className="col-auto">
                            <button type="button" onClick={addNewProfileClickHandler} className="btn btn-primary mb-2">Add New Profile</button>
                        </div> : <div></div>
                    }
                </div>
                <br/>
                {/* {state.count}
                <button onClick={() => dispatch({type: "increment", message:"Incremented"})}>+</button>
                <button onClick={() => dispatch({type: "decrement", message: "Decremented"})}>-</button>
                <button onClick={() => dispatch({type: "reset", message: "Reset"})}>Reset</button>
                {state.message} */}
                <br/>
                {
                    isGridVisible === true && canDeleteRow === false ?
                    
                    <Grid className="card"
                        rows={rows }
                        columns={columns}>
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow />
                    </Grid> : <div></div> 
                       
                }
                {
                    isGridVisible === true && canDeleteRow === true ?
                    
                    <Grid className="card"
                        rows={rows }
                        columns={columns}>
                        <EditingState
                            onCommitChanges={commitChanges} 
                         />
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow />
                        <TableEditColumn width="20"
                        showDeleteCommand commandComponent={Command} />
                        <TableFixedColumns 
                            rightColumns={leftFixedColumns} 
                        />
                    </Grid> : <div></div> 
                }
            </div>;
}

export default Search;