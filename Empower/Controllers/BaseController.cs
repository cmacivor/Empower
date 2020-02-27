using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Empower.Models;
using Empower.Authentication;
using System.Net.Http;
using Microsoft.Extensions.Options;
using Empower.Configuration;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Empower.Controllers
{
    public class BaseController: Controller
    {
        
        private readonly ILogger<HomeController> _logger;
        private readonly IHttpClientFactory _clientFactory;
        public IOptions<AppSettings> _appsettings { get; set; }

        public BaseController(ILogger<HomeController> logger, IHttpClientFactory clientFactory, IOptions<AppSettings> options)
        {
            _logger = logger;
            _clientFactory = clientFactory;
            _appsettings = options;
        }

        // public async  Task<IActionResult> Index()
        // {
        //     var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse");

        //     if (authResponse == null)
        //     {
        //         return RedirectToAction("Authenticate", "Login");
        //     }

        //     return null;
        // }

        public async Task<List<DocumentMenuItem>> GetDocumentMenuItems(AuthenticationResponse authResponse)
        {
    
            //get the document menu items
            var client = new Empower.Services.ApiClient<Empower.Models.DocumentMenuItem>(_clientFactory);
            
            string url = authResponse.baseApiAddress + "/api/Document/GetAll";

            var results = await client.GetAllItems(authResponse.access_token, url);

            foreach (var documentMenuItem in results) {
                documentMenuItem.Link = _appsettings.Value.LocationUrl + documentMenuItem.Name;
            }

            return results;
        }
    }
}