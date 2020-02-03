using System.Collections.Generic;
using System.Threading.Tasks;
using Empower.Configuration;
using Microsoft.Extensions.Options;

namespace Empower.Services
{
    public interface IApiClient<T>
    {
        IOptions<AppSettings> _appsettings { get; set; }
        string BaseAddress { get; set; }

        Task<List<T>> GetAllItems(string token);
    }
}