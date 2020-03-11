using Empower.Authentication;
using System;
using System.Collections.Generic;
using Empower.Models;

public abstract class ViewModelBase 
{

    public string UserName { get; set; }
    public string  SystemID { get; set; }

    public string RoleID { get; set; }

    public string AppTitle { get; set; }

    public string DocumentBaseUrl { get; set; }

    public List<DocumentMenuItem> DocumentMenuItems { get; set; }

    public void GetAppTitle()
    {
        int systemID = Convert.ToInt32(SystemID);

        if (systemID == (int) AppVersion.Adult || systemID == (int)AppVersion.Juvenile)
        {
            AppTitle = "EMPOWER Referral for Services";
        }
        if (systemID == (int) AppVersion.CWB)
        {
            AppTitle = "Office of Community Wealth Building";
        }
    }

}