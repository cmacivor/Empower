using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Empower.Models;
using Empower.Authentication;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;

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
                    Gender = result.Gender,
                    ID = result.ID
                });
            }

            var viewModel = new DeletePendingProfileViewModel 
            {
                PendingClientProfiles = viewModels  
            };

            return View(viewModel);     
        }

        [HttpPost]
        public async Task<IActionResult> DeleteAll(DeletePendingProfileViewModel viewModel)
        {
            var authResponse = HttpContext.Session.Get<AuthenticationResponse>("AuthenticationResponse");

            if (authResponse == null)
            {
                return RedirectToAction("Authenticate", "Login");
            }

            string url = authResponse.baseApiAddress + "/api/ClientProfile/AdminDeleteClientProfile";

            await RemoveItems(viewModel.AreChecked.ToArray(), authResponse.access_token, url);

            return RedirectToAction("Index");
        }

        public async Task RemoveItems(int[] ids, string token, string url)
        {
            var client = _clientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
         
            var serialized = JsonConvert.SerializeObject(ids);
            var stringContent = new StringContent(serialized, System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync(url, stringContent);
            response.EnsureSuccessStatusCode();

        }
    }
}