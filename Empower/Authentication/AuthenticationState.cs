using Empower.Configuration;
using Empower.Services.Login;
using Microsoft.Extensions.Options;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;


namespace Empower.Authentication
{
    public class AuthenticationState
    {
        private IJSRuntime _runtime;

        public ILoginService _loginService { get; set; }

        public AuthenticationState(IJSRuntime runTime,  ILoginService loginService)
        {
            _runtime = runTime;
            _loginService = loginService;
        }       

        // public async Task<bool> IsLoggedIn()
        // {
        //     try
        //     {
        //         var userInfo = await GetUserInfo();
        //         return userInfo != null;
        //     }
        //     catch (HttpRequestException)
        //     {
        //         return false;
        //     }
        // }

        //TODO: remove this wrapper?
        public async Task<AuthenticationResponse> Login(LoginParameters loginParameters)
        {
            var authenticationResponse = await _loginService.Login(loginParameters);

            return authenticationResponse;
        }

        // public async Task<AuthorizationData> GetAuthData()
        // {
        //     string localStorageData = await GetUserInfo();

        //     if (string.IsNullOrEmpty(localStorageData)) { return null; } //TODO: is making all this asynchronous necessary?

        //     //var authData = Newtonsoft.Json.JsonConvert.DeserializeObject<AuthorizationData>(localStorageData);

        //     //return authData;

        //     var authData = await Task.Run(() => Newtonsoft.Json.JsonConvert.DeserializeObject<AuthorizationData>(localStorageData));

        //     return authData;
        // }


        // public async Task<string> GetUserInfo()
        // {
        //     var authData = await _runtime.InvokeAsync<string>("Login.GetAuthDataFromLocalStorage");
        //     if (!string.IsNullOrEmpty(authData))
        //     {
        //         return authData;
        //     }

        //     return null;
        // }

        // public async Task Logout()
        // {
        //     //clear out the local storage
        //     await _runtime.InvokeAsync<object>("Login.RemoveAuthDataFromLocalStorage");
        // }

    }

    public class AuthenticationResponse
    {
        public string access_token { get; set; }

        public string userName { get; set; }

        public string baseApiAddress { get; set; }

        public string systemID { get; set; }

        public string roleID { get; set; }

        public System.Net.HttpStatusCode StatusCode { get; set; }
       

        public string ResponseMessage { get; set; }
    }

}
