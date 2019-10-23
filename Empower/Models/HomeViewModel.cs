using Empower.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Empower.Models
{
    public class HomeViewModel
    {
        public AuthenticationResponse AuthenticationResponse { get; set; }

        public string UserName { get; set; }

        public string Token { get; set; }

        public string BaseApiAddress { get; set; }

        public string  SystemID { get; set; }
    }
}
