
//BungieNet
var BungieNet = { };
Object.defineProperties(BungieNet, {
	
	Base: {
		get: function(){
			return BungieNet.Protocol + "://" + BungieNet.Host;
		}
	},
	
	Domain: {
		value: "bungie.net"
	},
	
	Host: {
		get: function(){
			return "www." + BungieNet.Domain;
		}
	},
	
	PlatformPath: {
		get: function(){
			return BungieNet.Base + "/Platform";
		}
	},
	
	Protocol: {
		value: "https"
	},
	
	DefaultLocale: {
		value: "en"
	},
	
	MakeProfileLink: {
		value: function(memberId, callback){
			BungieNet.CurrentUser.GetLocale(function(locale){
				callback(BungieNet.Base + "/" + locale + "/Profile/254/" + memberId);
			});
		}
	},
	
	MakeGroupLink: {
		value: function(groupId, callback){
			BungieNet.CurrentUser.GetLocale(function(locale){
				callback(BungieNet.Base + "/" + locale + "/Clan/" + groupId);
			});
		}
	},
	
	MakePostLink: {
		value: function(postId, callback){
			BungieNet.CurrentUser.GetLocale(function(locale){
				callback(BungieNet.Base + "/" + locale + "/Forum/Post/" + postId + "/0/0");
			});
		}
	},
	
	FixImagePath: {
		value: function(path){
			
			if(path.length >= 1 && path[0] === "/"){
				return BungieNet.Base + path;
			}
			else{
				return path;
			}
	
		}
	}
	
});

//BungieNet.Cookies
Object.defineProperties(BungieNet, { Cookies: { value: { } } });
Object.defineProperties(BungieNet.Cookies, {

	GetAll: {
		value: function(callback){
			chrome.cookies.getAll({ domain: "." + BungieNet.Domain }, function(){
				callback.apply(null, arguments);
			});
		}
	},
	
	GetMatching: {
		value: function(predicate, callback){
			BungieNet.Cookies.GetAll(function(cookies){
			
				var arr = [];
				
				for(var i = 0, l = cookies.length; i < l; ++i){
					if(predicate(cookies[i])){
						arr.push(cookies[i]);
					}
				}
				
				callback(arr);
				
			});
		}
	},
	
	Get: {
		value: function(name, callback){
			BungieNet.Cookies.GetAll(function(cookies){
				for(var i = 0, l = cookies.length; i < l; ++i){
					if(cookies[i].name === name){
						callback(cookies[i]);
						return;
					}
				}
				callback(null);
			});
		}
	}

});

//BungieNet.CurrentUser
Object.defineProperties(BungieNet, { CurrentUser: { value: { } } });
Object.defineProperties(BungieNet.CurrentUser, {

	GetCsrfToken: {
		value: function(callback){
			BungieNet.Cookies.Get("bungled", function(cookie){
				callback(cookie !== null ? cookie.value : null);
			});
		}
	},
	
	GetMembershipId: {
		value: function(callback){
			BungieNet.Cookies.Get("bungleme", function(cookie){
				callback(cookie !== null ? cookie.value : null);
			});
		}
	},
	
	GetTheme: {
		value: function(callback){
			BungieNet.Cookies.Get("bungletheme", function(cookie){
				callback(cookie !== null ? cookie.value : null);
			});
		}
	},

	GetLocale: {
		value: function(callback){
			BungieNet.Cookies.Get("bunglelocale", function(cookie){
				
				if(cookie === null){
					callback(BungieNet.DefaultLocale);
				}
				
				var arr = cookie.value.match(/&?lc=(.{2,}?)(?:$|&)/i);
				callback(arr[1] ? arr[1] : null);
				
			});
		}
	},
	
	GetSessionCookies: {
		value: function(callback){
			BungieNet.Cookies.GetMatching(function(c){ return c.session; }, function(cookies){
				callback(cookies);
			});
		}
	}

});

//BungieNet.Platform
Object.defineProperties(BungieNet, { Platform: { value: { } } });
Object.defineProperties(BungieNet.Platform, {

	_Settings: {
		value: {
			RequestTimeout: 5000
		}
	},
	
	_AddLocaleToUrl: {
		value: function(url, callback){
			BungieNet.CurrentUser.GetLocale(function(lc){
			
				if(url.indexOf("?") !== -1){
					//A query string exists
					
					if(!/\?.*lc=.{2,}/i){
						//There is no lc parameter in the query string
						//so add it
						callback(url += "&lc=" + lc);
					}
					
				}
				else{
					//No query string exists, so add one in
					callback(url += "?lc=" + lc);
				}
				
			});
		}
	},

	_MakeRequest: {
		value: function(url, method, auth, success, error, postStr){
		
			if(typeof success !== "function"){
				success = Function.NOP;
			}
			
			if(typeof error !== "function"){
				error = Function.NOP;
			}
				
			if(typeof postStr !== "string"){
				postStr = null;
			}
			
			//Add in locale parameter
			BungieNet.Platform._AddLocaleToUrl(url, function(newUrl){
			
				var xhr = new XMLHttpRequest();
				xhr.open(method, newUrl, true);
				xhr.timeout = BungieNet.Platform._Settings.RequestTimeout;
				xhr.onreadystatechange = function(){
					
					if(this.readyState === 4){
						if(this.status === 200){
							success(this.responseText);
						}
						else{
							error({ Reason: "Network error (HTTP: " + this.status + ")" });
						}
					}
					
				};
				
				if(auth){
					BungieNet.CurrentUser.GetCsrfToken(function(token){
						
						if(token === null){
							error({ Reason: "CSRF token not set" });
						}
						else{
							xhr.withCredentials = true;
							xhr.setRequestHeader("x-csrf", token);
							xhr.send( postStr !== null ? postStr : void(0) );
						}
						
					});
				}
				else{
					xhr.send( postStr !== null ? postStr : void(0) );
				}
			
			});			
		
		}
	},
	
	_ParseJson: {
		value: function(str, success, error){
			
			var o = null;
			
			//Keep as is
			//If another error occurs inside success or error but inside
			//try{}, it eats it
			try{
				o = JSON.parse(str);
			}
			catch(ex){ }

			if(o !== null){

				if(o.ErrorCode === 1){
					success(o.Response);
				}
				else{
					error({ Reason: o.Message });
				}
			
			}
			else{
				error({ Reason: "JSON parse error" });
			}
			
		}
	},

	GetUser: {
		value: function(success, error){
			
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/User/GetBungieNetUser/",
				"GET",
				true,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				null
			);
			
		}
	},
	
	GetNotificationCounts: {
		value: function(success, error){
			
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/User/GetCounts/",
				"GET",
				true,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				null
			);
			
		}
	},
	
	GetNotifications: {
		value: function(success, error){
			
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/Notification/GetRecent/",
				"GET",
				true,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				null
			);
			
		}
	},
	
	GetMessages: {
		value: function(success, error){
			
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/Message/GetConversationsV4/1/",
				"GET",
				true,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				null
			);
			
		}
	},
	
	GetGroups: {
		value: function(success, error, memberId){
		
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/Activity/Following/Groups/",
				"GET",
				true,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				null
			);
		
		}
	},
	
	GetConversation: {
		value: function(success, error, conversationId){
			
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/Message/GetConversationThreadV3/" + conversationId + "/1/",
				"GET",
				true,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				null
			);
			
		}
	},
	
	SendMessage: {
		value: function(success, error, msg, recipients){
		
			var postData = {
				body: msg,
				membersToId: recipients
			};
		
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/Message/SaveMessageV2/",
				"POST",
				true,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				JSON.stringify(postData)
			);
		
		}
	},
	
	SearchTopics: {
		value: function(success, error, tags){
		
			var tagStr = tags
				.map(function(t){ return encodeURIComponent(t.replace(/#/g, "")); })
				.join(",");
		
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/Forum/GetTopicsPaged/0/5/0/1/0/0/?tagstring=" + tagStr,
				"GET",
				false,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				null
			);
		
		}
	},
	
	SearchUsers: {
		value: function(success, error, text){
			
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/User/SearchUsersPaged/" + encodeURIComponent(text) + "/1/",
				"GET",
				false,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				null
			);
			
		}
	},
	
	SearchGroups: {
		value: function(success, error, query){
		
			var postData = {
				itemsPerPage: 25,
				currentPage: 1,
				contents: {
					searchValue: query,
					searchType: 0
				}
			};
			
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/Group/Search/",
				"POST",
				true,
				function(str){ BungieNet.Platform._ParseJson(str, success, error); },
				error,
				JSON.stringify(postData)
			);
		
		}
	},
	
	BanhammerCount: {
		value: function(success, error){
			
			BungieNet.Platform._MakeRequest(
				BungieNet.Base + "/Admin/Reports",
				"GET",
				true,
				function(str){
					var doc = new DOMParser().parseFromString(str, "text/html");
					var elem = doc.getElementById("reviewCount");
					success(elem ? parseInt(elem.textContent, 10) : 0);
				},
				error,
				null
			);
			
		}
	}
	
});
