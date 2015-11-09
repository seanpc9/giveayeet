var plaidClient = new plaid.Client("563e592abb7f38241cca3b48", "b5b24b58b18c4890ac1185c8755093", plaid.environments.tartan);

var test_bank = "bofa";
var test_username = "plaid_test";
var test_password = "plaid_good"
var test_options = {
	login_only: true,
	webhook: "http://www.giveayeet.org/recieve_data"
}
module.exports = {
	makeItFake: function () {
		var names = [
			"McDonalds",
			"Taco Bell",
			"Walmart",
			"Starbucks",
			"Harris Teeter",
			"Target",
			"Chipotle",
			"Express",
			"Duke Store",
			"Champs",
			"Bojangles",
			"Foot Locker",
			"Amazon",
			"Netflix",
			"CVS Pharmacy"
		];
		var price = Math.abs(Math.random() * 100 - Math.random() * 10);
		var myTransaction = {
			amount: parseFloat(price.toFixed(2)),
			date: "2015-11-08",
			name: names[Math.floor(Math.random() * 1000) % 14]
		}
		return myTransaction;
	},

	addUser: function (bankName, userName, password, options) {
		plaidClient.addConnectUser(bankName, {
	  		username: userName,
	  		password: password,
		}, options, function(err, mfaResponse, response) {
			if (err == null) {
				// no error occured
				console.log("User was added.\n");
				getRandomTransaction(mfaResponse.access_token);
				getAccountInfo(mfaResponse.access_token);
				return;
			}
			// Error occured. Oh no.
			console.log(err);
			if (mfaResponse != null) {
	    		 plaidClient.stepAuthUser(mfaResponse.access_token, 'tomato', {},
	    		 	function(err, mfaRes, response) {
	      				console.log(response.accounts);
	      				getRandomTransaction(response.access_token);
	    			}
	    		 );
				console();
	  		} else {
	    		// No MFA required - response body has accounts
	    		console.log(response.accounts);
	    		getRandomTransaction(response.access_token);
	  		}
		});
	},

	//function to get the last transaction. 
	getRandomTransaction: function (access_token) {
		plaidClient.getConnectUser(access_token, {
	  		gte: '30 days ago',
		}, function(err, response) {
			console.log(response);
		});
	},

	getAccountInfo: function (access_token){
		plaidClient.getInfoUser(access_token, null, function(err, response){
			console.log(response);
		});	
	},

	printMakeItFake: function() {
		console.log(makeItFake());
	},

	run20Transaction: function() {
		var offset = 0;
		for (var i = 0; i < 20; i++) {
			setTimeout(printMakeItFake, offset);
			offset += Math.floor(Math.random() * 10000 - 500);
		}
	}
};