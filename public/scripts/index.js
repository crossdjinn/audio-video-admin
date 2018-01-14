var parser = new UAParser();
var socket = io();

var result = parser.getResult();

var HW_config = {
    selector: "#headwayapp", // CSS selector where to inject the badge
    account:  "xDRnrJ"
};

console.log(Cookies.get('SCtime'));


function beforeLeave(){
    var soundScloudIframe = document.getElementById("soundScloudIframe");

    var widget1 = SC.Widget(soundScloudIframe);

    widget1.getPosition(function (time) {
        Cookies.set('SCtime', time);
    })
}

window.onunload = function() {
    beforeLeave();
};


if(result.cpu.architecture === undefined || result.cpu.architecture === null){
    result.cpu.architecture = result.os.version;
}

var device = {
    name: result.os.name + " " + result.cpu.architecture,
    browser:result.browser.name,
    engine: result.engine.name + " " + result.engine.version
};


/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

socket.on('connectCounter', function(data){
    $('#connectCounter').empty();
    $('#connectCounter').append(data);
});

var myObject;

function bodyLoaded(bodyData) {

}

getUserIP(function(private){
    $.getJSON('https://api.ipify.org?format=json', function(public){
        myObject = {
            name: device.name + " " + device.browser + " " + device.engine,
            privateIp: private,
            publicIp: public.ip,
            shortName: device.name
        };

        socket.emit('new user', myObject, function(data){
            $('#contentWrap').show();
        });
    });
});

socket.on('usernames', function(data){
    var html = '';

    for(var i in data) {
        var geo = data[i].geo; //Get the online state
        var datas = data[i].data; //Get the online state

        html +=  "<b>" + datas.name + "</b><br><i class='flag-icon flag-icon-" + geo.country.toLocaleLowerCase() + "'></i> " + geo.city + " - " + datas.publicIp + " <i>(" + datas.privateIp + ")</i><hr>" //print the status

        $('#users').html(html);
    }
});