function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function() {
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text().trim();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    };
    //B1 kiểm tra listener online ?
    socket.emit("caller-check-listener-online-or-not", dataToEmit);
  });
}

function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);
  video.srcObject = stream;
  video.onloadeddata = function() {
    video.play();
  };
}

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function() {
  //B2
  socket.on("server-send-listener-is-offline", function() {
    alertify.notify("This user is currently offline!", "error", 7);
  });

  let getPeerId = "";

  const peer = new Peer();

  peer.on("open", function(peerId) {
    getPeerId = peerId;
  });

  //B3 of listener
  socket.on("server-request-peer-if-of-listener", function(response) {
    let listenerName = $("#navbar-username").text().trim();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId
    };

    //B4
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);
  });

  let timerInterval;
  //B5 of caller
  socket.on("server-send-peer-if-of-listener-to-caller", function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };
    //B6 of caller
    socket.emit("caller-request-call-to-server", dataToEmit);

    Swal.fire({
      title: `Đang gọi cho &nbsp; <span style="color: #2980B9;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
              Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br></br>
              <button id="btn-cancel-call" class="btn btn-danger"> Hủy cuộc gọi
              </button>
            `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000, //30s
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click", function() {
          Swal.close();
          clearInterval(timerInterval);

          //B7 of caller
          socket.emit("caller-cancel-request-call-to-server", dataToEmit);
        });

        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }  
      },
      onOpen: () => {
        //B12 of caller server gửi thông báo về cho caller khi listener từ chối cuộc gọi
        socket.on("server-send-reject-call-to-caller", function(response) {
          Swal.close();
          clearInterval(timerInterval);

          Swal.fire({
            type: "info",
            title: `<span style="color: #2980B9;">${response.listenerName}</span> &nbsp; can't answer the phone right now.`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2980B9",
            confirmButtonText: "Confirm!"
          });
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
        return false;
    });
  });

  //B8 of listener
  socket.on("server-send-request-call-to-listener", function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    Swal.fire({
      title: `<span style="color: #2980B9;">${response.callerName}</span> &nbsp; want to video call with you &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
              Time: <strong style="color: #d43f3a;"></strong> second. <br></br>
              <button id="btn-reject-call" class="btn btn-danger"> Refuse
              </button>
              <button id="btn-accept-call" class="btn btn-primary"> Accept
              </button>
            `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000, //30s
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click", function() {
          Swal.close();
          clearInterval(timerInterval);

          //B10 of listener gửi từ chối gọi video
          socket.emit("listener-reject-request-call-to-server", dataToEmit);
        });

        $("#btn-accept-call").unbind("click").on("click", function() {
          Swal.close();
          clearInterval(timerInterval);

          //B11 of listener chấp nhận tham gia trò chuyện video của caller
          socket.emit("listener-accept-request-call-to-server", dataToEmit);
        });

        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },
      onOpen: () => {
        //B9 of listener đóng swal hiển thị cuộc gọi đến bên listener khi caller hủy cuộc gọi
        socket.on("server-send-cancel-request-call-to-listener", function(response) {
          Swal.close();
          clearInterval(timerInterval);
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
        return false;
    });
  });

  
  //B13 of caller
  socket.on("server-send-accept-call-to-caller", function(response) {
    Swal.close();
    clearInterval(timerInterval);

    //peerjs.com Media calls - call
    //fix lỗi https://stackoverflow.com/a/27552062
    //MediaStream API of WebRTC
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    
    getUserMedia({video: true, audio: true}, function(stream) {
      $("#streamModal").modal("show");

      //play caller's stream in local
      playVideoStream("local-stream", stream);
      //call to listener
      let call = peer.call(response.listenerPeerId, stream);
      //listen and play listener's stream
      call.on("stream", function(remoteStream) {
        //play listener's stream
        playVideoStream("remote-stream", remoteStream);
      });

      //close modal and remove stream
      $("#streamModal").on("hidden.bs.modal", function() {
        closeVideoStream(stream);

        Swal.fire({
          type: "info",
          title: `Ended video call with &nbsp; <span style="color: #2980B9;">${response.listenerName}</span>`,
          backdrop: "rgba(85, 85, 85, 0.4)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2980B9",
          confirmButtonText: "Confirm!"
        });
      });
    }, function(err) {
      if (err.toString === "NotAllowedError: Permission denied") {
        alertify.notify("You need to enable call access in your browser.", "error", 7);
      }

      if (err.toString === "NotFoundError: Requested device not found") {
        alertify.notify("The calling device was not found on your computer.", "error", 7);
      }
    });
  });

  
  //B14 of listener
  //peerjs.com Media calls - answer
  socket.on("server-send-accept-call-to-listener", function(response) {
    Swal.close();
    clearInterval(timerInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    peer.on("call", function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
        $("#streamModal").modal("show");

        //play listener's stream in local
        playVideoStream("local-stream", stream);

        call.answer(stream); // Answer the call with an A/V stream.
        call.on("stream", function(remoteStream) {
          //play caller's stream
          playVideoStream("remote-stream", remoteStream);
        });

        //close modal and remove stream
        $("#streamModal").on("hidden.bs.modal", function() {
          closeVideoStream(stream);

          Swal.fire({
            type: "info",
            title: `Ended video call with &nbsp; <span style="color: #2980B9;">${response.callerName}</span>`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2980B9",
            confirmButtonText: "Confirm!"
          });
        });
      }, function(err) {
        if (err.toString === "NotAllowedError: Permission denied") {
          alertify.notify("You need to enable call access in your browser.", "error", 7);
        }

        if (err.toString === "NotFoundError: Requested device not found") {
          alertify.notify("Calling device not found on your computer.", "error", 7);
        }
      });
    });
  });
});