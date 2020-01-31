using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Empower.Models;
using Empower.Authentication;


namespace Empower.Controllers
{
    public class CaseManagementController : Controller
    {
        public IActionResult Index()
        {
            var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse");

            if (authResponse == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }

            var viewModel = new  CaseManagementViewModel 
            {
                SystemID = authResponse.systemID,
                UserName = authResponse.userName
            };
            
            return View(viewModel);
        }
    }
}