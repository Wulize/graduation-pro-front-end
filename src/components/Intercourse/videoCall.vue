<template>
  <div class="video-call">
    <div class="video-box">
      <span class="cancle" @click="cancle">×</span>
      <video ref="remoteVideo" id="remote-video"></video>
      <video ref="localVideo" id="local-video" muted></video>
      <button ref="startButton" class="start-button" @click="startLive">
        start
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { eventBus } from "@/utils/index";
@Component({
  components: {},
})
export default class Intercourse extends Vue {
  public localVideo: any = {};
  public remoteVideo: any = {};
  public button: any = {};
  public PeerConnection: any = {};
  public peer: any = {};
  //   msg用于接收父组件经过websocket协议收到的数据
  // @Prop() public msg: any = {};
  // @Watch("msg")
  public handleMsg(val: any) {
    console.log("子组件收到视频消息", val);
    const { type, sdp, iceCandidate, send_name } = val;
    if (type === "offer") {
      this.$confirm(`来自${send_name}视频通话`, {
        confirmButtonText: "接听",
        cancelButtonText: "挂断",
        type: "warning",
      })
        .then(() => {
          this.startLive(new RTCSessionDescription({ type, sdp }));
        })
        .catch(() => {
          return;
        });
    } else if (type === "offer_ice") {
      this.peer.addIceCandidate(iceCandidate);
    } else if (type === "answer") {
      // 收到answer怎么进行处理
      this.peer.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
    } else if (type === "answer_ice") {
      this.peer.addIceCandidate(iceCandidate);
    }
  }
  public init() {
    this.PeerConnection = window.RTCPeerConnection;
    this.peer = new this.PeerConnection();
    this.button = this.$refs.startButton;
    this.localVideo = this.$refs.localVideo;
    this.remoteVideo = this.$refs.remoteVideo;
    (this.localVideo as any).onloadeddata = () => {
      (this.localVideo as any).play();
    };
    (this.remoteVideo as any).onloadeddata = () => {
      (this.remoteVideo as any).play();
    };
    this.peer.ontrack = (e: any) => {
      if (e && e.streams) {
        (this.remoteVideo as any).srcObject = e.streams[0];
      }
    };

    this.peer.onicecandidate = (e: any) => {
      if (e.candidate) {
        const info = {
          type: "offer_ice",
          iceCandidate: e.candidate,
        };
        this.$emit("offer", info);
      }
    };
  }
  public mounted() {
    this.init();
    console.log("组件挂载");
    eventBus.$on("msgReceive", (msg: any) => {
      this.handleMsg(msg);
    });
  }
  public async startLive(offerSdp: any) {
    let stream: any;
    try {
      //  拿到本地媒体流（MediaStream）后，需要将其中所有媒体轨道（MediaStreamTrack）添加到轨道集
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      (this.localVideo as any).srcObject = stream;
      this.$message({
        showClose: true,
        message: "获取摄像头成功",
        type: "success",
      });
    } catch {
      this.$message({
        showClose: true,
        message: "获取摄像头失败",
        type: "warning",
      });
      return;
    }
    // stream.getTracks()返回的是MediaStreamTrack对象的数组 --视频段
    // RTCPeerConnection.addTrack将一个新的媒体音轨添加到一组音轨中，这些音轨将被传输给另一个对等点。
    stream.getTracks().forEach((track: any) => {
      this.peer.addTrack(track, stream);
    });
    // 如果是自己发起的视频通话，则创建offer用websocket发给对方
    if (offerSdp.type !== "offer") {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      //   socket.send(JSON.stringify(offer));
      this.$emit("offer", offer);
    }
    // 若是对方发起通话，接收到offer之后创建Answer返回回去
    else {
      await this.peer.setRemoteDescription(offerSdp);
      const answer = await this.peer.createAnswer();
      //   socket.send(JSON.stringify(answer));
      this.$emit("answer", answer);
      await this.peer.setLocalDescription(answer);
      console.log("返回answer");
    }
  }

  //   关闭视频通话
  public cancle() {
    this.$emit("cancle");
  }
}
</script>
<style lang="scss">
.video-call {
  .container {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: space-around;
    padding-top: 20px;
  }
  .video-box {
    position: relative;
    width: 800px;
    height: 400px;
    .cancle {
      position: absolute;
      z-index: 100;
      cursor: pointer;
      top: 0.5rem;
      right: 0.5rem;
    }
  }
  #remote-video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border: 1px solid #eee;
    background-color: #f2f6fc;
  }
  #local-video {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 240px;
    height: 120px;
    object-fit: cover;
    border: 1px solid #eee;
    background-color: #ebeef5;
  }
  .start-button {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100px;
    // display: none;
    line-height: 40px;
    outline: none;
    color: #fff;
    background-color: #409eff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transform: translate(-50%, -50%);
  }
}
</style>