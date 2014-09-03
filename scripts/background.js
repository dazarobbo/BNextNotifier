
//Options
var Options = { };
Object.defineProperties(Options, {

	MIN_NETWORK_TIMEOUT_MS: {
		value: 1000
	},
	
	MAX_NETWORK_TIMEOUT_MS: {
		value: 10000
	},
	
	NETWORK_TIMEOUT_STEP_MS: {
		value: 1000
	},

	MIN_GLOBAL_NOTIFICATIONS_POLLING_MINS: {
		value: 1
	},
	
	MAX_GLOBAL_NOTIFICATIONS_POLLING_MINS: {
		value: 60
	},
	
	GLOBAL_NOTIFICATIONS_POLLING_STEP_MINS: {
		value: 1
	},

	MIN_USER_STATUS_POLLING_MINS: {
		value: 5
	},
	
	MAX_USER_STATUS_POLLING_MINS: {
		value: 60
	},
	
	USER_STATUS_POLLING_STEP_MINS: {
		value: 1
	},

	MIN_BANHAMMER_POLLING_MINS: {
		value: 5
	},
	
	MAX_BANHAMMER_POLLING_MINS: {
		value: 120
	},
	
	BANHAMMER_POLLING_STEP_MINS: {
		value: 1
	}
	
});


//Settings
var Settings = { };
Object.defineProperties(Settings, {

	DEFAULT_NETWORK_TIMEOUT: {
		value: 5000 //5 seconds
	},
	
	DEFAULT_GLOBAL_NOTIFICATIONS_CHECK_STATUS: {
		value: true
	},
	
	DEFAULT_GLOBAL_NOTIFICATIONS_POLLING_INTERVAL: {
		value: 60000 * 3 //3 minute
	},
	
	DEFAULT_BANHAMMER_CHECK_STATUS: {
		value: false
	},
	
	DEFAULT_BANHAMMER_POLLING_INTERVAL: {
		value: 60000 * 30 //30 minutes
	},
	
	DEFAULT_USER_CHECK_STATUS: {
		value: true
	},
	
	DEFAULT_USER_CHECK_STATUS_INTERVAL: {
		value: 60000 * 30 //30 minutes
	},
	
	DEFAULT_DISPLAY_DESKTOP_NOTIFICATIONS: {
		value: true
	},
	
	DEFAULT_ICON_TITLE: {
		value: "BNext Notifier"
	},
	
	NetworkTimeout: {

		//Stored in milliseconds

		get: function(){
			return(
				localStorage[Settings.ConstKeys.NetworkTimeout] != undefined
				? parseInt(localStorage[Settings.ConstKeys.NetworkTimeout], 10)
				: Settings.DEFAULT_NETWORK_TIMEOUT
			);	
		},
		
		set: function(v){
			localStorage[Settings.ConstKeys.NetworkTimeout] = v;
		}
	
	},
	
	CheckUserStatus: {
	
		//boolean
		
		get: function(){
			return(
				localStorage[Settings.ConstKeys.CheckUserStatus] != undefined
				? localStorage[Settings.ConstKeys.CheckUserStatus] == "true"
				: Settings.DEFAULT_USER_CHECK_STATUS
			);	
		},
		
		set: function(v){
			Application.Polling.PollUserStatus = v;
			localStorage[Settings.ConstKeys.CheckUserStatus] = v;
		}
		
	},
	
	CheckGlobalNotificationsStatus: {
	
		//boolean
		
		get: function(){
			return(
				localStorage[Settings.ConstKeys.CheckGlobalNotificationsStatus] != undefined
				? localStorage[Settings.ConstKeys.CheckGlobalNotificationsStatus] == "true"
				: Settings.DEFAULT_GLOBAL_NOTIFICATIONS_CHECK_STATUS
			);	
		},
		
		set: function(v){
			Application.Polling.PollNotificationCounts = v;
			localStorage[Settings.ConstKeys.CheckGlobalNotificationsStatus] = v;
		}
		
	},
	
	CheckBanhammerStatus: {
	
		//boolean
		
		get: function(){
			return(
				localStorage[Settings.ConstKeys.CheckBanhammerStatus] != undefined
				? localStorage[Settings.ConstKeys.CheckBanhammerStatus] == "true"
				: Settings.DEFAULT_BANHAMMER_CHECK_STATUS
			);	
		},
		
		set: function(v){
			Application.Polling.PollBanhammer = v;
			localStorage[Settings.ConstKeys.CheckBanhammerStatus] = v;
		}
		
	},
	
	UserStatusPollingInterval: {
	
		//int
		
		get: function(){
			return(
				localStorage[Settings.ConstKeys.UserStatusPollingInterval] != undefined
				? parseInt(localStorage[Settings.ConstKeys.UserStatusPollingInterval], 10)
				: Settings.DEFAULT_USER_CHECK_STATUS_INTERVAL
			);	
		},
		
		set: function(v){
			localStorage[Settings.ConstKeys.UserStatusPollingInterval] = v;
		}
		
	},
	
	GlobalNotificationsPollingInterval: {

		//int
		
		get: function(){
			return(
				localStorage[Settings.ConstKeys.GlobalNotificationsPollingInterval] != undefined
				? parseInt(localStorage[Settings.ConstKeys.GlobalNotificationsPollingInterval], 10)
				: Settings.DEFAULT_GLOBAL_NOTIFICATIONS_POLLING_INTERVAL
			);	
		},
		
		set: function(v){
			localStorage[Settings.ConstKeys.GlobalNotificationsPollingInterval] = v;
		}
		
	},
	
	BanhammerPollingInterval: {
		
		//int
		
		get: function(){
			return(
				localStorage[Settings.ConstKeys.BanhammerPollingInterval] != undefined
				? parseInt(localStorage[Settings.ConstKeys.BanhammerPollingInterval], 10)
				: Settings.DEFAULT_BANHAMMER_POLLING_INTERVAL
			);	
		},
		
		set: function(v){
			localStorage[Settings.ConstKeys.BanhammerPollingInterval] = v;
		}
		
	},
	
	DisplayDesktopNotifications: {
	
		//bool
		
		get: function(){
			return(
				localStorage[Settings.ConstKeys.DisplayDesktopNotifications] != undefined
				? localStorage[Settings.ConstKeys.DisplayDesktopNotifications] == "true"
				: Settings.DEFAULT_DISPLAY_DESKTOP_NOTIFICATIONS
			);	
		},
		
		set: function(v){
			localStorage[Settings.ConstKeys.DisplayDesktopNotifications] = v;
		}
		
	},
	
	User: {

		get: function(){
			return(
				localStorage[Settings.ConstKeys.BungieNetUser] != undefined
				? JSON.parse(localStorage[Settings.ConstKeys.BungieNetUser])
				: null
			);
		},
		
		set: function(o){
			localStorage[Settings.ConstKeys.BungieNetUser] = JSON.stringify(o);
		}
		
	},
	
	IsNinja: {
		get: function(){
			
			var u = Settings.User;
			
			if(u === null) return null;
		
			//http://static01.bungie.net/Platform/Scripts/BnetPlatform.Client.min.js
			//Globals.AclEnum.BNextForumNinja === 1
			return u.userAcls.some(function(a){ return a === 1; });
			
		}
	},
	
	LastNotificationCheck: {

		//int
		
		get: function(){
			return(
				localStorage[Settings.ConstKeys.LastNotificationCheck] != undefined
				? parseInt(localStorage[Settings.ConstKeys.LastNotificationCheck], 10)
				: null
			);	
		},
		
		set: function(v){
			localStorage[Settings.ConstKeys.LastNotificationCheck] = v;
		}
		
	},
	
	LastNotificationCount: {

		//int
		
		get: function(){
			
			var ts = localStorage[Settings.ConstKeys.LastNotificationCount] != undefined
				? localStorage[Settings.ConstKeys.LastNotificationCount]
				: null;
			
			if((ts + "").match(/^-?\d+$/) !== null){
				ts = parseInt(ts, 10);
			}
			
			return ts;
			
		},
		
		set: function(v){
			localStorage[Settings.ConstKeys.LastNotificationCount] = v;
		}
		
	}
	
});


//Settings.ConstKeys
Object.defineProperties(Settings, { ConstKeys: { value: { } } });
Object.defineProperties(Settings.ConstKeys, {
	
	BungieNetUser: {
		value: "BungieNetUser",
		writable: true
	},
	
	NetworkTimeout: {
		value: "NetworkTimeout",
		writable: true
	},
	
	CheckUserStatus: {
		value: "CheckUserStatus",
		writable: true
	},
	
	CheckGlobalNotificationsStatus: {
		value: "CheckGlobalNotificationsStatus",
		writable: true
	},
	
	CheckBanhammerStatus: {
		value: "CheckBanhammerStatus",
		writable: true
	},
	
	UserStatusPollingInterval: {
		value: "UserStatusPollingInterval",
		writable: true
	},
	
	GlobalNotificationsPollingInterval: {
		value: "GlobalNotificationsPollingInterval",
		writable: true
	},
	
	BanhammerPollingInterval: {
		value: "BanhammerPollingInterval",
		writable: true
	},
	
	DisplayDesktopNotifications: {
		value: "DisplayDesktopNotifications",
		writable: true
	},
	
	LastNotificationCheck: {
		value: "LastNotificationCheck",
		writable: true
	},
	
	LastNotificationCount: {
		value: "LastNotificationCount",
		writable: true
	}

});


//Application
var Application = { };
Object.defineProperties(Application, {

	Version: {
		get: function(){
			return chrome.runtime.getManifest().version;
		}
	},
	
	Init: {
		value: function(){
		
			Application.TitleText = Settings.DEFAULT_ICON_TITLE;
			//chrome.browserAction.setTitle({title: Settings.IconTitle});
			chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
			chrome.notifications.onClicked.addListener(Application.NotificationSubscription.ChromeListener);
			
			Settings.LastNotificationCount = "null";
			Settings.LastNotificationCheck = "null";
			
			console.log("Initialised!");
		
		}
	},
	
	TitleText: {
		set: function(text){
			chrome.browserAction.setTitle({title: String(text)});
		}
	},
	
	BadgeText: {
		set: function(text){
			chrome.browserAction.setBadgeText({text: String(text)});
		}
	},
	
	BadgeColor: {
		set: function(color){
			chrome.browserAction.setBadgeBackgroundColor({color: color});
		}
	},
	
	GetAndStoreUser: {
		value: function(){
			
			BungieNet.Platform.GetUser(function(r){
				Settings.User = r;
				Application.TitleText = "Signed in as: " + r.user.displayName + " (" + r.user.uniqueName + ")";
			});

		}
	},
	
	StartPolling: {
		value: function(){
			Application.Polling.PollNotificationCounts = Settings.CheckGlobalNotificationsStatus;	
		}
	}

});


//Application.NotificationCounts
Object.defineProperties(Application, { NotificationCounts: { value: { } } });
Object.defineProperties(Application.NotificationCounts, {
	
	_Map: {
		value: { }, //Properties can be added on the fly
		writable: true
	},
	
	SetCount: {
		value: function(name, count){
			Application.NotificationCounts._Map[name] = count;
			Application.NotificationCounts.UpdateDisplay();
		}
	},
	
	UpdateDisplay: {
		value: function(){
			
			var count = 0;
			var map = Application.NotificationCounts._Map;
			
			for(var name in map){
				count += map[name];
			}
			
			Application.BadgeText = count > 0 ? count : "";
			
		}
	}
	
});


//Application.Notifications
Object.defineProperties(Application, { Notifications: { value: { } } });
Object.defineProperties(Application.Notifications, {

	New: {
		value: function(count){
		
			if(count === null){
				chrome.notifications.clear("NEW_NOTIFICATION_ID", Function.NOP);
			}
			else{
				chrome.notifications.create("NEW_NOTIFICATION_ID", {
					type: "basic",
					title: "New Notifications",
					message: "You have " + count + " new notification" + (count != 1 ? "s" : ""),
					iconUrl: chrome.extension.getURL("resources/default_avatar.gif")
				}, Function.NOP);
			}
		
		}
	},
	
	Error: {
		value: function(text){
			
			if(text === null){
				chrome.notifications.clear("ERROR_NOTIFICATION_ID", Function.NOP);
			}
			else{
				chrome.notifications.create("ERROR_NOTIFICATION_ID", {
					type: "basic",
					title: "Error",
					message: text,
					iconUrl: chrome.extension.getURL("resources/default_avatar.gif")
				}, Function.NOP);
			}
			
		}
	}

});


//Application.NotificationSubscription
Object.defineProperties(Application, { NotificationSubscription: { value: { } } });
Object.defineProperties(Application.NotificationSubscription, {

	Listener: {
		value: function(notifId, callback){
			this.NotificationId = notifId;
			this.Callback = callback;
		}
	},
	
	Listeners: {
		value: [],
		writable: true
	},
	
	Subscribe: {
		set: function(notifyListener){
			Application.NotificationSubscription.Listeners.push(notifyListener);
		}
	},
	
	ChromeListener: {
		value: function(id){
		
			Application.NotificationSubscription.Listeners
				.filter(function(nl){ return nl.NotificationId === id; })
				.forEach(function(nl){ nl.Callback(); });
				
		}
	},
	
	

});


//Application.Polling
Object.defineProperties(Application, { Polling: { value: { } } });
Object.defineProperties(Application.Polling, {

	Ids: {
		value: {
			NotificationCounts: null,
			Banhammer: null,
			UserStatus: null
		}
	},
	
	PollNotificationCounts: {
		set: function(v){
			
			if(Application.Polling.Ids.NotificationCounts !== null){
				window.clearTimeout(Application.Polling.Ids.NotificationCounts);
				Application.Polling.Ids.NotificationCounts = null;
			}
			
			if(v === true){
				Application.Polling.Functions.NotificationCounts();
			}
			
		}
	},
	
	PollBanhammer: {
		set: function(v){
		
			if(Application.Polling.Ids.Banhammer !== null){
				window.clearTimeout(Application.Polling.Ids.Banhammer);
				Application.Polling.Ids.Banhammer = null;
			}
			
			if(v === true){
				Application.Polling.Functions.Banhammer();
			}
		
		}
	},
	
	PollUserStatus: {
		set: function(v){
		
			if(Application.Polling.Ids.UserStatus !== null){
				window.clearTimeout(Application.Polling.Ids.UserStatus);
				Application.Polling.Ids.UserStatus = null;
			}
			
			if(v === true){
				Application.Polling.Functions.UserStatus();
			}
		
		}
	}
	
});


//Application.Polling.Functions
Object.defineProperties(Application.Polling, { Functions: { value: { } } });
Object.defineProperties(Application.Polling.Functions, {

	Banhammer: {
		value: function(){
		
			if(Settings.IsNinja !== true){
				console.log("Not a ninja. Checking again in " + (Settings.BanhammerPollingInterval / 60000) + " minute(s)");
				Application.Polling.Ids.Banhammer = window.setTimeout(Application.Polling.Functions.BanhammerCounts, Settings.BanhammerPollingInterval);
				return;
			}
		
			BungieNet.Platform.GetBanhammerCount(
				function(count){
					
					if(count > 0){
						Application.BadgeText = "B" + count;
						Application.BadgeColor = [255, 255, 0, 255];
					}
					
					if(Settings.User === null){
						Application.GetAndStoreUser();
					}
					
					console.log("Success! " + count + " items. Checking banhammer again in " + (Settings.BanhammerPollingInterval / 60000) + " minute(s)");
					Application.Polling.Ids.Banhammer = window.setTimeout(Application.Polling.Functions.BanhammerCounts, Settings.BanhammerPollingInterval);
					
				},
				function(o){
					console.log(o.Reason);
					Application.Polling.Ids.Banhammer = window.setTimeout(Application.Polling.Functions.BanhammerCounts, Settings.BanhammerPollingInterval);
				}
			);
		
		}
	},
	
	NotificationCounts: {
		value: function(){
		
			BungieNet.Platform.GetNotificationCounts(
				function(o){
					
					Application.NotificationCounts.SetCount("GlobalNotifications", o.notificationCount);
					Application.Notifications.Error(null);
					
					if(o.notificationCount > 0 && o.notificationCount != Settings.LastNotificationCount){
						if(Settings.DisplayDesktopNotifications){
							Application.Notifications.New(o.notificationCount);
						}
					}
					
					if(Settings.User === null){
						Application.GetAndStoreUser();
					}
					
					Settings.LastNotificationCount = o.notificationCount;
					Settings.LastNotificationCheck = Date.now();
					
					console.log("Success! Checking global notifications again in " + (Settings.GlobalNotificationsPollingInterval / 60000) + " minute(s)");
					Application.Polling.Ids.NotificationCounts = window.setTimeout(Application.Polling.Functions.NotificationCounts, Settings.GlobalNotificationsPollingInterval);
				
				},
				function(o){

					Application.BadgeText = "X";
					
					if(Settings.LastNotificationCount != "false"){
						if(Settings.DisplayDesktopNotifications){
							Application.Notifications.Error("You might need to sign in to bungie.net to continue getting notifications (reason: " + o.Reason.toLowerCase() + ")");
						}
						Settings.LastNotificationCount = "false";
					}
					
					console.log("Error checking notifications: " + o.Reason);				
					Application.Polling.Ids.NotificationCounts = window.setTimeout(Application.Polling.Functions.NotificationCounts, Settings.GlobalNotificationsPollingInterval);
					
				}
			);
		
		}
	},
	
	UserStatus: {
		value: function(){
		
			Application.GetAndStoreUser();
			console.log("Checking user status again in " + (Settings.UserStatusPollingInterval / 60000) + " minute(s)");
			Application.Polling.Ids.UserStatus = window.setTimeout(Application.Polling.Functions.UserStatus, Settings.UserStatusPollingInterval);
		
		}
	}

});


////////////////////////////


Application.Init();
Application.Polling.PollUserStatus = Settings.CheckUserStatus;
Application.Polling.PollNotificationCounts = Settings.CheckGlobalNotificationsStatus;

