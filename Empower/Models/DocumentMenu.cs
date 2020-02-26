using System;
using System.Collections.Generic;

namespace Empower.Models 
{
    public class DocumentMenu 
    {
        public List<DocumentMenuItem> DocumentMenuItems { get; set; }
    }

    public class DocumentMenuItem 
    {
        public string Name { get; set; }

        public string FileName { get; set; }
    }
}


