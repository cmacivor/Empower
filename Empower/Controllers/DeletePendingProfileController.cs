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

            return View(viewModel);     
        }
    }
}