class App {
  constructor() {

    const $START_CAMERA_BUTTON = document.querySelector('.js-button-camera-start');
    const $STOP_CAMERA_BUTTON = document.querySelector('.js-button-camera-stop');

    //動画流す準備
    const video = document.getElementById("video");
    // getUserMedia によるカメラ映像の取得
    const media = navigator.mediaDevices.getUserMedia({
      video: true,//ビデオを取得する
      //使うカメラをインカメラか背面カメラかを指定する場合には
      // video: { facingMode: "environment" },//背面カメラ
      //video: { facingMode: "user" },//インカメラ
      audio: false,//音声が必要な場合はture
    });
    //リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
    media.then((stream) => {
      $START_CAMERA_BUTTON.addEventListener('click', () => {
        video.srcObject = stream;
      });
      $STOP_CAMERA_BUTTON.addEventListener('click', () => {
        video.srcObject = null;
      });
    });
  }
}

new App();
