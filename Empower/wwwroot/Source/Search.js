import React, { useState } from 'react';
import { EditingState, PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditColumn, TableFixedColumns, PagingPanel } from '@devexpress/dx-react-grid-bootstrap4';
import moment from 'moment';
import {getSessionData } from './commonAdmin';
import {useStore} from './StateStores/store';
import {Toast } from 'react-bootstrap';



const Search = (props) => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [ isAddNewProfileButtonVisible, setAddNewProfileButtonVisible ] = useState(false);
    const [ canSearch21Plus, setCanSearch21Plus] = useState(true);
    const [searchCount, setSearchCount] = useState(0);
    const [isSearchCountVisible, setIsSearchCountVisible] = useState(false);
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

      const [search21PluGridColumns] = useState([
        { name: 'FirstName', title: 'First Name' },
        { name: 'LastName', title: 'Last Name' },
        { name: 'MiddleName', title: 'Middle Name' },
        { name: 'JTS', title: 'JTS' },
        { name: 'SSN', title: 'SSN' },
        { name: 'FormattedBirthDate', title: 'Birth Date' }, 
        { name: 'Gender', title: 'Gender' },        
      ]);

     const [rows, setRows] = useState([]);
     const [isGridVisible, setGridVisible] = useState(false);
     const [canDeleteRow, setCanDeleteRow ] = useState(false);
     const [leftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE]);

     //main search grid paging params
     const [currentPage, setCurrentPage] = useState(0);
     const [pageSize, setPageSize] = useState(5);
     const [pageSizes] = useState([5, 10, 15]);
     
     //Search21Plus grid items
     const [search21PlusGridRows, setSearch21PlusGridRows] = useState([]);
     const [isSearch21PlusGridVisible, setIsSearch21PlusGridVisible ] = useState(false);
     const [search21GridLeftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE]);
     //paging
     const [search21CurrentPage, setSearch21CurrentPage] = useState(0);
     const [search21PageSize, setSearch21PageSize] = useState(5);
     const [search21PageSizes] = useState([5, 10, 15]);

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

      const Search21GridCommandButton = ({
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

      const Search21GridDeleteButton = ({ onExecute }) => (
        <Search21GridCommandButton
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

      const search21PlusCommandComponents = {
        //add: AddButton,
        //edit: EditButton,
        delete: Search21GridDeleteButton,
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

      const Search21PlusCommand = ({ id, onExecute }) => {
        const ButtonComponent = search21PlusCommandComponents[id];
        return (
          <ButtonComponent
            onExecute={onExecute}
          />
        );
      };

      const deleteRows = (deletedIds, isSearch21Grid) => {
          //console.log(deletedIds);
          //console.log(rows);
        let rowsForDelete;
        if (!isSearch21Grid) {
          rowsForDelete = rows.slice();
        } else {
          rowsForDelete = search21PlusGridRows.slice();
        }

        deletedIds.forEach((rowId) => {
          const index = rowsForDelete.findIndex(row => row.id === rowId);
          if (index > -1) {
            rowsForDelete.splice(index, 1);
          }
        });
        return rowsForDelete;
      };

      const commit21SearchGridChanges = ({ added, changed, deleted }) => {
        let changedRows;
        if (added) {
          const startingAddedId = search21PlusGridRows.length > 0 ? search21PlusGridRows[rows.length - 1].id + 1 : 0;
          changedRows = [
            ...search21PlusGridRows,
            ...added.map((row, index) => ({
              id: startingAddedId + index,
              ...row,
            })),
          ];
        }
        if (changed) {
          changedRows = search21PlusGridRows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        }
        if (deleted) {
            //console.log('this is the deleted in commitChanges');
            console.log(deleted);
            let index = deleted[0];
            //let deletedRow = rows[index];
            let deletedRow = search21PlusGridRows[index];
            console.log(deletedRow);
            //deletedRow(deletedRow.ID);
            deleteClient(deletedRow.ID, true);
          changedRows = deleteRows(deleted, true);
          //console.log(changedRows);
        }
        //setRows(changedRows);
        setRows([]);
        setGridVisible(false);
        setSearch21PlusGridRows(changedRows);
      
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
            deleteClient(deletedRow.ID, false);
          changedRows = deleteRows(deleted, false);
        }

        setSearch21PlusGridRows([]);
        setIsSearch21PlusGridVisible(false);
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

    function Search21PlusClickHandler() {
         let apiAddress = sessionStorage.getItem("baseApiAddress");
         //let apiAddress = "http://localhost:57612";

         //let token = sessionStorage.getItem("token");
         let sessionStorageData = getSessionData();
         
         let fullSearchAddress = `${apiAddress}/api/ClientProfile/SearchPlus`;
 
        //  let postData = {
        //      lastName: lastName,
        //      firstName: firstName
        //  }
 
         try
         {
            var promise = fetch(fullSearchAddress, {
                 method: 'get',
                 mode: 'cors',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': 'Bearer ' + sessionStorageData.Token
                 }
                 //body: JSON.stringify(postData)
             }); 
 
             promise.then(result =>  {
                 if (result.status === 200) {
                     return result.json();
                 
                 } else {
                     return result.json();
                 } 
     
             }).then(finalResult => {
                //console.log(finalResult);
                setRows([]);
                 setGridVisible(false);
                 setSearch21PlusGridRows(finalResult);
                 setIsSearch21PlusGridVisible(true);
                 
                 setSearchCount(finalResult.length)
                 //setRows(finalResult);
                 
                 setAddNewProfileButtonVisible(true);
                 setIsSearchCountVisible(true);
                        
             });
         }
         catch(error)
         {
             console.log(error);
             alert('an error occurred while searching;');
         }
    }

    function SearchButtonClickHandler() {
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        //let apiAddress = "http://localhost:57612";

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
                setSearch21PlusGridRows([]);
                setIsSearch21PlusGridVisible(false);
                setRows(finalResult);
                setGridVisible(true);
                setAddNewProfileButtonVisible(true);
                setSearchCount(finalResult.length);
                setIsSearchCountVisible(true);        
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

    

    function deleteClient(personID, isSearch21Grid) {
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        //let apiAddress = "http://localhost:57612";

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
                if (!isSearch21Grid) {
                  SearchButtonClickHandler();
                } else {
                  Search21PlusClickHandler();
                }

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
        
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        //let apiAddress = "http://localhost:57612";

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
                <br></br>
                <h4>Search Client Profiles</h4>
                <div className="form-row">
                  <div className="col-6">
                      <p>Please search for an existing Client Profile, before creating a new one.</p>
                  </div>
                  {
                     isSearchCountVisible ?
                     <div className="col-6">
                        <strong>Found {searchCount} matching Profiles</strong>
                    </div> : <div></div>
                  }
                
                </div>

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
                       canSearch21Plus ?
                       <div className="col-auto">
                          <button type="button" onClick={Search21PlusClickHandler} className="btn btn-primary mb-2">Search21plus</button>
                       </div> : <div></div>
                    }
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
                      <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                       />
                        <IntegratedPaging/>
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow />
                        <PagingPanel pageSizes={pageSizes} />
                    </Grid> : <div></div> 
                       
                }
                {
                    isGridVisible === true && canDeleteRow === true ?
                    
                    <Grid className="card"
                        rows={rows }
                        columns={columns}>
                      <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                       />
                       <IntegratedPaging/>
                        <EditingState
                            onCommitChanges={commitChanges} 
                         />
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow />
                        <PagingPanel pageSizes={pageSizes} />
                        <TableEditColumn width="20"
                        showDeleteCommand commandComponent={Command} />
                        <TableFixedColumns 
                            rightColumns={leftFixedColumns} 
                        />
                    </Grid> : <div></div> 
                }
                {
                  isSearch21PlusGridVisible === true ?
                  <Grid className="card"
                      rows={search21PlusGridRows }
                      columns={search21PluGridColumns}>
                      <PagingState
                        currentPage={search21CurrentPage}
                        onCurrentPageChange={setSearch21CurrentPage}
                        pageSize={search21PageSize}
                        onPageSizeChange={setSearch21PageSize}
                       />
                       <IntegratedPaging/>
                      <EditingState
                          onCommitChanges={commit21SearchGridChanges} 
                      />
                      <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                      <TableHeaderRow />
                      <PagingPanel pageSizes={search21PageSizes} />
                      <TableEditColumn width="20"
                      showDeleteCommand commandComponent={Search21PlusCommand} />
                      <TableFixedColumns 
                          rightColumns={search21GridLeftFixedColumns} 
                      />
                  </Grid> : <div></div> 
                }
            </div>;
}

export default Search;