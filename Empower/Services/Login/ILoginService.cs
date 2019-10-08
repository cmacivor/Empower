using System.Threading.Tasks;
using Empower.Authentication;
using Empower.Configuration;
using Microsoft.Extensions.Options;

namespace Empower.Services.Login
{
    public interface ILoginService
    {
        IOptions<AppSettings> _appsettings { get; set; }

        Task<AuthenticationResponse> Login(LoginParameters loginParameters);
    }
}