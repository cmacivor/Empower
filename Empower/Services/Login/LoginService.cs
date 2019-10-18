using Empower.Authentication;
using Empower.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft;

namespace Empower.Services.Login
{
    public class LoginService : ILoginService
    {
        private readonly HttpClient _httpClient;

        public IOptions<AppSettings> _appsettings { get; set; }

        public LoginService(IOptions<AppSettings> options, HttpClient httpClient)
        {
            _appsettings = options;
            _httpClient = httpClient;
            //read this to understand why we need to set the BaseAddress in the constructor: https://stackoverflow.com/questions/51478525/httpclient-this-instance-has-already-started-one-or-more-requests-properties-ca
            _httpClient.BaseAddress = new Uri(_appsettings.Value.ApiUrl);
        }

        public async Task<AuthenticationResponse> Login(LoginParameters loginParameters)
        {
            var dict = new Dictionary<string, string>();
            dict.Add("grant_type", "password");
            dict.Add("username", loginParameters.UserName);
            dict.Add("password", loginParameters.Password);
            
            var request = new HttpRequestMessage(HttpMethod.Post, _httpClient.BaseAddress + "/token")
            {
                Content = new FormUrlEncodedContent(dict)
            };

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                //this contains the token, we'll save it to sessionStorage. 
                var result = await response.Content.ReadAsStringAsync();

                var authResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<AuthenticationResponse>(result);

                authResponse.StatusCode = System.Net.HttpStatusCode.OK;

                return authResponse;
            }


            return new AuthenticationResponse { StatusCode = response.StatusCode };
        }
    }
}
