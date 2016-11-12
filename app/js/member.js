$(document).ready(function(){

	$('#member_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		$('#member_page_controller').show();
	}

});

angular.module('teamform-member-app', ['firebase'])
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth',function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {




	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
		// TODO: implementation of MemberCtrl
	$scope.auth=$firebaseAuth();
	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
	if (firebaseUser) {
		$scope.uid = firebaseUser.uid;
	} else {
		console.log("Signed out");
	}
});

	$scope.userID = "";
	$scope.userName = "";
	$scope.teams = {};



	$scope.loadFunc = function() {
		var userID = $scope.userID;
		if ( userID !== '' ) {

			var refPath = getURLParameter("q") + "/member/" + userID;
			retrieveOnceFirebase(firebase, refPath, function(data) {

				if ( data.child("name").val() != null ) {
					$scope.userName = data.child("name").val();
				} else {
					$scope.userName = "";
				}


				if (data.child("selection").val() != null ) {
					$scope.selection = data.child("selection").val();
				}
				else {
					$scope.selection = [];
				}
				$scope.$apply();
			});
		}
	}



	$scope.saveFunc = function() {


		var userID = $.trim( $scope.userID );
		var userName = $.trim( $scope.userName );


		if ( userID !== '' && userName !== ''  ) {

			var newData = {
				'name': userName,
				'selection': $scope.selection
			};

			var refPath = getURLParameter("q") + "/member/" + userID;
			var ref = firebase.database().ref(refPath);

			ref.set(newData, function(){
				// complete call back
				//alert("data pushed...");

				// Finally, go back to the front-end
				window.location.href= "index.html";
			});




		}
	}

	$scope.refreshAds = function() {
		var refPath = getURLParameter("q") + "/advertisement";
		var ref = firebase.database().ref(refPath);

		// Link and sync a firebase object



		$scope.advertisements = $firebaseArray(ref);
		$scope.advertisements.$loaded()
			.then( function(data) {



			})
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});


	}

	$scope.refreshAds();


	$scope.selectall = function(){


		$scope.selection=[];
		$scope.team=[];
		var refPath = getURLParameter("q") + "/team/";
		$scope.team = $firebaseArray(firebase.database().ref(refPath));
		$scope.team.$loaded().then( function(data){

			console.log($scope.team);
			for(var team in $scope.team){
				console.log($scope.team[team].$id);
				if(typeof $scope.team[team].$id != "undefined"){
				$scope.selection.push($scope.team[team].$id);
				}
			}

			var userID = $.trim( $scope.userID );
			var userName = $.trim( $scope.userName );
			if ( userID !== '' && userName !== ''  ) {
				var newData = {
					'name': userName,
					'selection': $scope.selection
				};

				var refPath = getURLParameter("q") + "/member/" + userID;
				var ref = firebase.database().ref(refPath);

				ref.set(newData, function(){
					// complete call back
					//alert("data pushed...");

					// Finally, go back to the front-end

				})
			}
		})

	}

	$scope.refreshTeams = function() {
		var refPath = getURLParameter("q") + "/team";
		var ref = firebase.database().ref(refPath);

		// Link and sync a firebase object
		$scope.selection = [];
		$scope.toggleSelection = function (item) {
			var idx = $scope.selection.indexOf(item);
			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			else {
				$scope.selection.push(item);
			}
		}



		$scope.teams = $firebaseArray(ref);
		$scope.teams.$loaded()
			.then( function(data) {



			})
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});


	}


	$scope.refreshTeams(); // call to refresh teams...

	$scope.sizeText = 0;

	$scope.largerthan = function(val){
    return function(item){
		if ( typeof item.teamMembers != "undefined" && typeof item.teamMembers != "null")
		{return item.size - item.teamMembers.length -1 >= val;}
		else return (item.size - 1 >= val);
    }
}

}]);
