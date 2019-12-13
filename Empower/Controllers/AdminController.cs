using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Empower.Models;
using Microsoft.AspNetCore.Mvc;

namespace Empower.Controllers
{
    [Route("[controller]")]
    public class AdminController : Controller
    {
        [Route("Index")] 
        [Route("{admintype}")]
        public IActionResult Index(string admintype)
        {
            var viewModel = new AdminViewModel
            {
                AdminType = admintype
            };

            return View(viewModel);
        }

    }
}