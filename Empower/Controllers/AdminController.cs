using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Empower.Models;
using Microsoft.AspNetCore.Mvc;
using Empower.Authentication;

namespace Empower.Controllers
{
    [Route("[controller]")]
    public class AdminController : Controller
    {
        [Route("Index")] 
        [Route("{admintype}")]
        public IActionResult Index(string admintype)
        {
            var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse");

            if (authResponse == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }

            var viewModel = new AdminViewModel
            {
                SystemID = authResponse.systemID,
                UserName = authResponse.userName,
                AdminType = admintype
            };

            return View(viewModel);
        }

    }
}