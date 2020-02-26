using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Empower.Models;
using Empower.Authentication;
using System.Net.Http;
using Microsoft.Extensions.Options;
using Empower.Configuration;

namespace Empower.Controllers
{
    public class HomeController : Controller
    {
        
        private readonly ILogger<HomeController> _logger;
        private readonly IHttpClientFactory _clientFactory;
        public IOptions<AppSettings> _appsettings { get; set; }

        public HomeController(ILogger<HomeController> logger, IHttpClientFactory clientFactory, IOptions<AppSettings> options)
        {
            _logger = logger;
            _clientFactory = clientFactory;
            _appsettings = options;
        }

        public async Task<IActionResult> Index()
        {            
            var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse");

            if (authResponse == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }

            //get the document menu items
            var client = new Empower.Services.ApiClient<Empower.Models.DocumentMenuItem>(_clientFactory);
            
            string url = authResponse.baseApiAddress + "/api/Document/GetAll";

            var results = await client.GetAllItems(authResponse.access_token, url);

            var appsettings = _appsettings;

            var viewModel = new HomeViewModel
            {
                Token = authResponse.access_token,              
                UserName = authResponse.userName, 
                BaseApiAddress = authResponse.baseApiAddress, 
                SystemID = authResponse.systemID,
                DocumentMenuItems = results           
            };

            viewModel.GetAppTitle();

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
