using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Empower.Authentication
{
    public enum AppVersion
    {
        Juvenile = 1,
        Adult = 2,
        CWB = 3,
    }

    public  class Constants
    {

        public static List<string> GetTabs()
        {
            var tabs = new List<string>();
            tabs.Add("Search");
            tabs.Add("ParticipantInfo");
            tabs.Add("Supplemental");
            tabs.Add("Address");
            tabs.Add("Family");
            tabs.Add("Program");
            tabs.Add("Assessment");

            return tabs;
        }
    }
}
