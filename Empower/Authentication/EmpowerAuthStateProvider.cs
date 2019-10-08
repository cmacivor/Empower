using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;

namespace Empower.Authentication
{
    public class EmpowerAuthStateProvider : AuthenticationStateProvider
    {
        //public Microsoft.AspNetCore.Components.AuthenticationState AuthenticationState {get;set;}
        public EmpowerAuthStateProvider()
        {
            //AuthenticationState = new Microsoft.AspNetCore.Components.AuthenticationState(new ClaimsPrincipal());
        }

        public override Task<Microsoft.AspNetCore.Components.Authorization.AuthenticationState> GetAuthenticationStateAsync()
        {
            throw new NotImplementedException();
        }

        //public override Task<Microsoft.AspNetCore.Components.AuthenticationState> GetAuthenticationStateAsync()
        //{
        //    // var identity = new  ClaimsIdentity(new[]
        //    // {
        //    //     new Claim(ClaimTypes.Name, "mrfibuli"),
        //    // }, "Fake authentication type");

        //    // var user = new ClaimsPrincipal(identity);

        //    // return Task.FromResult(new Microsoft.AspNetCore.Components.AuthenticationState(user));

        //    return Task.FromResult(AuthenticationState);
        //}
    }
}
