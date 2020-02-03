
using System.Collections.Generic;

using System.Threading.Tasks;

namespace Empower.Services
{
    public interface IApiClient<T>
    {
        Task<List<T>> GetAllItems(string token);
    }
}