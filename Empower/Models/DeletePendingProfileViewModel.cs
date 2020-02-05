using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Empower.Models 
{
    public class DeletePendingProfileViewModel : ViewModelBase
    {
        public DeletePendingProfileViewModel()
        {
            PendingClientProfiles = new List<PendingClientProfileViewModel>();
        }
        public List<PendingClientProfileViewModel> PendingClientProfiles { get; set; }

        public List<int> AreChecked { get; set; }
    }

    //this class represents the columns in the grid- returned from the API client
    public class PendingClientProfile
    {
        public string LastName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string JTS { get; set; }

        public string SSN { get; set; }

        public string FormattedBirthDate { get; set; }

        public string Gender { get; set; }

        public int ID { get; set; } //Client Profile ID
    }

    //used to actually display on the view
    public class PendingClientProfileViewModel
    {
        public string LastName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string JTS { get; set; }

        public string SSN { get; set; }

        public string FormattedBirthDate { get; set; }

        public string Gender { get; set; }

        public bool Selected { get; set; }

        public int ID { get; set; }
    }
}