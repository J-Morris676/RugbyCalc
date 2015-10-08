'use strict';

angular.module('myApp', [])
	.controller("IndexCtrl", function($rootScope, $scope, $location, $http) {
		
		$http.get("/api/rankings").success(function(data, status) {
			$scope.rugbyRankings = data.entries;
			
			$http.get("/api/prevWeekResults").success(function(data, status) {
				$scope.thisWeekResults = data.content;
			});

		});
		
		$scope.revertResultFromRankings = function(result) {
			var homeRankingIndex = _.findIndex($scope.rugbyRankings, function(ranking) {
				return ranking.team.name === result.teams[0].name;
			});
			var awayRankingIndex= _.findIndex($scope.rugbyRankings, function(ranking) {
				return ranking.team.name === result.teams[1].name;
			});
			
			$scope.rugbyRankings[homeRankingIndex].pts = $scope.rugbyRankings[homeRankingIndex].ptsBeforeResult;
			$scope.rugbyRankings[awayRankingIndex].pts = $scope.rugbyRankings[awayRankingIndex].ptsBeforeResult;
		}
		
		$scope.applyResultToRankings = function(result) {
			var homeRankingIndex = _.findIndex($scope.rugbyRankings, function(ranking) {
				return ranking.team.name === result.teams[0].name;
			});
			var awayRankingIndex= _.findIndex($scope.rugbyRankings, function(ranking) {
				return ranking.team.name === result.teams[1].name;
			});
			
			var homeRankingScore = $scope.rugbyRankings[homeRankingIndex].pts + 3;
			var awayRankingScore = $scope.rugbyRankings[awayRankingIndex].pts;
			
			var homeScore = result.scores[0];
			var awayScore = result.scores[1];
					
			var ratingGap = Math.abs(homeRankingScore - awayRankingScore);
            var cappedDiff = Math.min(10, Math.max(-10, ratingGap));

			var drawChange = cappedDiff / 10;
            var homeChange;
			
			if (homeScore > awayScore + 15) {
				homeChange = 1.5 * (1 - drawChange);
			} else if (homeScore > awayScore) {
				homeChange = 1 - drawChange;
			} else if (homeScore == awayScore) {
				homeChange = 0 - drawChange;
			} else if (homeScore < awayScore - 15) {
				homeChange = 1.5 * (-1 - drawChange);
			} else {
				homeChange = -1 - drawChange;
			}
			if (result.events !== null && result.events.length > 0 && result.events[0].rankingsWeight) {
				homeChange *= result.events[0].rankingsWeight
			}
			var awayChange = -homeChange;
			$scope.rugbyRankings[homeRankingIndex].ptsBeforeResult = $scope.rugbyRankings[homeRankingIndex].pts;
			$scope.rugbyRankings[awayRankingIndex].ptsBeforeResult = $scope.rugbyRankings[awayRankingIndex].pts;
			$scope.rugbyRankings[homeRankingIndex].pts += homeChange;
			$scope.rugbyRankings[awayRankingIndex].pts += awayChange;
		}
	});