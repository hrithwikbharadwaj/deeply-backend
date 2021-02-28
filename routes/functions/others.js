function getDetails(url,URLDetails){
    
    var loc = new URL(url);
    URLDetails.completeURL=url;
    URLDetails.host=loc.hostname; // get the hostname
    URLDetails.androidScheme=url; // set android & IOS scheme as the original url
    URLDetails.iosScheme=url;
    return URLDetails
}

module.exports={
    getDetails
}