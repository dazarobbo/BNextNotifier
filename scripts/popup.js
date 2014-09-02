//Import from background.js
var Settings = chrome.extension.getBackgroundPage().Settings;
var BungieNet = chrome.extension.getBackgroundPage().BungieNet;
var Application = chrome.extension.getBackgroundPage().Application;

var Tabs = {
	Notifications: {
		Element: null,
		List: null,
		Toolbar: null
	},
	Messages: {
		Element: null,
		List: null,
		Toolbar: null
	},
	Groups: {
		Element: null,
		List: null,
		Toolbar: null
	},
	Search: {
		Element: null,
		Toolbar: null
	}
};

/**
 * Generates a relative timestamp for this date around the current date
 *
 * @example "in 2 hours", "5 days ago", "in 10 years", etc...
 * @returns {String}
 */
Date.prototype.ToRelativeTimestamp = function(){
	
	var diff = Date.now() - this.getTime();
	var isPast = diff >= 0;
	var seconds = Math.abs(diff) / 1000;
	var minutes = seconds / 60;
	var hours = minutes / 60;
	var days = hours / 24;
	var months = days / 31;
	var years = months / 12;
	
	var str = !isPast ? "in " : "";
	
	if(years >= 1){
		str += Math.floor(years) + " year" + (Math.floor(years) !== 1 ? "s" : "");
	}
	else if(months >= 1){
		str += Math.floor(months) + " month" + (Math.floor(months) !== 1 ? "s" : "");
	}
	else if(days >= 1){
		str += Math.floor(days) + " day" + (Math.floor(days) !== 1 ? "s" : "");
	}
	else if(hours >= 1){
		str += Math.floor(hours) + " hour" + (Math.floor(hours) !== 1 ? "s" : "");
	}
	else if(minutes >= 1){
		str += Math.floor(minutes) + " minute" + (Math.floor(minutes) !== 1 ? "s" : "");
	}
	else{
		str += Math.floor(seconds) + " second" + (Math.floor(seconds) !== 1 ? "s" : "");
	}
	
	return str + (isPast ? " ago" : "");

}

function TabSwitcher(tab){
	$(".active").removeClass("active");
	tab.Element.addClass("active");
}

function HandleTabSwitching(){
	
	Tabs.Notifications.Toolbar.click(function(){
		TabSwitcher(Tabs.Notifications);
		DisplayNotifications();
	});
	
	Tabs.Messages.Toolbar.click(function(){
		TabSwitcher(Tabs.Messages);
		DisplayMessages();
	});
	
	Tabs.Groups.Toolbar.click(function(){
		TabSwitcher(Tabs.Groups);
		DisplayGroups();
	});
	
	Tabs.Search.Toolbar.click(function(){
		TabSwitcher(Tabs.Search);
		DisplaySearch();
	});
	
}

function GetHooks(){

	Tabs.Notifications.Element = $("#notificationsTab");
	Tabs.Notifications.List = $("#notificationList");
	Tabs.Notifications.Toolbar = $("#btnNotifications");
	
	Tabs.Messages.Element = $("#messagesTab");
	Tabs.Messages.List = $("#messageList");
	Tabs.Messages.Toolbar = $("#btnMessages");
	
	Tabs.Groups.Element = $("#groupsTab");
	Tabs.Groups.List = $("#groupList");
	Tabs.Groups.Toolbar = $("#btnGroups");
	
	Tabs.Search.Element = $("#searchTab");
	Tabs.Search.Toolbar = $("#btnSearch");
	
}



function DisplayNotifications(){

	Tabs.Notifications.List.empty().append("<li>Loading...</li>");

	BungieNet.Platform.GetNotifications(
		function(r){
	
			//Globals.NotificationType = {MESSAGE: 1,FORUM_REPLY: 2,NEW_ACTIVITY_ROLLUP: 3,SETTINGS_CHANGE: 4,GROUP_ACCEPTANCE: 5,GROUP_JOIN_REQUEST: 6,FOLLOW_USER_ACTIVITY: 7,FRIEND_USER_ACTIVITY: 8,FORUM_LIKE: 9,FOLLOWED: 10,GROUP_BANNED: 11,BANNED: 12,UNBANNED: 13,GROUP_OPEN_JOIN: 14,WARNED: 20};
			
			//1 Message
			//2 Forum Reply
			//3 New activity rollup (NOT IMPLEMENTED)
			//4 Settings changed
			//5 Group accepted
			//6 Group join request
			//7 Follow user (NOT IMPLEMENTED)
			//8 Friend activity (NOT IMPLEMENTED)
			//9 Like
			//10 Followed
			//11 Group banned (NOT IMPLEMENTED)
			//12 Banned (NOT IMPLEMENTED)
			//13 Unbanned (NOT IMPLEMENTED)
			//14 Group open join (NOT IMPLEMENTED)
			//20 Warned (NOT IMPLEMENTED)

			//Update badge
			Application.NotificationCounts.SetCount("GlobalNotifications", 0);
	
			//Clear the loader text
			Tabs.Notifications.List.empty();
	
			var item;
			var user;

			r.notifications.forEach(function(n){
				
				user = n.memberInitiated != undefined ? n.memberInitiated : null;
				item = $("<li></li>")
					.addClass(n.isNew ? "newNotification" : "")
					.append(
					
						$("<a>").attr({
							title: user !== null ? user.displayName : "HFCS",
							target: "_blank",
							href: user !== null ? BungieNet.MakeProfileLink(user.membershipId) : BungieNet.MakeGroupLink(121)
						}).append(
							$("<img>").attr("src", function(){
								
								if(user === null){
									user = { profilePicturePath: "/img/profile/avatars/group/033.png" };
								}
								
								return BungieNet.FixImagePath(user.profilePicturePath);
								
							}())
						),
						
						$("<div>").html(function(){
				
							var html = $("<p>").html(n.relatedItemDetail);
							var str = "";
							
							if(n.notificationType == 1){
							
								str = $("<a>").text(user.displayName).attr({
									href: BungieNet.MakeProfileLink(user.membershipId),
									target: "_blank"
								})[0].outerHTML;
								
								str += " sent you a new Private Message";
								
							}
							else if(n.notificationType == 2){
							
								var replyCount = parseInt(n.relatedItemDetail.match(/(\d+) repl(?:y|ies)/i)[1], 10);
								
								if(replyCount === 1){
								
									str = $("<a>").text(user.displayName).attr({
										href: BungieNet.MakeProfileLink(user.membershipId),
										target: "_blank"
									})[0].outerHTML + " replied";
								
								}
								else{
									str = replyCount + " new repl" + (replyCount != 1 ? "ies" : "y");
								}
								
								str += " to your " + $("<a>").text("post").attr({
									href: BungieNet.MakePostLink(n.relatedItemId),
									target: "_blank"
								})[0].outerHTML;
							
							}
							else if(n.notificationType == 3){
								console.log("NOT IMPLEMENTED: 3");
								console.log(n);
							}
							else if(n.notificationType == 4){
								str = $("<a>").text("Your settings have been updated").attr({
									href: BungieNet.Base + "/en/User/Edit",
									target: "_blank"
								})[0].outerHTML;
							}
							else if(n.notificationType == 5){
					
								str = $("<a>").text(user.displayName).attr({
									href: BungieNet.MakeProfileLink(user.membershipId),
									target: "_blank"
								})[0].outerHTML;
								
								str += " has accepted your request to join ";
								
								str += $("<a>").text(n.notificationDetail.match(/(\S+)/)[1]).attr({
									href: BungieNet.MakeGroupLink(n.groupId),
									target: "_blank"
								})[0].outerHTML;
					
							}
							else if(n.notificationType == 6){

								str = $("<a>").text(user.displayName).attr({
									href: BungieNet.MakeProfileLink(user.membershipId),
									target: "_blank"
								})[0].outerHTML;
									
								str += " has requested permission to join ";
								
								str += $("<a>").text(n.notificationDetail.match(/(\S+)/)[1]).attr({
									href: BungieNet.Base + "/en/Clan/Pending/" + n.groupId,
									target: "_blank"
								})[0].outerHTML;
								
							}
							else if(n.notificationType == 7){
								console.log("NOT IMPLEMENTED: 7");
								console.log(n);
							}
							else if(n.notificationType == 8){
								console.log("NOT IMPLEMENTED: 8");
								console.log(n);
							}
							else if(n.notificationType == 9){

								var likeCount = parseInt(n.relatedItemDetail.match(/(\d+) pe(?:rson|ople)/i)[1], 10);
								
								if(likeCount === 1){
								
									str = $("<a>").text(user.displayName).attr({
										href: BungieNet.MakeProfileLink(user.membershipId),
										target: "_blank"
									})[0].outerHTML + " likes"
									
								}
								else{
									str = likeCount + " people like";
								}
								
								var a = $(html).find("a").first();
								
								//Fix for invisible chars
								if(/^[\xad\s]+$/ig.test(a.text())){
									a.text("post");
								}
								
								str += " your ";
								
								var link = $("<a>").attr({
									href: BungieNet.MakePostLink(n.relatedChildItemId),
									target: "_blank"
								});

								//Might be some weirdness here
								
								if(a.text() !== "post"){
									str += "post ";
									link.text(a.text());
								}
								else{
									link.text("post");
								}
								
								str += link[0].outerHTML;
								
							}
							else if(n.notificationType == 10){
								
								str = $("<a>").text(user.displayName).attr({
									href: BungieNet.MakeProfileLink(user.membershipId),
									target: "_blank"
								})[0].outerHTML + " followed you";
								
							}
							else if(n.notificationType == 11){

								str = "You have been banned from ";
								
								str += $("<a>").text(html.find("a:first").text().trim()).attr({
									href: BungieNet.MakeGroupLink(n.groupId),
									target: "_blank"
								})[0].outerHTML;
								
								str += " by ";
								
								str += $("<a>").text(user.displayName).attr({
									href: BungieNet.MakeProfileLink(user.membershipId),
									target: "_blank"
								})[0].outerHTML;
								
								str += " for the following reason: " + $("<p>").text(n.notificationDetail).html();
							
							}
							else if(n.notificationType == 12){
								console.log("NOT IMPLEMENTED: 12");
								console.log(n);
							}
							else if(n.notificationType == 13){
								console.log("NOT IMPLEMENTED: 13");
								console.log(n);
							}
							else if(n.notificationType == 14){
								console.log("NOT IMPLEMENTED: 14");
								console.log(n);
							}
							else if(n.notificationType == 20){

								str = "You have received a warning from the bungie.net moderators for violating the ";
								str += html.find("p:first").text().match(/violating the \"(.+)\" clause/i)[1].toLowerCase(); 
								str += " rule. The ";
								str += $("<a>").text("content").attr({
									href: BungieNet.Base + html.find("p>a:eq(1)").attr("href"),
									target: "_blank"
								})[0].outerHTML;
								str += " has been removed. Please refer to the ";
								str += $("<a>").text("Code of Conduct").attr({
									href: BungieNet.Base + "/en/View/bungie/conduct",
									target: "_blank"
								})[0].outerHTML;
								str += " for more information.";
							
							}
							
							return str;
							
						}())
				
					);
				
				var d = new Date(n.createdDate);
				
				item.append($("<p>").addClass("clearfix"));
				item.append($("<time>").attr("title", d.toLocaleString()).text(d.ToRelativeTimestamp()));
				item.append($("<p>").addClass("clearfix"));
				
				Tabs.Notifications.List.append(item);
				
			});
		
		},
		function(o){
			Tabs.Notifications.List.empty().append($("<li></li>").text("Error: " + o.Reason));
		}
	);

}

function DisplayConversation(pm, conv){
	
	conv.empty();
	var list = $("<ul>");
	var author;
	
	BungieNet.Platform.GetConversation(
		function(r){
	
			conv.append(
				$("<h5>").text("New Message"),
				$("<div>").append(
					$("<textarea>").attr("placeholder", "Write a message...")
				),
				$("<a>").attr("href", "#").text("send").click(function(){
					
					var msg = $(this).prev().find("textarea").first().val();
					var btn = $(this).parent().siblings("a").first();
					
					if(msg.length === 0){
						alert("Empty messsage!");
						return;
					}
					
					BungieNet.Platform.SendMessage(
						$(this).prev().find("textarea").first().val(),
						pm.membersToId.map(function(m){ return m.membershipId; }),
						function(r){
							btn.trigger("click");
							setTimeout(function(){ btn.trigger("click"); }, 200);
						},
						function(o){
							alert("Couldn't send message: " + o.Reason);
						}
					);
					
				}),
				$("<p>").addClass("clearfix")
			);
	
			r.results.forEach(function(m){
			
				author = r.users[m.memberFromId];

				list.append($("<li>").css("list-style-type", "none").append(
					////
					
					$("<div>")
						.addClass("message")
						.addClass(m.memberFromId == Settings.User.user.membershipId ? "me" : "notme")
						.append(
						
							$("<h5>").append(
								$("<a>").text(author.displayName).attr({
									href: BungieNet.MakeProfileLink(author.membershipId),
									target: "_blank"
								})
							),
						
							$("<a>").attr({
								href: BungieNet.MakeProfileLink(author.membershipId),
								target: "_blank"
							}).append(
								$("<img>").attr({
									title: author.displayName,
									src: BungieNet.FixImagePath(author.profilePicturePath)
								})
							),
							
							$("<p>").html(m.body),
							
							(function(){
								var d = new Date(m.dateSent);
								return $("<time>").attr("title", d.toLocaleString()).text(d.ToRelativeTimestamp());
							})()
					
						)
						
					////
				));
			});
	
			conv.append(list, $("<p>").addClass("clearfix"));
			conv.slideDown();
			
		},
		function(o){
			list.append($("<li>").text("Error: " + o.Reason));
		},
		pm.detail.conversationId
	);
	
}

function DisplayMessages(){

	Tabs.Messages.List.empty().append("<li>Loading...</li>");
	
	BungieNet.Platform.GetMessages(
		function(r){
		
			Tabs.Messages.List.empty();
		
			r.results.forEach(function(pm){
				Tabs.Messages.List.append(

					$("<li></li>").append(
					
						$("<a>").text("expand").clickToggle(
							function(){
								DisplayConversation(pm, $(this).siblings(".conversation"));		
								$(this).text("collapse");
							},
							function(){
								$(this).text("expand");
								$(this).siblings(".conversation").slideUp();
							}
						),
					
						$("<p>").html((function(){
						
							var str = "";
						
							pm.participants
								.filter(function(u){ return u.membershipId != Settings.User.user.membershipId; })
								.sort(function(u1, u2){ return u1.membershipId === pm.detail.starter ? -1 : 1; })
								.forEach(function(u, i, arr){
									
									var theUser = r.users[u.membershipId];
									
									str += $("<a>").text(theUser.displayName).attr({
										href: BungieNet.MakeProfileLink(theUser.membershipId),
										target: "_blank"
									})[0].outerHTML;
									
									if(i !== arr.length - 1){
										str += "; ";
									}
									
								});
								
							return str;
							
						})()),
						
						(function(){
							var d = new Date(pm.detail.lastMessageSent);
							return $("<time>").css("font-weight", !pm.detail.isRead ? "bold" : "normal").text(d.ToRelativeTimestamp()).attr("title", d.toLocaleString());
						})(),
						
						$("<div>").addClass("conversation")
					
					)
					
				);
			});
		
		},
		function(o){
			Tabs.Messages.List.empty().append("<li>Error: " + o.Reason + "</li>");
		}
	);

}

function DisplayGroups(){
	
	Tabs.Groups.List.append("<li>Loading...</li>");
	
	BungieNet.Platform.GetGroups(
		function(r){
		
			Tabs.Groups.List.empty();
			
			r.results.sort(function(g1, g2){
			
				var n1 = g1.detail.name.toLowerCase();
				var n2 = g2.detail.name.toLowerCase();
			
				return n1.localeCompare(n2);
			
			}).forEach(function(g){
				Tabs.Groups.List.append(
					
					$("<li></li>")
						.append(
							
							$("<img>").attr("src", BungieNet.FixImagePath(g.detail.avatarPath)), 
							$("<div>").append(
								
								$("<h4>").text(g.detail.name),
								$("<p>").html(g.detail.about.replace(/\[.+\].+\[\/.+\]/g, "")),
								(function(){
									
									if(g.currentUserStatus.membershipStatus.Response.isMember &&
									   g.currentUserStatus.membershipStatus.Response.memberType !== 0 &&
									   g.detail.pendingMemberCount > 0){
									   
										return $("<span>").text(
											g.detail.pendingMemberCount + " pending member" +
											(g.detail.pendingMemberCount != 1 ? "s" : "")
										);
										
									}
									else{
										return "";
									}
									
								})()
								
							)
					
					)
					.click(function(){
						window.open(BungieNet.MakeGroupLink(g.detail.groupId), "_blank");
					})
					
				);
			});
		
		},
		function(o){
			Tabs.Groups.List.empty().append("<li>Error: " + o.Reason + "</li>");
		}
	);
	
}

function DisplaySearch(){

	var input = $("#searchInput");
	var loader = $("#searchLoader");
	var resultContainer = $("#searchResultsContainer");
	var searchTermDisplay = $("#searchResultsSearchTerm");
	
	var topicsList = $("#searchTopicsList");
	var topicsListCounter = $("#searchTopicsListResultCount");
	
	var userList = $("#searchUsersList");
	var userListCounter = $("#searchUsersListResultCount");
	
	var groupList = $("#searchGroupsList");
	var groupListCounter = $("#searchGroupsListResultCount");

	var _searching = 0;
	
	function _RegisterDoneSearch(){
		if(++_searching >= 3){
			loader.hide();
		}
	}
	
	input.focus();
	
	input.keypress(function(evt){
		
		if(evt.which !== 13){
			return;
		}
		loader.show();
		_searching = 0; 
		//
	
		searchTermDisplay.text(input.val());
	
		[topicsList, userList, groupList].forEach(function(l){ l.empty(); });
		[topicsListCounter, userListCounter, groupListCounter].forEach(function(c){ c.text("").attr("title", ""); });
	
		BungieNet.Platform.SearchTopics(
			function(r){
				
				topicsListCounter.text(" - " + r.results.length + " result" + (r.results.length !== 1 ? "s" : ""));
				
				var user;
				var d;
				
				r.results.forEach(function(t){
				
					user = r.authors.filter(function(a){ return a.membershipId == t.authorMembershipId; })[0];
					d = new Date(t.creationDate);
					topicsList.append($("<li>").append(

						$("<a>").append(
							$("<img>").attr({
								src: BungieNet.FixImagePath(user.profilePicturePath),
								//src: (function(){
								//	return user.profilePicturePath[0] === "/" ? (BungieNet.Protocol + "://" + BungieNet.Host + user.profilePicturePath) : user.profilePicturePath;
								//})(),
								title: user.displayName
							})
						).attr({
							target: "_blank",
							href: BungieNet.MakeProfileLink(user.membershipId)
						}),
						
						$("<div>").append(
							$("<a>").text($("<div>").html(t.subject).text()).attr({
								target: "_blank",
								href: BungieNet.MakePostLink(t.postId)
							}),
							$("<p>").text(
								t.topicReplyCount + " repl" + (t.topicReplyCount != 1 ? "ies" : "y")
							)
						),
						
						$("<p>").addClass("clearfix"),
						$("<time>").text("created " + d.ToRelativeTimestamp()).attr("title", d.toLocaleString()),
						$("<p>").addClass("clearfix")
						
					));
					
				});
				
				_RegisterDoneSearch();
				
			},
			function(o){
				_RegisterDoneSearch();
				topicsListCounter.text(" - error").attr("title", o.Reason);
			},
			input.val().replace(/[^a-z0-9 ]/gi, " ").split(" ").filter(function(t){ return t.length > 0; })
		);
		
		BungieNet.Platform.SearchUsers(
			function(r){
				
				userListCounter.text(" - " + r.results.length + " result" + (r.results.length !== 1 ? "s" : ""));
				var d;
				
				//Sort by account age
				r.results.sort(function(a, b){
					var da = new Date(a.firstAccess);
					var db = new Date(b.firstAccess);
					if(da < db) return -1;
					if(da > db) return 1;
					return 0;
				});
				
				r.results.forEach(function(u){
					
					//Skip ignored users
					if(u.context.ignoreStatus.isIgnored){
						return;
					}
					
					d = new Date(u.firstAccess);
					
					userList.append($("<li>").append(
						
						$("<a>").append(
							$("<img>").attr({
								src: BungieNet.FixImagePath(u.profilePicturePath),
								title: u.displayName
							})
						).attr({
							target: "_blank",
							href: BungieNet.MakeProfileLink(u.membershipId)
						}),
						
						$("<div>").append(
							$("<a>").text(u.displayName).attr("title", u.uniqueName).attr({
								target: "_blank",
								href: BungieNet.MakeProfileLink(u.membershipId)
							}),
							$("<br>"),
							u.followerCount + " follower" + (u.followerCount != 1 ? "s" :"")
						),
						
						$("<p>").addClass("clearfix"),
						$("<time>").attr("title", d.toLocaleString()).text("member for " + d.ToRelativeTimestamp().replace(/ ago/, "")),
						$("<p>").addClass("clearfix")
						
					));
				});
				
				_RegisterDoneSearch();
				
			},
			function(o){
				_RegisterDoneSearch();
				userListCounter.text(" - error").attr("title", o.Reason);
			},
			input.val()
		);
		
		BungieNet.Platform.SearchGroups(
			function(r){
				
				groupListCounter.text(" - " + r.results.length + " result" + (r.results.length !== 1 ? "s" : ""));
				
				var d;

				//Sort by group age
				r.results.sort(function(a, b){
					var da = new Date(a.detail.creationDate);
					var db = new Date(b.detail.creationDate);
					if(da > db) return 1;
					if(da < db) return -1;
					return 0;
				});
				
				r.results.forEach(function(g){
					
					d = new Date(g.detail.creationDate);
					
					groupList.append($("<li>").append(
						
						$("<a>").append(
							$("<img>").attr({
								src: (function(){
									return g.detail.avatarPath[0] === "/" ? (BungieNet.Base + g.detail.avatarPath) : g.detail.avatarPath;
								})(),
								title: g.detail.name.replace(/\s+$/g, "")
							})
						).attr({
							target: "_blank",
							href: BungieNet.MakeGroupLink(g.detail.groupId)
						}),
						
						$("<div>").append(
							$("<a>").text(g.detail.name.replace(/\s+$/g, "")).attr("title", g.detail.name.replace(/\s+$/g, "")).attr({
								target: "_blank",
								href: BungieNet.MakeGroupLink(g.detail.groupId)
							}),
							$("<br>"),
							g.detail.memberCount + " member" + (g.detail.memberCount != 1 ? "s" : "")
						),
						
						$("<p>").addClass("clearfix"),
						$("<time>").attr("title", d.toLocaleString()).text("created " + d.ToRelativeTimestamp()),
						$("<p>").addClass("clearfix")
						
					));
					
				});
				
				_RegisterDoneSearch();
				
			},
			function(o){
				_RegisterDoneSearch();
				groupListCounter.text(" - error").attr("title", o.Reason);
			},
			input.val()
		);
		
		resultContainer.show();
		
	});

}


document.addEventListener("DOMContentLoaded", function(){

	//Always remove the new notification when the popup is clicked
	Application.Notifications.New(null);

	GetHooks();
	HandleTabSwitching();

	//By default, show notifications
	TabSwitcher(Tabs.Notifications);
	DisplayNotifications();
	
});

