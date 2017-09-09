// const redis = require('redis')
// Promise.promisifyAll(redis.RedisClient.prototype)
// Promise.promisifyAll(redis.Multi.prototype)

function HomeController ($scope,$interval, Modules) {
    const interval = $interval(_=>{
        if(!Modules.isRunning()) {
            $scope.triggerModal = true;
            $scope.modalHeader = 'Error';
            $scope.modalContainer = 'Redis is not runnning...'
        } else {
            $scope.triggerModal = false;
            $interval.cancel(interval)
        }
    },100)

}
module.exports = HomeController
