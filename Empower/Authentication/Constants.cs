using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Empower.Authentication
{
    public class Constants
    {
        enum System
        {
            CWB = 1,
            Juvenile = 2,
            Adult = 3
        }

        
        //public enum Tabs
        //{
        //    Search,
        //    ParticipantInfo,
        //    Supplemental,
        //    Address,
        //    Family,
        //    Program,
        //    Assessment
        //}

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
