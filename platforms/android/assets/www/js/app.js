
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);//Ecoute le bouton "back"
    //Pop up about
    document.getElementById("about").addEventListener("click", dialogAbout);

}

// Fenêtre de choix utilisateur : quitter l'app oui ou non
function onBackKeyDown(e) {
    e.preventDefault();
    navigator.notification.confirm("Etes-vous sûr de quitter l'appli ?", onConfirm, "Confirmation", "Oui,Non");

}

function dialogAbout() {
    var message = "Cette appli développée pour mon besoin personnel, permet d'obtenir l'autonomie de ma voiture "+
        "sur mon smartphone.\nLes résultats affichés sont valables si la route est parfaitement plate et si la température " +
        " ne varie pas au cours du trajet.\nLes valeurs obtenues sont données à titre indicatif.";
    var title = "A PROPOS";
    var buttonName = "Retour";
    navigator.notification.alert(message, alertCallback, title, buttonName);

    function alertCallback() {
        console.log("Pop Up ne s'affiche pas");
    }
}

function onConfirm(button) {
    if(button==2){//Si l'utilisateur choisit "non", alors on fait rien
        return;
    }else{
        navigator.app.exitApp();// Sinon on quitte l'app.
    }
}

var app = angular.module('app',['ngRoute']);

//routing
app.config(['$routeProvider',
    function($routeProvider) {

        // Système de routage
        $routeProvider
            .when('/home', {
                templateUrl: 'partials/batterie41kwh.html',
                controller : 'cssActive'
            })
            .when('/home2', {
                templateUrl: 'partials/batterie22kwh.html',
                controller : 'cssActive'
            })
            .otherwise({
                redirectTo: '/home',
                controller : 'cssActive'
            });
    }
]);

//Factory Zoe
app.factory('infoZoe', ['$http',  function($http){
    return{
        /*fonction de récupération du fichier json*/
        recupData: function(url){
            return $http.get(url);
        },

        /*fonction de récupération de l'autonomie en fonction des données reçues par les select*/
        recupAutonomie: function(data, speed, tpt, wheels, ac, heater, eco){
            var retour1 = [];
            var retour2 = [];
            var retour3 = [];
            var retour4 = [];
            var retour5 = [];
            var retour6 = [];

            //transformation des string en boolean
            //ac = ac == 'true' ? true : false;
            //heater = heater == 'true' ? true : false;
            //eco = eco == 'true' ? true : false;

            //on récupère les données avec une vitesse donnée
            for(var key in data){
                if(data[key].speed == speed){
                    retour1.push(data[key]);
                }
            }

            console.log('ac :'+ ac);
            console.log('heating :' + heater)


            for(var key in retour1){
                if(retour1[key].temperature == tpt){
                    retour2.push(retour1[key]);
                }
            }
            console.log(retour2);

            for(var key in retour2){
                if(retour2[key].wheels == wheels){
                    retour3.push(retour2[key]);
                }
            }

            console.log(retour3);

            for(var key in retour3){

                console.log(ac);

                if(retour3[key].ac === ac){
                    retour4.push(retour3[key]);
                }
            }
            console.log(ac);
            console.log(retour4);

            for(var key in retour4){
                if(retour4[key].heater == heater){
                    retour5.push(retour4[key]);
                }
            }

            console.log(retour5);

            for(var key in retour5){
                if(retour5[key].eco == eco){
                    retour6.push(retour5[key]);
                }
            }

            console.log(retour6);
            return retour6;
        }
    }
}]);

app.controller("cssActive", function(){
    var url = $(location).attr('href').split('!');

    console.log(url[1]);

    if(url[1] == '/home2'){
        $("#bouton2").addClass('active');
        $("#bouton1").removeClass('active');
    } else {
        $("#bouton1").addClass('active');
        $("#bouton2").removeClass('active');
    }

});


app.controller("appCtrl",['$scope', 'infoZoe', function($scope, infoZoe){
    var dataZoe;
    $scope.selectSpeed = "80 KMH";
    $scope.selectTpt = "+20";
    $scope.selectWheels = "16";
    $scope.selectAc = false;
    $scope.selectHeater = false;
    $scope.selectEco = false;

    infoZoe.recupData("js/data2.json").
    then(function(response){
            dataZoe = response.data;
            $scope.dataAffiche = dataZoe;
        if($scope.selectTpt == "+20" || $scope.selectTpt == "+25"){
            $("#checkHeater").attr("disabled","disabled");
        }

            $scope.initData = infoZoe.recupAutonomie(dataZoe, "80 KMH", "+20", "16", false, false, false);
            console.log("lecture OK");

            console.log(dataZoe);
        },function (error) {
            console.log(error);
        }
    );
    $scope.changeAutonomie = function(){


        if($scope.selectTpt == "+20" || $scope.selectTpt == "+25"){
            $scope.selectHeater = false;
            $("#checkHeater").attr("checked",false).attr("disabled","disabled");
            $("#checkAc").removeAttr("disabled","disabled");
        } else {
            $scope.selectAc = false;
            $("#checkAc").attr("checked",false).attr("disabled","disabled");
            $("#checkHeater").removeAttr("disabled","disabled");
        }

        if($scope.selectSpeed == "100 KMH" || $scope.selectSpeed == "110 KMH" || $scope.selectSpeed == "120 KMH" || $scope.selectSpeed == "130 KMH" ){
            $scope.selectEco = false;
            $("#checkEco").attr("checked",false).attr("disabled","disabled");
        } else {
            $("#checkEco").removeAttr("disabled","disabled");
        }

        $scope.initData = infoZoe.recupAutonomie(dataZoe, $scope.selectSpeed, $scope.selectTpt, $scope.selectWheels, $scope.selectAc, $scope.selectHeater, $scope.selectEco);
    }
}]);

