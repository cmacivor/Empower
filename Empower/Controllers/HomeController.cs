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
            //first check to see if we're authenticated
            //TODO: consider finding a better way to do this...maybe store auth data in a singleton? Could just store in session, the traditional way, and handle it that way?
            var token = (string)TempData["Token"];
            var userName = (string)TempData["UserName"];
            var baseApiAddress = (string)TempData["baseApiAddress"];
            var systemID = (string)TempData["systemID"];

            if (token == null || userName == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }
            
            var viewModel = new HomeViewModel
            {
                Token = token,                
                UserName = userName,
                BaseApiAddress = baseApiAddress,
                SystemID = systemID
            };

            return View(viewModel);
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
