using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Empower.Models;
using Microsoft.AspNetCore.Mvc;

namespace Empower.Controllers 
{
    public class ServiceProgramCategoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}