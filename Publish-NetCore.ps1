param(    
    #[Parameter(Mandatory = $true)]
    [string] $package = "C:\Users\macivoce\Documents\WebDeploy\Packages\Empower\build.2019.10.18.170505\Empower.zip",

	#[Parameter(Mandatory = $true)]
	[string] $appPool = "Empower",

	#[Parameter(Mandatory = $true)]
	[string] $siteName = "justiceservicesdev",

	#[Parameter(Mandatory = $true)]
	[string] $serverName = "DIT-WEBINT01-DV",

	#[Parameter(Mandatory = $true)]
	[string] $site = "justiceservicesdev/applications/Empower"
)
Add-PSSnapin WDeploySnapin3.0

Import-Module WebAdministration

$block = {Stop-WebSite $args[0]; }
$session = New-PSSession -ComputerName $serverName -Credential RICHVA\macivoce
Invoke-Command -Session $session -ScriptBlock $block -ArgumentList $siteName


$createAppPoolCommand = {

	$appPool = $args[0] 
	$runtime = "v4.0"
	$pipeline = "Integrated"
	$identity = 4

	#create an unmanaged app pool, if it doesn't exist already
	 if (Test-Path ("IIS:\AppPools\{0}" -f $appPool)) {
				Write-Host ("Stopping application pool: {0}." -f $appPool)
				Stop-WebAppPool -Name $appPool
	}
	if (Test-Path ("IIS:\AppPools\{0}" -f $appPool)) {
				Write-Host ("Deleting application pool: {0}." -f $appPool)
				Remove-WebAppPool -Name $appPool
			} else {
				Write-Host ("Existing application pool not found: {0}." -f $appPool)
			}

	#note that the app pool gets set to ApplicationPoolIdentity, with a value of 4. Read this: https://docs.microsoft.com/en-us/iis/configuration/system.applicationHost/applicationPools/add/processModel
	if (!(Test-Path ("IIS:\AppPools\{0}" -f $appPool))) {
		Write-Host ("Creating application pool: {0}." -f $appPool)
		New-WebAppPool -Name $appPool -Force | Format-Table
	} else {
		Write-Host ("Existing application pool found: {0}." -f $appPool)
	}
	Write-Host ("Setting application pool properties. runtime: {0}, pipeline: {1}, identity: {2}." -f $runtime, $pipeline, $identity)
	Set-ItemProperty ("IIS:\AppPools\{0}" -f $appPool) -Name managedRuntimeVersion -Value $runtime
	if ($pipeline -eq "Integrated") {
		Set-ItemProperty ("IIS:\AppPools\{0}" -f $appPool) -Name managedPipelineMode -Value 0
	} else {
		Set-ItemProperty ("IIS:\AppPools\{0}" -f $appPool) -Name managedPipelineMode -Value 1
	}
	Set-ItemProperty ("IIS:\AppPools\{0}" -f $appPool) -Name processModel.identityType -Value  $identity
}


Invoke-Command -Session $session -ScriptBlock $createAppPoolCommand -ArgumentList $appPool 


#TODO: once in the CORDeploy solution, we'd use the Get-CorPublishSettings function to do this
$publishSettingsFile  = "C:\Users\macivoce\AppData\Roaming\Richmond DIT\CorDeploy\justiceservicesdev_dit-webint01-dv.publishsettings"


Restore-WDPackage $package -DestinationPublishSettings $publishSettingsFile -Parameters @{ "IIS Web Application Name"="$site" }


$setAppPoolCmd = {
	$appName = $args[0]

	$siteName = $args[1]

	Set-ItemProperty IIS:\Sites\$siteName\applications\$appName applicationPool $appName

	$appPoolState = Get-WebAppPoolState $appName
	if ($appPoolState.Value -eq "Started") {
		Write-Host "$appName AppPool already running."
	}
	else {
		Write-Host "app pool is stopped. Restarting..."
		Start-WebAppPool -Name $appName
	}
}

Invoke-Command -Session $session -ScriptBlock $setAppPoolCmd -ArgumentList $appPool, $siteName


$restartWebSiteCmd = {

	$siteName = $args[0]

	Start-Website -Name $siteName

}

Invoke-Command -Session $session -ScriptBlock $restartWebSiteCmd -ArgumentList $siteName








