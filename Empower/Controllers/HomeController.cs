using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Empower.Models;
using Empower.Authentication;

namespace Empower.Controllers
{
    public class HomeController : Controller
    {
        
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        //main React app will go here
        public IActionResult Index()
        {            
            var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse");

            if (authResponse == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }
            
            var viewModel = new HomeViewModel
            {
                Token = authResponse.access_token,              
                UserName = authResponse.userName, 
                BaseApiAddress = authResponse.baseApiAddress, 
                SystemID = authResponse.systemID  
            };

            return View(viewModel);
        }

        public IActionResult LogOut()
        {
            HttpContext.Session.Clear();

            return RedirectToAction("Authenticate", "Login");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
