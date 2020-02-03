using Empower.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;


namespace Empower.Services
{
    public class ApiClient<T> : IApiClient<T>
    {

        public string BaseAddress { get; set; }

        //private readonly HttpClient _httpClient;
        private readonly IHttpClientFactory _clientFactory;

        public ApiClient(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public IOptions<AppSettings> _appsettings { get; set; }

        public async Task<List<T>> GetAllItems(string token)
        {
            string responseContent;

            var objectsToReturn = new List<T>();

            var type = typeof(T);

            string typeUrlPart = type.Name;

            //TODO: refactor the applications/empowerapi to an app setting. Apparently we have to set it here instead of injecting it
            string url = $"applications/empowerapi/api/{typeUrlPart}/GetAll";

            var request = new HttpRequestMessage(HttpMethod.Get, url);

            request.Headers.Accept.Clear();
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            HttpResponseMessage responseMessage;
            var client = _clientFactory.CreateClient();

            using (responseMessage = await client.SendAsync(request))
            {
                //responseMessage.EnsureSuccessStatusCode(); //TODO: look at this:https://stackoverflow.com/questions/31261849/microsoft-net-http-vs-microsoft-aspnet-webapi-client
                //TODO: need to gracefully handle different HTTP status codes in here
                if (responseMessage.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                        
                }

                responseContent = await responseMessage.Content.ReadAsStringAsync();

                objectsToReturn = Newtonsoft.Json.JsonConvert.DeserializeObject<List<T>>(responseContent);
            }

            return objectsToReturn;
        }
    }
}