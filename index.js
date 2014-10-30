
/* 新增提案請往下捲動  */


Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


var glassyApp = angular.module('glassyApp', ['ngStorage','glassyMainController']);

glassyApp.directive('glaTopic', function(){
  return {
      restrict:'A',
      template: ''
  }
}).filter('wanted', function(){
  return function(list, key){
    return list.filter(function(o){return (o.n + o.l + o.tag + o.h).indexOf(key) > -1 });
  }
}).directive('focus',

function($timeout) {

return {
  scope : {
     trigger : '@focus'
 },
 link : function(scope, element) { 
 scope.$watch('trigger', function(value) {
  
  if (value === "true") {
   
   $timeout(function() {
   
   element[0].focus();

   });
  }
 });
   }

  };

 }

); 


function voteCtrl($scope, $sce, $hack, $localStorage, $sessionStorage, $filter) {

//  $scope.myDataSrc = 'https://ethercalc.org/glassyGD.csv';

/* 新增提案請加到改這裡  */
/* { 格式仿照原有的，請記得加大括號和逗號 ^_^ } */


/* todo:   'gm'->google moderator   'lo' -> loomio  */


/*
  $scope.topicLevels = [
    {n:'世界生態', d: '全球化的生態，經濟，外交脈絡'},
    {n:'國家認同', d: '國家認同是民主的前題，不是民主的對象。認同不能也不會為民主解決。認同是國家發展民主不可或缺的。中華民國這個問題，比起20年30前要進步了，認同問題逐漸大家瞭解什麼要認同，朝向有共同的歷史經驗，這樣的發展。'},
    {n:'基本價值', d: '一個國家會不會討論民主是不是要人權，是不會的。制衡也是民主國家的基本價值。法治的法，不是法律，是基本的遊戲規則'},
    {n:'政治共識', d: '打麻將也要先講好規則，跟隔壁打不一樣，跟我打有跟我打規則，要是所有競爭者能接收的共識和規則，不管是三權還是五院，正當程序的原則，是民主政治裡面，看似簡單，其實很複雜的問題'},
    {n:'政治體制', d: '競選經費限制，政黨補助金，內閣制等等'},  // 4 
    {n:'政黨理念', d: '在整合的時候，不是整合許多小黨成為一個政黨，不是把各團體整合成一個政團。一開始就應該把政策和標題列出來。不斷討論的議題。'}, //5
    {n:'號召與競選', d: '競選方面的技術問題'}
  ];  */

   $scope.acts = [];
     


/********************/


  $scope.fromURL = function(url) {
    return $sce.trustAsResourceUrl(url);
    alert("a");
  }

  $scope.mySearch = location.hash.replace('#','');


 //  console.log($scope.acts);

   $scope.localStorage = $localStorage.$default({
 //   acts: $scope.acts,
 //   actsNoted: $scope.acts,
    myWatches: []

   }); 


    var allData = ['acts']; //

            for (var i = 0; i < allData.length; i++) {
              var t = allData[i];
              var j = $hack.fromTable(
                document.getElementById(t).innerHTML);

              $scope[t] = j || $localStorage[t];
             $scope[t+'S'] = (!j && 'bug') || '';

              if (JSON.stringify($localStorage[t]) != JSON.stringify($scope[t])) $scope[t+'S'] = $scope[t+'S'] || 'new';

              $localStorage[t] = $scope[t] || $localStorage[t] || [];

            };


   if ( 1

  //  !$scope.localStorage.actsNoted ||
    //        $scope.localStorage.actsNoted.length != $scope.acts.length


            ) {

     $localStorage.actsNoted = $localStorage.actsNoted || [];

      for (var i = 0; i < $scope.acts.length; i++) {
        var note = 
          ($localStorage.actsNoted[i] && $localStorage.actsNoted[i].note)
             || '';
        var ord = 
          ($localStorage.actsNoted[i] && $localStorage.actsNoted[i].ord)
             || '';

        $localStorage.actsNoted[i] = angular.copy($scope.acts[i]);
        $localStorage.actsNoted[i].note = note || '';
        $localStorage.actsNoted[i].ord = ord || 0;

      };
   }

          
   $scope.myWatches = $localStorage.myWatches;
   console.log(localStorage);

////

   $scope.catagory = $hack.toCatagory($scope.acts, 'l');
    
    var os = Object.keys($scope.catagory);
    $scope.catagories = [];
    for (var i = 0; i < os.length; i++) {
      $scope.catagories.push({
        t: os[i],
        n: $scope.catagory[os[i]]
      });
    };

    //////


   var list0 = $filter('wanted')($localStorage.actsNoted, $scope.mySearch);
   console.log(list0);

   var list = $filter('orderBy')(list0 ,'ord',1);
   console.log(list);


   var f = (list && list[0]) || {};

   console.log(f);

   $scope.myTopic = f || '';
   $scope.myFrame = $scope.fromURL(f.h || f.dh || f.ph || 'http://www.opinionstage.com/polls/2200377/poll');



   $scope.toggleWatch = function(obj, isForce) {
      if (!($scope.qWatch(obj))) {
        $scope.bindHash(obj.n);
        $localStorage.myWatches.push(obj);
         console.log($localStorage.myWatches.map(function(t){return t.n}).indexOf(obj.n));
      } else {
         if (!isForce) {
           $localStorage.myWatches.splice($localStorage.myWatches.map(function(t){return t.n}).indexOf(obj.n), 1);
           console.log($localStorage.myWatches.map(function(t){return t.n}).indexOf(obj.n));
         }
      }
   }

   $scope.qWatch = function(obj) {
      obj = obj || {};
      return $localStorage.myWatches.map(function(t){return t.n})
        .indexOf(obj.n) > -1;
   }

   $scope.bindHash = function (str) {
      location.hash ='#' + str;
   }



    
  

}

