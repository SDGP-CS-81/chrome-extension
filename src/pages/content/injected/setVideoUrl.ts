export function setVideoUrl(url: string) {
  console.log(`Trying to set video url: ${url}`);

  if (!url) return;

  const videoElement = document.querySelector("video");

  if (url === videoElement.src) {
    return console.log(`setVideoUrl: Url already set, returning`);
  }

  const currentTime = videoElement.currentTime;
  const pauseState = videoElement.paused;

  console.log(`setVideoUrl: Pause video to set url`);
  videoElement.pause();
  videoElement.src = url;
  videoElement.load();
  videoElement.currentTime = 0;

  // use a timeout to allow the pause op to complete
  setTimeout(() => {
    console.log(`setVideoUrl: Continuing video, currentTime = ${currentTime}`);
    videoElement.currentTime = currentTime;
    videoElement.play();

    // use a timeout to allow the play op to complete
    setTimeout(() => {
      if (pauseState) {
        console.log(`setVideoUrl: Restoring original pause state`);
        videoElement.pause();
      }
    }, 200);
  }, 200);
}
