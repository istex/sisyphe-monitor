// const redis = require('redis')
// Promise.promisifyAll(redis.RedisClient.prototype)
// Promise.promisifyAll(redis.Multi.prototype)

function HomeController ($scope,$interval, Modules, ConfigService) {
    $scope.changeHost = function (host){
        Modules.changeHost(host);
    }
    $scope.host = Modules.host
    const interval = $interval(_=>{
        console.log(Modules.isRunning());
        if(!Modules.isRunning()) {
            $scope.triggerModal = true;
            $scope.modalHeader = 'Error';
            $scope.modalContainer = 'Redis is not runnning...'
        } else $scope.triggerModal = false
    },100)

}
module.exports = HomeController
