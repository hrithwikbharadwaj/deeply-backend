function getUrlAmazon(url,URLDetails){

    
    URLDetails.completeURL=url;
    URLDetails.host=`Amazon`;
    amazonPackage=`in.amazon.mShop.android.shopping`;

    let protocol="http"
    let amazonBase=""

            if(url.match(protocol)){
                amazonBase=url.slice(8);  // removing https
                 
            }
            else if(url.match("www.")){
                amazonBase=(url.slice(7));
            }
           
     
    URLDetails.androidScheme=`intent://${amazonBase}#Intent;package=${amazonPackage};scheme=https;S.browser_fallback_url=${url};end`;
    URLDetails.iosScheme=`in.amazon.mobile.shopping.web://${amazonBase}`;
   
    return URLDetails;
    }

module.exports={
        getUrlAmazon
}