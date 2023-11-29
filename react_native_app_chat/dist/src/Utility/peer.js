import { RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";

class PeerService {
    constructor() {
      if (!this.peer) {
        // this.peer = new RTCPeerConnection({
        //   iceServers: [
        //     {
        //       urls: [
        //         "stun:stun.l.google.com:19302",
        //         "stun:global.stun.twilio.com:3478",
        //       ],
        //     },
        //   ],
        // });

        this.peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:turnqa.wbpweddings.com:30022' },
                {
                  urls: 'turn:turnqa.wbpweddings.com:30022',
                  username: 'abp',
                  credential: 'P@ssw0rd#123@@'
                }
              ]
        });
        
      }
    }
  
async reconnectPeerConnection(){
  
  //if (!this.peer) {
    console.log("hiii reconnect",this.peer);  
    this.peer = new RTCPeerConnection({
      iceServers: [
          { urls: 'stun:turnqa.wbpweddings.com:30022' },
          {
            urls: 'turn:turnqa.wbpweddings.com:30022',
            username: 'abp',
            credential: 'P@ssw0rd#123@@'
          }
        ]
  });
 // }
}

    async getAnswer(offer) {
      
      if (this.peer) {
        //console.log("offer",offer);
        try{
          await this.peer.setRemoteDescription(offer);
          const ans = await this.peer.createAnswer();
          await this.peer.setLocalDescription(new RTCSessionDescription(ans));
          return ans;
        }
        catch(error){
          console.log(error);
        }
       
      }
    }
  
    async setLocalDescription(ans) {
      if (this.peer) {
        //console.log("ans",ans);
        try{
          await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
        catch(error){
          console.log(error);
        }
      }

    }
  
    async getOffer() {
      if (this.peer) {
        try{
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
      }
      catch(error){
        console.log(error);
      }
      }
    }
  }
  
  export default new PeerService();
  