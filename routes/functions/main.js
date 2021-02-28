let urlExpander=require('expand-url');
var { tall } = require('tall')
var youtube = require('./youtube');
var amazon = require('./amazon');
var others = require('./others');

function stringHasTheWhiteSpaceOrNot(value){
    return value.indexOf(' ') >= 0;
 }

function DeepLink(url){
    return new Promise((resolve)=>{
        let arrayofHosts=["youtu","amazon","youtube","amzn"];
        let host=null;
        
        let videoProperties={
            isVideo:false,
            isChannel:false,
            isMobileVideo:false
        }
        let URLDetails={
            completeURL:"",
            androidScheme:"",
            iosScheme:"",
            host:""
        }
        
        let URLSeperator = new URL(url); // seperate the urls
        let hostFromURL = URLSeperator.host; // get the host name
        let pathFromURL=  URLSeperator.pathname; //  get the path value
    
        // match the hostname with our supported host
        function matchHostName(){
            arrayofHosts.forEach((item)=>{
                if(hostFromURL.match(item)){
                  host=hostFromURL.match(item)[0];  
                }
            })
        }matchHostName();
        
        
        if(host=="amazon" || host=="amzn"){   // check if the url is short amazon link or amazon long link
            if(host=="amzn"){
                expandAmaznLink(url);
    
            }
            else{
                URLDetails =amazon.getUrlAmazon(url,URLDetails)
                resolve(URLDetails);
            }
    
        }
      
            
        
        if (host=="youtu" || host=="youtube"){
            host="youtube"
            URLDetails.host=`YouTube`;
            youTubePackage="com.google.android.youtube";
            videoProperties = youtube.isVideoOrChannel(url,videoProperties,pathFromURL) // to check channel or video
            
            URLDetails = youtube.getUrlYouTube(url,videoProperties,URLDetails,host,youTubePackage);
            resolve(URLDetails);  // get the url with ios/android schemes of youtube
            
            
            
        }
        if (host==null){ // if host of the url is not matched to the list
            
            URLDetails=others.getDetails(url,URLDetails); // set all the links to the web version
            resolve(URLDetails);
        }
        
        function expandAmaznLink(url){
            tall(url)
            .then(function(unshortenedUrl) {resolve(amazon.getUrlAmazon(unshortenedUrl,URLDetails)); })
            .catch(function(err) {
              console.error('url expansion failed', err)
            })
        }
           
    });
  
    };

module.exports={
        DeepLink,
        stringHasTheWhiteSpaceOrNot
}
            
        
        
          
              
              
         
        
        
        
        
        
        
        
       
        
    
        
        
        