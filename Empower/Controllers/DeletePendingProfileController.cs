using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Empower.Models;
using Empower.Authentication;

namespace Empower.Controllers
{
    public class DeletePendingProfileController : Controller
    {
        public IActionResult Index() 
        {
            var viewModel = new DeletePendingProfileViewModel();
            viewModel.PendingClientProfiles.Add(new PendingClientProfile {
                LastName = "TestName",
                FirstName= "FirstName",
                MiddleName = "",
                JTSNumber = "22344",
                BirthDate = "02/3/1987",
                Gender = "M"
            });

            return View(viewModel);     
        }
    }
}