var app = (function() {
	var self; 
	return self = {
	    appState: "CLOSED",
	    lastUpdated: "--",
	    lastVal: "--",
	    comed5MinsURL: "http://cors.io/?https://rrtp.comed.com/api?type=5minutefeed",
	    iconCode: false,
	    refreshTimer: false,
	
	/*
	    Application constructor
	 */
	    initialize: function() {
	        this.bindEvents();
	    },
	/*
	    bind any events that are required on startup to listeners:
	*/
	    bindEvents: function() {
	    	ons.ready(this.onDeviceReady);
	    },
	    
	    onDeviceReady: function() {
	    	self._initSettingsButton();
	    	self._initResume();
	    	
	    	var storage = window.localStorage;
	    	var value = storage.getItem("LastVal");
	    	if (value !== null) {
	    		self.lastVal = storage.getItem("LastVal");
	    		self.lastUpdated = storage.getItem("LastUpdated");
	    	}
	    	
	    	var settings = document.getElementById('settings');
	    	settings.addEventListener('click', function(){
	    		self._updatePrice();
	    	});
	    	
	    	self._updatePrice();
	    },

	    _initResume: function(){
	    	document.addEventListener("resume", function(){
	    		self._updatePrice();
	    	}, false);
	    },
	    
	    _initSettingsButton: function() {	
	    },
	    
	    _kelvinToF: function(k) {
	    	return Math.round(k * 9 / 5 - 459.67);
	    },
	    
	    _updatePrice: function(callback = false) {
    		if (self.refreshTimer) clearTimeout(self.refreshTimer);
    		self.refreshTimer = setTimeout(self._updateWeather, 60*60*1000); // refresh every hour
	    	var comedPrices = $.ajax({ 
	    		url: app.comed5MinsURL,
	    		dataType: "json",
	    		crossDomain: true,
	    	});
	    		    	
	    	comedPrices.done(function(data) {
	    		self.lastVal = data[0]['price'];
	    		self.lastUpdated = data[0]['millisUTC'];
	    		var date = new Date(parseInt(self.lastUpdated));
	    		var hours = date.getHours();
	    		var ampm = hours >= 12 ? 'PM' : 'AM';
	    		hours = hours % 12;
	    		hours = hours ? hours : 12;
	    		var minutes = "0" + date.getMinutes();
	    		var seconds = "0" + date.getSeconds();

	    		// Will display time in 10:30:23 format
	    		var formattedTime = hours + ':' + minutes.substr(-2) + ':' + " " + ampm;
	    		
	    		var storage = window.localStorage;
	    		storage.setItem("LastVal", self.lastVal);
	    		storage.setItem("LastUpdated", self.lastUpdated);
	    		
	    		$('#now-temp').fadeOut('slow', function() {
	    		    $('#now-temp').html(self.lastVal + "&cent");
	    		    $('#now-temp').fadeIn('slow');
	    		});
	    		$('#last-upadted-data').fadeOut('slow', function() {
	    		    $('#last-upadted-data').html("Last Updated: " + formattedTime + "");
	    		    $('#last-upadted-data').fadeIn('slow');
	    		});
	    		if (callback) callback();
	    	}); // End of forecastWeather.done
	    }
	    	    
	}
})(); // end of app
