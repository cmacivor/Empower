using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Empower.Models;
using Empower.Authentication;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using Microsoft.Extensions.Options;
using Empower.Configuration;

namespace Empower.Controllers
{
    public class CaseManagementController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHttpClientFactory _clientFactory;
        public IOptions<AppSettings> _appsettings { get; set; }

        public CaseManagementController(ILogger<HomeController> logger, IHttpClientFactory clientFactory, IOptions<AppSettings> options) : base(logger, clientFactory, options)
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

            var documentMenuItems = await GetDocumentMenuItems(authResponse);

            var viewModel = new CaseManagementViewModel 
            {
                SystemID = authResponse.systemID,
                UserName = authResponse.userName,
                DocumentMenuItems = documentMenuItems
            };
            
            return View(viewModel);
        }
    }
}