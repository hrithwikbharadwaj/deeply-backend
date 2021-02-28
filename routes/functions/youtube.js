function isVideoOrChannel(url,videoProperties,pathFromURL){
    
    if(url.match("youtu.be/") || url.match("watch?v") ){ // check for video 
        videoProperties.isVideo=true;
        return videoProperties;
    }
    else if ( url.match('m.youtube')){  // check for mobile links 
        
        if(pathFromURL.match('channel')!=null) {
            videoProperties.isChannel=true;
            return videoProperties;
        
        }
        videoProperties.isMobileVideo=true;
        return videoProperties;
    }
    else { // check for channel
        
        videoProperties.isChannel=true;
        return videoProperties;
    }
       
}



function getUrlYouTube(url,videoProperties,URLDetails,host,packageName){
    
    const { isVideo,isMobileVideo} =videoProperties

    if(isVideo){ // desktop video
        ytID=url.slice(17,29)
        
        URLDetails.completeURL= completeURL=`www.${host}.com/watch?v=${ytID}`
        URLDetails.androidScheme=`intent://${completeURL}#Intent;package=${packageName};scheme=https;S.browser_fallback_url=${url};end`;
        URLDetails.iosScheme=`vnd.youtube://${completeURL}&v=${ytID}`;
        
        
    }
    else if(isMobileVideo){ 
        console.log("movile video")
        ytID=url.slice(30,41) // to get the YouTube ID (the last 11 characters)
        URLDetails.completeURL= completeURL=`www.${host}.com/watch?v=${ytID}`
        URLDetails.androidScheme=`intent://${completeURL}#Intent;package=${packageName};scheme=https;S.browser_fallback_url=${url};end`;
        URLDetails.iosScheme=`vnd.youtube://${completeURL}&v=${ytID}`;
        
    }
    
    else{ // channel
        console.log("channel shortening") 
        if(url.match("https") ){  // removing the https protocol from link
            
            completeURL=url.replace("https://","");
        }
        else if(url.match("http")){  // removing the http protocol from link
            completeURL=url.replace("http://","");
        }
        else{
            completeURL=`${url}`
            
        }
        if(url.match('m.youtube')!=null){ // for m.youtube channel links
           
            completeURL=url.replace("https://m.","") // removing the https protocol and m 
        }
        
        
        URLDetails.completeURL=completeURL
        URLDetails.androidScheme=`intent://${completeURL}#Intent;package=${packageName};scheme=https;S.browser_fallback_url=${url};end`;
        URLDetails.iosScheme=`vnd.youtube://${completeURL}`;
        
        
    }
    return URLDetails;
    
}


module.exports={
    isVideoOrChannel,
    getUrlYouTube
}