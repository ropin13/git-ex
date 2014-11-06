
//init app
var app = angular.module("chtApp",['ngSanitize','chtModule']);
app.run(function($rootScope){$rootScope.myname="ropin";});


(function(){

MainCtrl.$inject = ["$scope","$http","myId", "$log", "kpservice"];

function MainCtrl($scope, $http, myId, $log, kpservice){
 
  
  $log.info(myId);
  $scope.PName='T-Shirt';
  $scope.PPrice=100;
  $scope.PQty=10;
  
  $scope.total = function(PPrice, PQty){
    var result = PPrice*PQty;
    if(9<PQty){
      result = result*0.9;
    }
    return result;
  };
  $scope.carts = [];
  $scope.carts_history = [];
  
  $scope.addCarts = function(PName,PPrice,PQty){
    $scope.carts.push({
      PName: PName,
      PPrice: PPrice,
      PQty: PQty
    });
    
    $scope.carts_history.push(angular.copy($scope.carts));
  };
  $scope.addCarts('T-Shirt',199,3);
  $scope.addCarts('Shoes',1800,2);
  $scope.addCarts('Eye glasses',1000,5); 
  
  $scope.sum = function(){
    var result = 0;
    for(var index in $scope.carts){
      var item = $scope.carts[index];
      result = result+$scope.total(item.PPrice,item.PQty);
    }
    return result;
  };
  
  
  $scope.removeCarts = function(item){
    var index = $scope.carts.indexOf(item);
    $scope.carts.splice(index,1);
    $scope.carts_history.push(angular.copy($scope.carts));
  };
  $scope.edit = function(item){
    item.isEdit = true;
  }; 
  $scope.editDone = function(item){
    item.isEdit = false;
  };
  $scope.addPQty = function(item){
    item.PQty++; 
    $scope.carts_history.push(angular.copy($scope.carts));
  };
  $scope.subPQty = function(item){
    item.PQty--;
    if(item.PQty===0){
      $scope.removeCarts(item);
    } 
    $scope.carts_history.push(angular.copy($scope.carts));
  };
  $scope.deleteSelected = function(){
    var delIdxs = [];
    for(var index in $scope.carts){
      var item = $scope.carts[index];
      if(item.isDelete){
        delIdxs.push(item);
      }
    } 
    
    for(var i in delIdxs){
      var delItem = delIdxs[i];
        $scope.removeCarts(delItem);
    }  
    $scope.carts_history.push(angular.copy($scope.carts));
  };
  
  $scope.selectAll = function(checkAll){
    for(var index in $scope.carts){
      var item = $scope.carts[index];
      item.isDelete = $scope.checkAll;
    }
  };  
  $scope.undo = function(){
    
    if($scope.carts_history.length==1){
      $scope.carts_history = [];
      $scope.carts = [];
    }
    if($scope.carts_history.length>1){
      $scope.carts_history.pop();
      $scope.carts =
        $scope.carts_history[$scope.carts_history.length-1];
      
    }
  };
  
  $scope.saveCarts = function(){
    $http.post('home/post');
  };
  
  $scope.width=100;
  $scope.height=100;
  
  $scope.linkytest = "test  http://123.13.13  linky";
  
  
  
  kpservice.getCategory(
    function(result){$scope.kpcategory = result.data;}
  );
    
  $scope.loadList = function(id){
    kpservice.getCategoryList(id, function(result){
       $scope.list = result.data;
     });
  };
}
  
  
//ª`¤Jcontroller
app.controller("MainCtrl",MainCtrl); 
  
})();


(function(){
  angular.module("chtModule",['ngResource'])
    .factory("myId", myId)
    .factory("kpservice", kpservice)
    .directive("cartItem", function(){
      return {templateUrl:"/temp.html"};
    }
  );

  function myId(){
    var obj = {};
    obj.name = "tester";
    obj.tel = "0988-888888";
    return obj;
  }

  kpservice.$inject("$http", "$resource");
  function kpservice($http, $resource){
    var obj = {
      getCategory: function(callback){
        $http.get('http://api.kptaipei.tw/v1/category/')
        .success(callback);
      },
      getCategoryList: function( id, callback){
        var kpPage = 
        $resource("http://api.kptaipei.tw/v1/category/:CATEGORY_ID");
        kpPage.get({"CATEGORY_ID":id}, callback);
      }
      
    };
    return obj;
  }  
})();