class App {
  constructor() {
    // 設定用
    this.width = 1500;
    this.height = 2000;
    this.isStreaming = false;
    this.videoWidth = 0;
    this.videoHeight = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
    this.drawStartX = 0;
    this.drawStartY = 0;

    // 要素取得
    this.$startButton = document.querySelector('.js-button-camera-start');
    this.$stopButton = document.querySelector('.js-button-camera-stop');
    this.$captureButton = document.querySelector('.js-button-camera-capture');
    this.$capture = document.querySelector('.capture');
    this.$video = document.getElementById('video');
    this.$canvas = document.getElementById('canvas');
    this.context = this.$canvas.getContext('2d');

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
        width: 1920,
        height: 1080
      },
      //video: { facingMode: "user" },//インカメラ
      audio: false,//音声が必要な場合はture
    });

    //リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
    MEDIA
      .then((stream) => {
        this.$startButton.addEventListener('click', () => {
          this.$video.srcObject = stream;
          this.$video.onloadedmetadata = () => {
            this.fit();
            this.renderingToCanvas();
          }
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
   * canvasのサイズ設定
   */
  fit() {
    this.$canvas.style.width = '100vw';
    this.$canvas.width = this.width;
    this.$canvas.height = this.height;

    this.videoWidth = this.$video.videoWidth;
    this.videoHeight = this.$video.videoHeight;

    if (this.videoWidth / this.videoHeight > this.width / this.height) {
      this.drawHeight = this.height;
      this.drawWidth = this.height / this.videoHeight * this.videoWidth;
    } else {
      this.drawWidth = this.width;
      this.drawHeight = this.width / this.videoWidth * this.videoHeight;
    }
    this.drawStartX = (this.width - this.drawWidth) / 2;
    this.drawStartY = (this.height - this.drawHeight) / 2;
    console.log(this.videoWidth, this.videoHeight);
    console.log(this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);

  };

  /**
   * canvasに映像出力
   */
  renderingToCanvas() {
    window.requestAnimationFrame.call(window, this.renderingToCanvas.bind(this));
    // console.log(this.$video, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);

    this.context.clearRect(0, 0, this.width, this.height);
    this.context.drawImage(this.$video, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight)
  }

  /**
   * videoの映像をキャプチャする
   */
  takeCaptureImage() {
    const DATA = this.$canvas.toDataURL();
    this.$capture.setAttribute('src', DATA);
  }
}

new App();
