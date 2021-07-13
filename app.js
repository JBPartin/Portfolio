const workbutton = document.getElementById('mywork');
const workarrow = document.getElementById('workarrow');
const burger = document.getElementById('hamburger');
const menu = document.querySelector('.menu');
const canvas = document.getElementById('background');
const intro = document.getElementById('intro');
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let ctx = canvas.getContext('2d');
let scrollArea = 1000 - windowHeight;
let attach = false;
canvas.width = windowWidth;
canvas.height = windowHeight
let mouse = {
  x: null,
  y: null,
  radius: canvas.height < canvas.width ? canvas.height / 5 : canvas.width / 5
}

let contentlist;
let data;
const projectdiv = document.querySelector('.projects');
window.addEventListener('load', () => {
  readTextFile('data.json', function (text) {
    data = JSON.parse(text);
    for (let x in data.projects) {
      let name = document.createTextNode(data.projects[x].name);
      let img = document.createElement('img');
      img.src = 'images/' + data.projects[x].image;
      let project = document.createElement('div');
      let text = document.createElement('h1');
      let desc = document.createElement('p');
      desc.innerHTML = data.projects[x].desc;
      text.appendChild(name);
      project.onclick = (clicked) => {
        if (Array.from(clicked.target.classList).includes('project')) {
          expandImage(clicked.target.cloneNode(true), clicked.target);
        } else if (Array.from(clicked.target.parentNode.classList).includes('project')) {
          expandImage(clicked.target.parentNode.cloneNode(true), clicked.target.parentNode);
        }
      }
      project.classList.add('project');
      project.classList.add('flow__object');
      img.classList.add('project-background');
      text.setAttribute('class', 'project-names');
      project.appendChild(text);
      project.appendChild(img);
      project.appendChild(desc);
      projectdiv.appendChild(project);
    }
    contentlist = document.querySelectorAll('.flow__object');
    for (let content in contentlist) {
      if (content >= 0) {
        const position = contentlist[content].getBoundingClientRect().top;
        const windowheight = window.innerHeight;
        if (position < windowheight) {
          contentlist[content].classList.add('flow');
        } else {
          contentlist[content].classList.remove('flow');
        }
      }
    }
  });
});

function submitForm() {
  let form = document.getElementById("i-recaptcha");
  fetch(form.action, {
    method: 'post',
    body: new FormData(form),
  }).then(res => {
    return res.text()
  }).then(res => {alert(res); form.reset();});
}

function expandImage(div, target) {
  const background = document.createElement('div');
  background.onclick = (clicked) => {
    if (Array.from(clicked.target.classList).includes('clone-background')) {
      clicked.target.remove();
    } else if (Array.from(clicked.target.parentNode.classList).includes('clone')) {
      clicked.target.parentNode.parentNode.remove();
    }
  }
  background.className = 'clone-background';
  div.className = 'clone';
  const btns = document.createElement('div');
  btns.className = 'btn-container'
  let x = Array.prototype.indexOf.call(target.parentNode.children, target);
  if (data.projects[x].link != "none") {
    const link = document.createElement('button');
    link.innerHTML = 'Website';
    btns.appendChild(link);
    link.onclick = () => {
      let newwindow = window.open('');
      newwindow.location.replace(data.projects[x].link);
    }
  }
  if (data.projects[x].github != "none") {
    const link = document.createElement('button');
    link.innerHTML = 'Github';
    btns.appendChild(link);
    link.onclick = () => {
      let newwindow = window.open('');
      newwindow.location.replace(data.projects[x].github);
    }
  }
  div.appendChild(btns);
  background.appendChild(div);
  document.body.prepend(background);
}

contentlist = document.querySelectorAll('.flow__object');
window.addEventListener('scroll', (e) => {
  for (let content in contentlist) {
    if (content >= 0) {
      const position = contentlist[content].getBoundingClientRect().top;
      const windowheight = window.innerHeight;
      if (position < windowheight) {
        contentlist[content].classList.add('flow');
      } else {
        contentlist[content].classList.remove('flow');
      }
    }
  }
}, { passive: false });

window.addEventListener('mousemove', function (event) {
  console.log();
  mouse.x = event.x;
  mouse.y = event.y + window.pageYOffset;
});

window.addEventListener('resize', function () {
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
  canvas.width = windowWidth;
  canvas.height = windowHeight;
  mouse.radius = canvas.height < canvas.width ? canvas.height / 3 : canvas.width / 5;
});
window.addEventListener('mouseout', function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

canvas.addEventListener('touchmove', function (event) {
  mouse.x = event.changedTouches[0].pageX;
  mouse.y = event.changedTouches[0].pageY + window.pageYOffset;
  if (attach) {
    event.preventDefault();
  }
}, true);

canvas.addEventListener('dblclick', function () {
  if (windowWidth < 670) {
    attach = !attach;
    intro.classList.toggle('focus');
  }
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.opacity = 100;
    this.frames = 0;
    this.rand = (Math.random() * 100) + 105;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.frames++;
    if (this.frames > (Math.random() * 20) + 5) {
      this.directionX += (((Math.random() * 2) - 1) * .7);
      this.directionY += (((Math.random() * 2) - 1) * .7);
      this.frames = 0;
      this.opacity += (((Math.random() * 2) - 1) * .1);
      this.color = `rgba(${this.rand},50,${this.rand},${this.opacity})`;
    }
    if (this.directionX > 2 || this.directionX < -2) {
      this.directionX = Math.sign(this.directionX) * 1.5;
    }

    if (this.directionY > 2 || this.directionY < -2) {
      this.directionY = Math.sign(this.directionY) * 1.5;
    }

    if (this.opacity > 1 || this.opacity < .3) {
      this.opacity = .5;
    }


    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }

    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.directionX = -this.directionX;
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.directionX = -this.directionX;
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.directionY = -this.directionY;
        this.y += 10;
      }

      if (mouse.y > this.y && this.y > this.size * 10) {
        this.directionY = -this.directionY;
        this.y -= 10;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

let particles = [];
function init() {
  for (let i = 0; i < 250; i++) {
    let size = (Math.random() * 5) + 1;
    let x = Math.random() * ((windowWidth - size * 2) - size * 2) + size * 2;
    let y = Math.random() * ((windowHeight - size * 2) - size * 2) + size * 2;
    let direction = (Math.random() * 2) - 2.5;
    let rand = (Math.random() * 100) + 105;
    let opacity = (Math.random() * 100) * .1;
    let color = `rgba(${rand},50,${rand},${opacity})`;
    particles.push(new Particle(x, y, direction, direction, size, color));
  }
  animate();
}
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  conntect();
}
function conntect() {
  for (let a = 0; a < particles.length; a++) {
    let linelimit = 5;
    let count = 0;
    for (let b = a; b < particles.length; b++) {
      let distance = ((particles[a].x - particles[b].x)
        * (particles[a].x - particles[b].x))
        + ((particles[a].y - particles[b].y)
          * (particles[a].y - particles[b].y));
      if (distance < ((windowWidth / 10) * (windowHeight / 10))) {
        if (count < linelimit) {
          let rand = (Math.random() * 100) + 105;
          let color = 'rgb(' + rand + ',50' + ',' + rand + ')'
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
        count++;
      }
    }
  }
}

workbutton.addEventListener('mouseover', function () {
  workarrow.style.transform = 'rotateZ(90deg)';
});
workbutton.addEventListener('mouseout', function () {
  workarrow.style.transform = 'rotateZ(0deg)';
});

burger.addEventListener('click', function () {
  burger.classList.toggle('active');
  menu.classList.toggle('hide');
});



//read data.json
function readTextFile(file, callback) {
  let rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == '200') {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

init();