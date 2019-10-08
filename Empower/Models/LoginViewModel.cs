using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Empower.Models
{
    public class LoginViewModel
    {
        public LoginViewModel()
        {
            ErrorMessageStyle = "display:none";
        }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        public string ErrorMessageStyle { get; set; }

        public string ErrorMessage { get; set; }
    }
}
