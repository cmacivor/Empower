using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Empower.Authentication
{
    public class AuthorizationData
    {
        public string refreshToken { get; set; }

        public string access_token { get; set; }

        public bool useRefreshTokens { get; set; }

        public string userName { get; set; }
    }
}
