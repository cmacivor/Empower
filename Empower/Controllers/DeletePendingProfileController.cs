using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Empower.Models;
using Empower.Authentication;
using System.Net.Http;

namespace Empower.Controllers
{
    public class DeletePendingProfileController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;

        public DeletePendingProfileController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public async Task<IActionResult> Index() 
        {
            var client = new Empower.Services.ApiClient<Empower.Models.PendingClientProfile>(_clientFactory);
            //get the token and url

            var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse");

            if (authResponse == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }

            string url = authResponse.baseApiAddress + "/api/ClientProfile/InActiveClients";

            var results = await client.GetAllItems(authResponse.access_token, url);

            var viewModels = new List<PendingClientProfileViewModel>();

            foreach (var result in results)
            {
                viewModels.Add(new PendingClientProfileViewModel {
                    LastName = result.LastName,
                    FirstName = result.FirstName,
                    MiddleName = result.MiddleName,
                    JTS = result.JTS,
                    FormattedBirthDate = result.FormattedBirthDate,
                    Gender = result.Gender
                });
            }

            var viewModel = new DeletePendingProfileViewModel 
            {
                PendingClientProfiles = viewModels  
            };

            return View(viewModel);     
        }

        [HttpPost]
        public IActionResult DeleteAll(DeletePendingProfileViewModel viewModel)
        {

            return null;
        }
    }
}