
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
	
	MakeProfileLink: {
		value: function(memberId){
			return BungieNet.Base + "/en/Profile/254/" + memberId;
		}
	},
	
	MakeGroupLink: {
		value: function(groupId){
			return BungieNet.Base + "/en/Clan/" + groupId;
		}
	},
	
	MakePostLink: {
		value: function(postId){
			return BungieNet.Base + "/en/Forum/Post/" + postId + "/0/0";
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
				
				var c = null;
				
				for(var i = 0, l = cookies.length; i < l; ++i){
					if(cookies[i].name === name){
						c = cookies[i];
						break;
					}
				}
				
				callback(c);
				
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
					callback(null);
					return;
				}
				
				var arr = cookie.value.match(/&?lc=(.+)(?:$|&)/i);
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

	_PreferenceProxy: {
		value: null,
		writable: true
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
			
			var xhr = new XMLHttpRequest();
			xhr.setRequestHeader("X-API-Key", BungieNet.Platform._PreferenceProxy.ApiKey);
			xhr.open(method, url, true);
			xhr.timeout = BungieNet.Platform._PreferenceProxy.NetworkTimeout;
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
						xhr.send(postStr !== null ? postStr : void(0));
					}
					
				});
			}
			else{
				xhr.send(postStr !== null ? postStr : void(0));
			}
			
		
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
	
	SetPreferenceProxy: {
		value: function(proxy){
			BungieNet.Platform._PreferenceProxy = proxy;
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
	
	SendMessageByConversationId: {
		value: function(success, error, msg, conversationId){
		
			var postData = {
				body: msg,
				conversationId: conversationId
			};
			
			BungieNet.Platform._MakeRequest(
				BungieNet.PlatformPath + "/Message/SaveMessageV3/",
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
