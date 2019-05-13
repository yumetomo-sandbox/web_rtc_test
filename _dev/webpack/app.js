class App {
  constructor() {
    // 設定用
    this.width = window.outerWidth;
    this.height = window.outerHeight;
    this.isStreaming = false;

    // 要素取得
    this.$startButton = document.querySelector('.js-button-camera-start');
    this.$stopButton = document.querySelector('.js-button-camera-stop');
    this.$captureButton = document.querySelector('.js-button-camera-capture');
    this.$capture = document.querySelector('.capture');
    this.$video = document.getElementById('video');
    this.$canvas = document.getElementById('canvas');

    this.bind();
    this.setup();
  }

  /**
   * イベント設定
   */
  bind() {
    this.$video.addEventListener('canplay', () => {
      if (!this.isStreaming) {
        this.$video.setAttribute('width', this.width);
        this.$video.setAttribute('height', this.height);
        this.$canvas.setAttribute('width', this.width);
        this.$canvas.setAttribute('height', this.height);
        this.isStreaming = true;
      }
    });

    this.$captureButton.addEventListener('click', () => {
      this.takeCaptureImage();
    })
  }

  /**
   * 初期設定
   */
  setup() {
    // getUserMedia によるカメラ映像の取得
    const MEDIA = navigator.mediaDevices.getUserMedia({
      // video: true,//ビデオを取得する
      //使うカメラをインカメラか背面カメラかを指定する場合には
      video: {
        facingMode: "environment", //背面カメラ
        maxWidth: this.width,
        maxHeight: this.height
      },
      //video: { facingMode: "user" },//インカメラ
      audio: false,//音声が必要な場合はture
    });

    //リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
    MEDIA
      .then((stream) => {
        this.$startButton.addEventListener('click', () => {
          this.$video.srcObject = stream;
        });
        this.$stopButton.addEventListener('click', () => {
          this.$video.srcObject = null;
        });
      })
      .catch((error) => {
        console.log(`ERROR : ${error}`);
      });
  }

  /**
   * キャプチャした画像を消す
   */
  clearCaptureImage() {
    const CONTEXT = this.$canvas.getContext('2d');
    CONTEXT.fillStyle = "#AAA";
    CONTEXT.fillRect(0, 0, this.$canvas.width, this.$canvas.height);

    const DATA = this.$canvas.toDataURL('image/png');
    this.$capture.setAttribute('src', DATA);
  }

  /**
   * videoの映像をキャプチャする
   */
  takeCaptureImage() {
    const CONTEXT = this.$canvas.getContext('2d');
    if (this.width && this.height) {
      this.$canvas.width = this.width;
      this.$canvas.height = this.height;
      CONTEXT.drawImage(this.$video, 0, 0, this.width, this.height);

      const DATA = this.$canvas.toDataURL('image/png');
      this.$capture.setAttribute('src', DATA);
    } else {
      this.clearCaptureImage();
    }
  }
}

new App();
