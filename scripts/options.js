//Import from background.js
var Settings = chrome.extension.getBackgroundPage().Settings;
var BungieNet = chrome.extension.getBackgroundPage().BungieNet;
var Application = chrome.extension.getBackgroundPage().Application;
var Options = chrome.extension.getBackgroundPage().Options;

$(document).ready(function(){

	var versionPlaceholder = $("#appVersion");
	var loginDetails = $("#loginDetails");
	
	var currNetworkTimeout = Settings.NetworkTimeout;
	var netTimeoutList = $("#lstNetworkTimeout");
	
	var currUserCheckStatus = Settings.CheckUserStatus;
	var checkUserStatus = $("#chkCheckUserStatus");
	
	var currCheckGlobNotif = Settings.CheckGlobalNotificationsStatus;
	var checkGlobNotif = $("#chkCheckGlobalNotifications");
	
	var currCheckBanhamStatus = Settings.CheckBanhammerStatus;
	var checkBanhamStatus = $("#chkCheckBanhammerStatus");
	
	var currUserStatusPollingInterval = Settings.UserStatusPollingInterval / 60000;
	var userStatusPollingList = $("#lstUserStatusInterval");
	
	var currGlobNotifPollInterval = Settings.GlobalNotificationsPollingInterval / 60000;
	var globNotifPollingList = $("#lstGlobalNotificationsInterval");
	
	var currBanhammerPollInterval = Settings.BanhammerPollingInterval / 60000;
	var banhammerPollingList = $("#lstBanhammerStatusInterval");
	
	var displayDeskNotif = $("#chkDisplayNotifications");
	
	var msg = $("#message");
	var opt;
	
	////////////////
	
	//Set version
	versionPlaceholder.text(Application.Version);
	
	//Get login
	BungieNet.Platform.GetUser(
		function(r){
			Settings.User = r;
			loginDetails.empty().append(
				$("<a>").text(r.user.displayName + " (" + r.user.uniqueName + ")").attr({
					href: BungieNet.Protocol + "://" + BungieNet.Host + "/en/view/profile/index#!page=index&mid=" + r.user.membershipId,
					target: "_blank"
				})
			);
		},
		function(o){
			loginDetails.empty().append("could not detect login state").css({
				color: "#ff0000",
				fontStyle: "italic"
			});
		}
	);
	
	//Network timeout
	for(var i=Options.MIN_NETWORK_TIMEOUT_MS; i<=Options.MAX_NETWORK_TIMEOUT_MS; i+=Options.NETWORK_TIMEOUT_STEP_MS){
		
		opt = $("<option>").text(i).val(i);
	
		if(i === currNetworkTimeout){
			opt.prop("selected", true);
		}
		
		netTimeoutList.append(opt);
		
	}
	
	//User check status
	if(currUserCheckStatus === null){
		checkUserStatus.prop("checked", Settings.DEFAULT_USER_CHECK_STATUS);
	}
	else{
		checkUserStatus.prop("checked", currUserCheckStatus);
	}
	
	//Global notifications status
	if(currCheckGlobNotif === null){
		checkGlobNotif.prop("checked", Settings.DEFAULT_GLOBAL_NOTIFICATIONS_CHECK_STATUS);
	}
	else{
		checkGlobNotif.prop("checked", currCheckGlobNotif);
	}
	
	//Banhammer check status
	if(currCheckBanhamStatus === null){
		checkBanhamStatus.prop("checked", Settings.DEFAULT_BANHAMMER_CHECK_STATUS);
	}
	else{
		checkBanhamStatus.prop("checked", currCheckBanhamStatus);
	}
	
	//User status polling interval	
	for(var i=Options.MIN_USER_STATUS_POLLING_MINS; i<=Options.MAX_USER_STATUS_POLLING_MINS; i+=Options.USER_STATUS_POLLING_STEP_MINS){
		
		opt = $("<option>").text(i).val(i);
		
		if(i === currUserStatusPollingInterval){
			opt.prop("selected", true);
		}
		
		userStatusPollingList.append(opt);
		
	}
	
	//Global notifications polling interval
	for(var i=Options.MIN_GLOBAL_NOTIFICATIONS_POLLING_MINS; i<=Options.MAX_GLOBAL_NOTIFICATIONS_POLLING_MINS; i+=Options.GLOBAL_NOTIFICATIONS_POLLING_STEP_MINS){
		
		opt = $("<option>").text(i).val(i);
		
		if(i === currGlobNotifPollInterval){
			opt.prop("selected", true);
		}
		
		globNotifPollingList.append(opt);
		
	}
	
	//Banhammer polling interval
	for(var i=Options.MIN_BANHAMMER_POLLING_MINS; i<=Options.MAX_BANHAMMER_POLLING_MINS; i+=Options.BANHAMMER_POLLING_STEP_MINS){
		
		opt = $("<option>").text(i).val(i);
		
		if(i === currBanhammerPollInterval){
			opt.prop("selected", true);
		}
		
		banhammerPollingList.append(opt);
		
	}
	
	//Display desktop notifications
	displayDeskNotif.prop("checked", Settings.DisplayDesktopNotifications);
	
	
	//Save button handler
	$("#btnSubmit").click(function(){
	
		//Update settings
		Settings.NetworkTimeout = netTimeoutList.val();
		Settings.CheckUserStatus = checkUserStatus.prop("checked");
		Settings.CheckGlobalNotificationsStatus = checkGlobNotif.prop("checked");
		Settings.CheckBanhammerStatus = checkBanhamStatus.prop("checked");
		Settings.UserStatusPollingInterval = userStatusPollingList.val() * 60000;
		Settings.GlobalNotificationsPollingInterval = globNotifPollingList.val() * 60000;
		Settings.BanhammerPollingInterval = banhammerPollingList.val() * 60000;
		Settings.DisplayDesktopNotifications = displayDeskNotif.prop("checked");
		
		//Show message
		msg.finish().show().text("Saved!");
		setTimeout(function(){ msg.fadeOut(600, function(){ msg.text(""); }); }, 1700);
		
	});
	
});