//base.js

//Int32
var Int32 = function(){ };
Object.defineProperties(Int32, {
	
	MaxValue: {
		value: (function(){ return Math.pow(2, 31) - 1; })()
	},
	
	MinValue: {
		value: (function(){ return -Math.pow(2, 31); })()
	}
	
});

//Function
Function.NOP = function(){ };

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