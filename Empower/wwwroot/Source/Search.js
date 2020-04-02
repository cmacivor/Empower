import React, { useState, useEffect } from 'react';
import { EditingState, PagingState, IntegratedPaging, RowDetailState, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditColumn, TableFixedColumns, PagingPanel, TableRowDetail } from '@devexpress/dx-react-grid-bootstrap4';
import moment from 'moment';
import {getSessionData } from './commonAdmin';
import {useStore} from './StateStores/store';
//import {Toast } from 'react-bootstrap';
import {FaTrash, FaExchangeAlt} from 'react-icons/fa';
import { getRoles } from './Constants';


const Search = (props) => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [ isAddNewProfileButtonVisible, setAddNewProfileButtonVisible ] = useState(false);
    const [searchCount, setSearchCount] = useState(0);
    const [isSearchCountVisible, setIsSearchCountVisible] = useState(false);
    const [isSearchButtonEnabled, setIsSearchButtonDisabled] = useState(true);
    //for the merge button?
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [addedRows, setAddedRows] = useState([]);
    const [rowChanges, setRowChanges] = useState({});

    //grid state
    const [columns] = useState([
        { name: 'FirstName', title: 'First Name' },
        { name: 'LastName', title: 'Last Name' },
        { name: 'MiddleName', title: 'Middle Name' },
        { name: 'StateORVCIN', title: 'State/VCIN #' },
        { name: 'SSN', title: 'SSN' },
        { name: 'FormattedBirthDate', title: 'Birth Date' }, 
        { name: 'Gender', title: 'Gender' },
        { name: 'PersonID', title: 'ID'}        
      ]);

     const [rows, setRows] = useState([]);
     const [isGridVisible, setGridVisible] = useState(false);
     const [canDeleteRow, setCanDeleteRow ] = useState(false);
     const [canMergeProfiles, setCanMergeProfiles] = useState(true);
     const [leftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE]);
     const [sorting, setSorting] = useState([]);

     //main search grid paging params
     const [currentPage, setCurrentPage] = useState(0);
     const [pageSize, setPageSize] = useState(5);
     const [pageSizes] = useState([5, 10, 15]);
    
     //to test the global state
     const {state, dispatch} = useStore();


      let sessionStorageData = getSessionData();
      let apiAddress = sessionStorage.getItem("baseApiAddress");

    
      useEffect(() => {
        //let roles = getRoles();
      
      }, [] );

      const DeleteButton = ({ onExecute }) => (
        <button
            type="button"
            className="btn btn-danger btn-sm"
          
            style={{ padding: 3 }}
            onClick={(e) => {
              if (window.confirm('Are you sure you want to delete this row?')) {
                onExecute();
              }
              e.stopPropagation();
            }}
            title={'Delete this client record'}
          >   
            <FaTrash />
      </button>
      );

  
      const adminUserCommandComponents = {
        delete: DeleteButton
      }

      const AdminUserCommand = ({ id, onExecute }) => {
        const ButtonComponent = adminUserCommandComponents[id];
        return (
          <ButtonComponent 
            onExecute={onExecute}
          />
        );
      };

      const deleteRows = (deletedIds) => {
        let rowsForDelete;

        rowsForDelete = rows.slice();
       

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
            let index = deleted[0];
            let deletedRow = rows[index];
            deleteClient(deletedRow.ID);
          changedRows = deleteRows(deleted);
        }

        setRows(changedRows);
      };


    function SetClientProfile(clientProfile) {
         props.hideSpinner();
         props.onSearchGridRowClick(clientProfile);
     }

    function handleLastNameChange (event)  {
        setLastName(event.target.value);
        setIsSearchButtonDisabled(false);
    }

    function handleFirstNameChange (event) {
        setFirstName(event.target.value);
        setIsSearchButtonDisabled(false);
    }


    function SearchButtonClickHandler() {
        
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

    

    function deleteClient(personID) {
        
        let clientProfileAddress = `${apiAddress}/api/ClientProfile/DeleteClient/${personID}`;

        try
        {
           var promise = fetch(clientProfileAddress, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                }               
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    return result.json(); //TODO: fix this
                } 
    
            }).then(finalResult => {
              SearchButtonClickHandler();

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

        props.showSpinner();
        
        let clientProfileAddress = `${apiAddress}/api/ClientProfile/${row.ID}`;

        try
        {
           var promise = fetch(clientProfileAddress, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token 
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
                        <button type="submit" onClick={SearchButtonClickHandler} disabled={isSearchButtonEnabled}  className="btn btn-primary mb-2">Search</button>
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
                <br/>
               
                {
                  //this grid is for Admin users. Admins can delete a row, but cannot merge.
                    isGridVisible === true ?
                    
                    <Grid className="card"
                        rows={rows }
                        columns={columns}
                      >
                      <SortingState
                        sorting={sorting}
                        onSortingChange={setSorting}
                       />
                       <IntegratedSorting />
                      <RowDetailState/>
                      <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                       />
                       <IntegratedPaging/>
                        <EditingState
                            onCommitChanges={commitChanges}
                            
                            editingRowIds={editingRowIds}
                            onEditingRowIdsChange={getEditingRowIds}
                            rowChanges={rowChanges}
                            onRowChangesChange={setRowChanges}
                         />
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow showSortingControls />

                        <PagingPanel pageSizes={pageSizes} />
                       
                         <TableEditColumn width="60"
                        showDeleteCommand  commandComponent={AdminUserCommand} />
                        <TableFixedColumns 
                            rightColumns={leftFixedColumns} /> 
                      
                    </Grid> : <div></div> 
                }
               
            </div>;
}

export default Search;