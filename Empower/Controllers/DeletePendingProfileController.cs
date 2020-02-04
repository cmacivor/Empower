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

            var viewModel = new DeletePendingProfileViewModel 
            {
              PendingClientProfiles = results  
            };

            //var viewModels = new List
            
            // var viewModel = new HomeViewModel
            // {
            //     Token = authResponse.access_token,              
            //     UserName = authResponse.userName, 
            //     BaseApiAddress = authResponse.baseApiAddress, 
            //     SystemID = authResponse.systemID,
            //     //AuthenticationResponse
            // };


            // var viewModel = new DeletePendingProfileViewModel();

            // viewModel.PendingClientProfiles.Add(new PendingClientProfile {
            //     LastName = "TestName",
            //     FirstName= "FirstName",
            //     MiddleName = "",
            //     JTSNumber = "22344",
            //     BirthDate = "02/3/1987",
            //     Gender = "M"
            // });

            return View(viewModel);     
        }
    }
}