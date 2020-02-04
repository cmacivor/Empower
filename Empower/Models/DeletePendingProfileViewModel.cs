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
            PendingClientProfiles = new List<PendingClientProfile>();
        }
        public List<PendingClientProfile> PendingClientProfiles { get; set; }
    }

    //this class represents the columns in the grid
    public class PendingClientProfile
    {
        public string LastName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string JTS { get; set; }

        public string SSN { get; set; }

        public string FormattedBirthDate { get; set; }

        public string Gender { get; set; }
    }
}