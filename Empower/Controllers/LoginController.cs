using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Empower.Authentication;
using Empower.Models;
using Empower.Services.Login;
using Microsoft.AspNetCore.Mvc;

namespace Empower.Controllers
{
    public class LoginController : Controller
    {
        private ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        public IActionResult Authenticate()
        {
            return View(new LoginViewModel());
        }


        [HttpPost]
        public async Task<IActionResult> Authenticate(LoginViewModel loginViewModel)
        {
            if (ModelState.IsValid)
            {
                var loginParams = new LoginParameters
                {
                    UserName = loginViewModel.UserName,
                    Password = loginViewModel.Password
                };

                var loginResult = await _loginService.Login(loginParams);

                HttpContext.Session.Set<AuthenticationResponse>("AuthenticationResponse", loginResult);

                if (loginResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    TempData["SystemID"] = loginResult.systemID;
                    TempData["UserName"] = loginResult.userName;
                    //authenticate
                    return RedirectToAction("Index", "Home");
                }
                else if (loginResult.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {

                    var failedLoginModel = new LoginViewModel 
                    { 
                        ErrorMessageStyle = string.Empty, 
                        ErrorMessage = "Authentication failed. Please ensure you're using the correct user name and password." 
                    };

                    return View(failedLoginModel);
                }
                else
                {
                    var failedLoginModel = new LoginViewModel
                    {
                        ErrorMessageStyle = string.Empty,
                        ErrorMessage = Response.StatusCode +  " An error occurred while authenticating. Please try again."
                    };

                    //TODO: add Elmah and do some logging here

                    return View(failedLoginModel);
                }

            }

            return View();
        }

    }
}