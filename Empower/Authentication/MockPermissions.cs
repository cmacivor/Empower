using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Empower.Authentication
{
    /// <summary>
    /// to simulate a prototype of the permissions table
    /// </summary>
    public class MockPermissions
    {
        public int ID { get; set; }

        public string TabName { get; set; }

        public int RoleID { get; set; }

        public int SystemID { get; set; }

        public string Link { get; set; }


        public static Dictionary<string, bool> GetMockPermissionsData()
        {
            var permissions = new Dictionary<string, bool>();
            permissions.Add("btnSearch21Plus", false);
            permissions.Add("btnSearch", true);
            permissions.Add("btnAddNewProfile", true);
            permissions.Add("txtSearchLastName", true);
            permissions.Add("txtSearchFirstName", true);


            return permissions;
        }



        //public List<MockPermissions> GetMockPermissions()
        //{
        //    var permissions = new List<MockPermissions>();
        //    permissions.Add(new MockPermissions
        //    {
        //        TabName = "Search",
        //        RoleID = 7,
        //        SystemID = 1
        //    });
        //    permissions.Add(new MockPermissions
        //    {
        //        TabName = "SearchJuvenile",
        //        RoleID = 8,
        //        SystemID = 2
        //    });
        //    permissions.Add(new MockPermissions
        //    {
        //        TabName = "SearchCWB",
        //        RoleID = 8,
        //        SystemID = 3
        //    });

        //    return permissions;
        //}
    }
}
