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

        public async Task<string> RemoveItems(int[] ids, string token, string url)
        {
            //string responseContent;

            //string urlParams = "?";
            //foreach (int id in ids)
            //{
            //    urlParams += "ids=" + id + "&";
            //}

            //string completeUrl = url + urlParams;

            //var request = new HttpRequestMessage(HttpMethod.Post, url);

            //request.Headers.Accept.Clear();
            //request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            

            //HttpResponseMessage responseMessage;
            var client = _clientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
         

            var serialized = JsonConvert.SerializeObject(ids);
            var stringContent = new StringContent(serialized, System.Text.Encoding.UTF8, "application/json");

            //client.PostAsync()
            var response = await client.PostAsync(url, stringContent);


            return null;
            //var content = new StringContent(serialized);
            //content.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/json");
            //content.Headers.Authro

            //client.PostAsync(url, new StringContent(serialized))

            //using (responseMessage = await client.SendAsync(request))
            //{
            //    //responseMessage.EnsureSuccessStatusCode(); //TODO: look at this:https://stackoverflow.com/questions/31261849/microsoft-net-http-vs-microsoft-aspnet-webapi-client
            //    //TODO: need to gracefully handle different HTTP status codes in here
            //    if (responseMessage.StatusCode == System.Net.HttpStatusCode.NotFound)
            //    {

            //    }

            //    responseContent = await responseMessage.Content.ReadAsStringAsync();
            //    return responseContent;
            //    //objectsToReturn = Newtonsoft.Json.JsonConvert.DeserializeObject<List<T>>(responseContent);
            //}

            //return objectsToReturn;
        }
    }
}