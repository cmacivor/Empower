using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Empower.Models;
using Microsoft.AspNetCore.Mvc;
using Empower.Authentication;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using Microsoft.Extensions.Options;
using Empower.Configuration;

namespace Empower.Controllers
{
    [Route("[controller]")]
    public class AdminController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly HttpClient _httpClient;

        public IOptions<AppSettings> _appsettings { get; set; }



        public AdminController(ILogger<HomeController> logger, IHttpClientFactory clientFactory, IOptions<AppSettings> options) : base(logger, clientFactory, options)
        {
            _logger = logger;
            _clientFactory = clientFactory;
            _appsettings = options;
            //_httpClient = httpClient;
        }


        [Route("Index")] 
        [Route("{admintype}")]
        public IActionResult Index(string admintype)
        {
            var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse");

            if (authResponse == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }

            var title = "";
            switch(admintype) 
            {
                case "document" :
                    title = "Upload a Service Profile";
                    break;
                case "assessmenttype" :
                    title = "Assessment Type";
                    break;
                case "assessmentsubtype" :
                    title = "Assessment SubType";
                    break;
                case "addresstype":
                    title = "Address Type";
                    break;
                case "educationlevel":
                    title = "Education Level";
                    break;
                case "jobstatus" :
                    title = "Job Status";
                    break;
                case "judge" :
                    title = "Judge";
                    break;
                case "offense": 
                    title = "Offense";
                    break;
                case "race" :
                    title = "Race";
                    break;
                case "relationship":
                    title = "Relationship";
                    break;
                case "serviceoutcome":
                    title = "Reason";
                    break;
                case "servicecategory":
                    title = "Service Category";
                    break;
                case "reason":
                    title = "Reason";
                    break;
                case "serviceprogramcategory":
                    title = "Service Program Category";
                    break;
                case "servicerelease":
                    title = "Case Status";
                    break;
                case "suffix":
                    title = "Suffix";
                    break;
                case "contacttype":
                    title = "Contact Type";
                    break;
                case "subcontacttype":
                    title = "Sub Contact Type";
                    break;
                case "careerpathway":
                    title = "Career Pathway";
                    break;
            }

            var viewModel = new AdminViewModel
            {
                SystemID = authResponse.systemID,
                UserName = authResponse.userName,
                AdminType = title
            };

            return View(viewModel);
        }

        [Route("signup")]
        public IActionResult SignUp()
        {
            var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse"); 

            if (authResponse == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }

            //get the roles and filter by system ID
            //var strings = new List<string>();

            //var url = _appsettings.Value.ApiUrl;

            //var request = new HttpRequestMessage(HttpMethod.Get, url);

            


            var viewModel = new SignupViewModel
            {
                SystemID = authResponse.systemID,
                UserName = authResponse.userName,
            };

            return View(viewModel);
        }

    }
}