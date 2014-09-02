//Base

var Int32 = function(){ };
Object.defineProperties(Int32, {
	
	MaxValue: {
		value: (function(){ return Math.pow(2, 31) - 1; })()
	},
	
	MinValue: {
		value: (function(){ return -Math.pow(2, 31); })()
	}
	
});

Function.NOP = function(){ };