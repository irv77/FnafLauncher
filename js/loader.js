let params = new URLSearchParams(document.location.search);
if (window.location.search == "") {window.open("/", "_parent")};
if (params.get("game") == "0") {window.open("/", "_parent")};
if (params.get("game") > 8) {window.open("/", "_parent")};
let game = params.get("game");
let gametitle, gamedetail, runtimecanvas, canvaswidth, canvasheight
const parts = 20;

fetch("assets/jsons/games.json").then((response) => response.json()).then((data) => {
    let gameselected = data[game - 1];
    let gameimages = "assets/images/" + gameselected.detail + "/";

    document.body.style.backgroundImage = "url(" + gameimages + "office.png)";
    document.getElementById("title").src = gameimages + "title.png";
    document.getElementById("animatronic").src = gameimages + "animatronic.png";

    gametitle = gameselected.title;
    gamedetail = gameselected.detail;
    runtimecanvas = "resources/" + gameselected.cch;
    canvaswidth = gameselected.resolution[0];
    canvasheight = gameselected.resolution[1];
    launch();
});

// Prevents touchscreen move
window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event)
{
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}

// Fullscreen Key
const pressedKeys = {};
document.addEventListener('keydown', event => {
  pressedKeys[event.key] = true;
  if (pressedKeys['-'] && pressedKeys['=']) {
    document.querySelector('canvas').requestFullscreen();
    delete pressedKeys[event.key];
  }
});

document.addEventListener('keyup', (event) => {
  delete pressedKeys[event.key];
});

// -----------------
function launch() {
const map = new Map();

function updateProgress(text, percent) {
    document.title = percent + '% ' + gametitle
    document.getElementById('percentage').innerHTML = percent + '%';
    document.getElementById('bar').style.width = percent + '%';
    document.getElementById('stage').innerHTML = text;
}

async function intercept() {
  const ogfetch = window.fetch;
  window.fetch = async function (input, init) {
    if (typeof input === 'string' && input.startsWith('resources/')) {
      const fileName = input.split('/').pop();
      if (map.has(fileName)) {
        return ogfetch(map.get(fileName), init);
      }
    }
    return ogfetch(input, init);
  };

  const ogopen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (url.startsWith('resources/')) {
      const fileName = url.split('/').pop();
      if (map.has(fileName)) {
        url = map.get(fileName);
      }
    }
    return ogopen.apply(this, arguments);
  };

  const types = [HTMLImageElement, HTMLAudioElement, HTMLVideoElement];
  for (const Tag of types) {
    const descriptor = Object.getOwnPropertyDescriptor(Tag.prototype, 'src');
    if (descriptor && descriptor.set) {
      Object.defineProperty(Tag.prototype, 'src', {
        configurable: true,
        enumerable: true,
        get: descriptor.get,
        set: function (val) {
          if (typeof val === 'string' && val.startsWith('resources/')) {
            const fileName = val.split('/').pop();
            if (map.has(fileName)) {
              val = map.get(fileName);
            }
          }
          descriptor.set.call(this, val);
        }
      });
    }
  }
}

async function extract() {
  const res = await fetch("resources.zip");

  const contentLength = res.headers.get("Content-Length");
  const total = parseInt(contentLength, 10);
  const reader = res.body.getReader();
  let loaded = 0;
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    updateProgress('RETURNING GEARS...', Math.floor((loaded / total / 2) * 100));
  }

  const arrayBuffer = await new Blob(chunks).arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const files = Object.keys(zip.files).filter(name => !zip.files[name].dir);
  const totalFiles = files.length;

  for (let i = 0; i < totalFiles; i++) {
    const file = zip.files[files[i]];
    const blob = await file.async("blob");
    const url = URL.createObjectURL(blob);
    map.set(files[i], url);
    updateProgress('BOOTING UP ARCHIVE...', Math.floor(((i + 1) / totalFiles / 2) * 100 + 50));
  }
}

async function wedone() {
  await extract();
  await intercept();

  const script = document.createElement('script');
  script.src = "assets/gamefiles/" + gamedetail + '/Runtime.js';
  script.onload = () => {
    new Runtime("MMFCanvas", runtimecanvas);
  };
  document.getElementById('MMFCanvas').style.display = 'block';
  document.getElementById('MMFCanvas').width = canvaswidth;
  document.getElementById('MMFCanvas').height = canvasheight;
  document.getElementById('selection').style.display = 'none';
  document.title = gametitle;
  document.head.appendChild(script);
}

const originalFetch = window.fetch;

function mergeFiles(fileParts) {
  return new Promise((resolve, reject) => {
      let buffers = [];
      let totalSize = 0;
      let loadedSize = 0;
      Promise.all(fileParts.map(part =>
          fetch(part, { method: 'HEAD' }).then(res => {
            try { if (!res.ok) throw new Error("Missing part: " + part);
              return parseInt(res.headers.get("Content-Length") || "0", 10);
            } catch (error) {document.getElementById('stage').innerHTML = "ERROR: MISSING FILE(S)..."}
          })
      )).then(sizes => {
          totalSize = sizes.reduce((a, b) => a + b, 0);
          function fetchPart(index) {
              if (index >= fileParts.length) {
                  let mergedBlob = new Blob(buffers);
                  let mergedFileUrl = URL.createObjectURL(mergedBlob);
                  resolve(mergedFileUrl);
                  return;
              }

              fetch(fileParts[index]).then((response) => {
                  if (!response.ok) throw new Error("Missing part: " + fileParts[index]);
                  return response.arrayBuffer();
              }).then((data) => {
                  buffers.push(data);
                  loadedSize += data.byteLength;
                  updateProgress('LOCATING ARCHIVE...', Math.floor((loadedSize / totalSize / 2) * 100));
                  fetchPart(index + 1);
              }).catch(reject);
          }

          fetchPart(0);
      }).catch(reject);
  });
}

function getParts(file, start, end) {
    let parts = [];
    for (let i = start; i <= end; i++) {
        parts.push(file + ".part" + i);
    }
    return parts;
}
Promise.all([
    mergeFiles(getParts("assets/gamefiles/" + gamedetail + "/resources.zip", 1, parts))
]).then(([resources]) => {
    window.fetch = async function (url, ...args) {
        if (url.endsWith("resources.zip")) {
            return originalFetch(resources, ...args);
        } else {
            return originalFetch(url, ...args);
        }
    };
    wedone();
});
};