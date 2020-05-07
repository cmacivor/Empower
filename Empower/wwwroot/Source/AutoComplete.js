// export default function autocomplete(inp, arr, searchResults) {
  
    var currentFocus;

    //     // if (arr.length === 0)
    //     // {
    //     //   return;
    //     // }
    //     /*the autocomplete function takes two arguments,
    //     the text field element and an array of possible autocompleted values:*/
    //     var currentFocus;
    //     /*execute a function when someone writes in the text field:*/
    //     inp.addEventListener("input", function(e) {
    //         var a, b, i, val = this.value;
    //         /*close any already open lists of autocompleted values*/
    //         closeAllLists();
    //         if (!val) { return false;}
    //         currentFocus = -1;
    //         /*create a DIV element that will contain the items (values):*/
    //         a = document.createElement("DIV");
    //         a.setAttribute("id", this.id + "autocomplete-list");
    //         a.setAttribute("class", "autocomplete-items");
    //         /*append the DIV element as a child of the autocomplete container:*/
    //         this.parentNode.appendChild(a);
    //         /*for each item in the array...*/
    //         for (i = 0; i < arr.length; i++) {
    //           /*check if the item starts with the same letters as the text field value:*/
    //           if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
    //             /*create a DIV element for each matching element:*/
    //             b = document.createElement("DIV");
    //             /*make the matching letters bold:*/
    //             b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
    //             b.innerHTML += arr[i].substr(val.length);
    //             /*insert a input field that will hold the current array item's value:*/
    //             b.innerHTML += "<input type='hidden' class='addressItem' value='" + arr[i] + "'>";
    //             /*execute a function when someone clicks on the item value (DIV element):*/
    //             b.addEventListener("click", function(e) {
    //                 /*insert the value for the autocomplete text field:*/
    //                 inp.value = this.getElementsByTagName("input")[0].value;
    //                 /*close the list of autocompleted values,
    //                 (or any other open lists of autocompleted values:*/
    //                 closeAllLists();
    //             });
    //             a.appendChild(b);
    //           }
    //         }
    //     });
    
    
        /*execute a function presses a key on the keyboard:*/
        // inp.addEventListener("keydown", function(e) {
        //     var x = document.getElementById(this.id + "autocomplete-list");
        //     if (x) x = x.getElementsByTagName("div");
        //     if (e.keyCode == 40) {
        //       /*If the arrow DOWN key is pressed,
        //       increase the currentFocus variable:*/
        //       currentFocus++;
        //       /*and and make the current item more visible:*/
        //       addActive(x);
        //     } else if (e.keyCode == 38) { //up
        //       /*If the arrow UP key is pressed,
        //       decrease the currentFocus variable:*/
        //       currentFocus--;
        //       /*and and make the current item more visible:*/
        //       addActive(x);
        //     } else if (e.keyCode == 13) {
        //       /*If the ENTER key is pressed, prevent the form from being submitted,*/
        //       e.preventDefault();
        //       if (currentFocus > -1) {
        //         /*and simulate a click on the "active" item:*/
        //         if (x) x[currentFocus].click();
        //       }
        //     }
        // });
    
    
        export function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
    
    
        export  function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
    
        
        export function closeAllLists(elmnt, searchBoxId) {
            let inp = document.getElementById(searchBoxId);
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
              if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
              }
            }
          }
    
        export function onKeyDownHandler(e, searchBoxId) {
          let searchInput = document.getElementById(searchBoxId);
    
          var x = document.getElementById(searchInput.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x, currentFocus);
          } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x, currentFocus);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          }
    
        }
    
        export function populateSearchBox(result, addressTypeId, searchBoxId) {
          let addresses = [];
                
          let searchInput = document.getElementById(searchBoxId);
          
          if (result !== null && result.candidates !== null) {
    
              result.candidates.forEach(element => {
                  addresses.push(element.address);
              });
    
              var a, b, i, val = searchInput.value;
              /*close any already open lists of autocompleted values*/
              closeAllLists(searchBoxId);
              if (!val) { return false;}
              currentFocus = -1;
              /*create a DIV element that will contain the items (values):*/
              a = document.createElement("DIV");
              a.setAttribute("id", searchInput.id + "autocomplete-list");
              a.setAttribute("class", "autocomplete-items");
              /*append the DIV element as a child of the autocomplete container:*/
              searchInput.parentNode.appendChild(a);
              /*for each item in the array...*/
              for (i = 0; i < addresses.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (addresses[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                  /*create a DIV element for each matching element:*/
                  b = document.createElement("DIV");
                  /*make the matching letters bold:*/
                  b.innerHTML = "<strong>" + addresses[i].substr(0, val.length) + "</strong>";
                  b.innerHTML += addresses[i].substr(val.length);
                  /*insert a input field that will hold the current array item's value:*/
                  b.innerHTML += "<input type='hidden' class='addressItem' value='" + addresses[i] + "'>";
                  /*execute a function when someone clicks on the item value (DIV element):*/
                  b.addEventListener("click", function(e) {
                      /*insert the value for the autocomplete text field:*/
                      searchInput.value = e.target.innerText;
    
                      //populate the fields
                      let addressProperties = result.candidates.filter(function(address){
                          return address.address === e.target.innerText;
                      });
    
                      console.log(addressProperties);
    
                      if (addressTypeId === 1) {
                          $("#txtDJSAddressLineOne").val(addressProperties[0].attributes.StAddr);
                          $("#txtDJSZip").val(addressProperties[0].attributes.ZIP);
                          $("#hdnLatitude").val(addressProperties[0].attributes.Latitude);
                          $("#hdnLongitude").val(addressProperties[0].attributes.Longitude);
                          $("#txtDJSCouncilDistrict").val(addressProperties[0].attributes.CouncilDistrict);
                          $("#hdnGISCode").val(addressProperties[0].attributes.Ref_ID);
        
                          document.getElementById("lblDJSAddressType").innerHTML = "Valid DJS City Address"
        
                                                  
                          if (addressProperties[0].attributes.SubAddType !== null && addressProperties[0].attributes.SubAddUnit !== null) {
                              let addressLineTwo = addressProperties[0].attributes.SubAddType + " " + addressProperties[0].attributes.SubAddUnit;
                              $("#txtDJSAddressLineTwo").val(addressLineTwo);
                          }
                      }
    
                      if (addressTypeId === 3) {
                          $("#txtCSUAddressLineOne").val(addressProperties[0].attributes.StAddr);
                          $("#txtCSUZip").val(addressProperties[0].attributes.ZIP);
                          $("#hdnLatitude").val(addressProperties[0].attributes.Latitude);
                          $("#hdnLongitude").val(addressProperties[0].attributes.Longitude);
                          $("#txtCSUCouncilDistrict").val(addressProperties[0].attributes.CouncilDistrict);
                          $("#hdnGISCode").val(addressProperties[0].attributes.Ref_ID);
        
                          document.getElementById("lblCSUAddressType").innerHTML = "Valid CSU City Address"
        
                                                  
                          if (addressProperties[0].attributes.SubAddType !== null && addressProperties[0].attributes.SubAddUnit !== null) {
                              let addressLineTwo = addressProperties[0].attributes.SubAddType + " " + addressProperties[0].attributes.SubAddUnit;
                              $("#txtCSUAddressLineTwo").val(addressLineTwo);
                          }
                      }
    
                      /*close the list of autocompleted values,
                      (or any other open lists of autocompleted values:*/
                      closeAllLists(searchBoxId);
                  });
                  a.appendChild(b);
                }
              }
          }
        }
    
        // export function closeAllLists(elmnt) {
        //   /*close all autocomplete lists in the document,
        //   except the one passed as an argument:*/
        //   var x = document.getElementsByClassName("autocomplete-items");
        //   for (var i = 0; i < x.length; i++) {
        //     if (elmnt != x[i] && elmnt != inp) {
        //       x[i].parentNode.removeChild(x[i]);
        //     }
        //   }
        // }
    
        
        /*execute a function when someone clicks in the document:*/
        // document.addEventListener("click", function (e) {
        //     closeAllLists(e.target);
        // });
      