using Empower.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Empower.Models;

namespace Empower.Models
{
    public class HomeViewModel : ViewModelBase
    {
        public string Token { get; set; }

        public string BaseApiAddress { get; set; }
    }
}
