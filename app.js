
class Global{
  constructor(){
    this.workbutton = document.getElementById('mywork');
    this.workarrow = document.getElementById('workarrow');
    this.burger = document.getElementById('hamburger');
    this.menu = document.querySelector('.menu');
    this.canvas = document.getElementById('background');
    this.intro = document.getElementById('intro');
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.scrollArea = 1000 - this.windowHeight;
    this.attach = false;
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight
    this.projectdiv = document.querySelector('.projects');
    this.contentlist = document.querySelectorAll('.flow__object');
    this.data;
    this.mouse = {
      x: null,
      y: null,
      radius: this.canvas.height < this.canvas.width ? this.canvas.height / 5 : this.canvas.width / 5
    }
    this.readTextFile = (file, callback) => {
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
    this.submitForm = () => {
      console.log("test")
      let form = document.getElementById("i-recaptcha");
      fetch(form.action, {
        method: 'post',
        body: new FormData(form),
        headers: {
          'Access-Control-Allow-Origin': '*'
       }
      }).then(res => {
        return res.text()
      }).then(res => {
        console.log(res);
        alert(res); 
        form.reset();});
    }

    this.expandImage = (div, target) =>{
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
  }
  
}

class Events{
  constructor(global){
    this.global = global;
    this.windowEvent();
    this.mouseEvent();
    this.elementEvent();
  }
  windowEvent(){
    const global = this.global
    window.addEventListener('load', () => {
      global.readTextFile('data.json', function (text) {
        global.data = JSON.parse(text);
        for (let x in global.data.projects) {
          let name = document.createTextNode(global.data.projects[x].name);
          let img = document.createElement('img');
          img.src = 'images/' + global.data.projects[x].image;
          let project = document.createElement('div');
          let text = document.createElement('h1');
          let desc = document.createElement('p');
          desc.innerHTML = global.data.projects[x].desc;
          text.appendChild(name);
          project.onclick = (clicked) => {
            if (Array.from(clicked.target.classList).includes('project')) {
              this.global.expandImage(clicked.target.cloneNode(true), clicked.target);
            } else if (Array.from(clicked.target.parentNode.classList).includes('project')) {
              this.global.expandImage(clicked.target.parentNode.cloneNode(true), clicked.target.parentNode);
            }
          }
          project.classList.add('project');
          project.classList.add('flow__object');
          img.classList.add('project-background');
          text.setAttribute('class', 'project-names');
          project.appendChild(text);
          project.appendChild(img);
          project.appendChild(desc);
          global.projectdiv.appendChild(project);
        }
        global.contentlist = document.querySelectorAll('.flow__object');
        for (let content in global.contentlist) {
          if (content >= 0) {
            const position = global.contentlist[content].getBoundingClientRect().top;
            const windowheight = window.innerHeight;
            if (position < windowheight) {
              global.contentlist[content].classList.add('flow');
            } else {
              global.contentlist[content].classList.remove('flow');
            }
          }
        }
      });
    });
    window.addEventListener('scroll', (e) => {
      for (let content in global.contentlist) {
        if (content >= 0) {
          const position = global.contentlist[content].getBoundingClientRect().top;
          const windowheight = window.innerHeight;
          if (position < windowheight) {
            global.contentlist[content].classList.add('flow');
          } else {
            global.contentlist[content].classList.remove('flow');
          }
        }
      }
    }, { passive: false });
    window.addEventListener('resize', function () {
      global.windowHeight = window.innerHeight;
      global.windowWidth = window.innerWidth;
      global.canvas.width = global.windowWidth;
      global.canvas.height =  global.windowHeight;
      global.mouse.radius = global.canvas.height < global.canvas.width ? global.canvas.height / 3 : global.canvas.width / 5;
    });
  }

  elementEvent(){
    const global = this.global;
    global.canvas.addEventListener('touchmove', function (event) {
      global.mouse.x = event.changedTouches[0].pageX;
      global.mouse.y = event.changedTouches[0].pageY + window.pageYOffset;
      if (attach) {
        event.preventDefault();
      }
    }, true);
    global.canvas.addEventListener('dblclick', function () {
      if (global.windowWidth < 670) {
        attach = !attach;
        intro.classList.toggle('focus');
      }
    });
    global.workbutton.addEventListener('mouseover', function () {
      global.workarrow.style.transform = 'rotateZ(90deg)';
    });
    global.workbutton.addEventListener('mouseout', function () {
      global.workarrow.style.transform = 'rotateZ(0deg)';
    });

    global.burger.addEventListener('click', function () {
      global.burger.classList.toggle('active');
      global.menu.classList.toggle('hide');
    });
  }

  mouseEvent(){
    const global = this.global;
    window.addEventListener('mousemove', function (event) {
      global.mouse.x = event.x;
      global.mouse.y = event.y + window.pageYOffset;
    });
    window.addEventListener('mouseout', function () {
      global.mouse.x = undefined;
      global.mouse.y = undefined;
    });
  }
}

class Particle {
  constructor(x, y, directionX, directionY, size, color, global) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.opacity = 100;
    this.frames = 0;
    this.rand = (Math.random() * 100) + 105;
    this.global = global
  }
  draw() {
    this.global.ctx.beginPath();
    this.global.ctx.arc(this.x, this.y, this.size, Math.PI * 2, false);
    this.global.ctx.fillStyle = this.color;
    this.global.ctx.fill();
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
    if (this.directionX > 2 || this.directionX < -2)
      this.directionX = Math.sign(this.directionX) * 1.5;
    if (this.directionY > 2 || this.directionY < -2) 
      this.directionY = Math.sign(this.directionY) * 1.5;
    if (this.opacity > 1 || this.opacity < .3)
      this.opacity = .5;
    if (this.x > this.global.canvas.width || this.x < 0) 
      this.directionX = -this.directionX;
    if (this.y > this.global.canvas.height || this.y < 0) 
      this.directionY = -this.directionY;
    let dx = this.global.mouse.x - this.x;
    let dy = this.global.mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.global.mouse.radius + this.size) {
      if (this.global.mouse.x < this.x && this.x < this.global.canvas.width - this.size * 10) {
        this.directionX = -this.directionX;
        this.x += 10;
      }
      if (this.global.mouse.x > this.x && this.x > this.size * 10) {
        this.directionX = -this.directionX;
        this.x -= 10;
      }
      if (this.global.mouse.y < this.y && this.y < this.global.canvas.height - this.size * 10) {
        this.directionY = -this.directionY;
        this.y += 10;
      }
      if (this.global.mouse.y > this.y && this.y > this.size * 10) {
        this.directionY = -this.directionY;
        this.y -= 10;
      }
    }
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

class Screen{
  constructor(){
    this.particles = [];
    this.global = new Global();
    this.events = new Events(this.global);
    this.animate = () => {
      requestAnimationFrame(this.animate);
      this.global.ctx.clearRect(0, 0, this.global.windowWidth, this.global.windowHeight);
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
      }
      this.conntect();
    }
    this.init()
  }
  
 init() {
  for (let i = 0; i < 250; i++) {
    let size = (Math.random() * 5) + 1;
    let x = Math.random() * ((this.global.windowWidth - size * 2) - size * 2) + size * 2;
    let y = Math.random() * ((this.global.windowHeight - size * 2) - size * 2) + size * 2;
    let direction = (Math.random() * 2) - 2.5;
    let rand = (Math.random() * 100) + 105;
    let opacity = (Math.random() * 100) * .1;
    let color = `rgba(${rand},50,${rand},${opacity})`;
      this.particles.push(new Particle(x, y, direction, direction, size, color, this.global));
    }
  this.animate();
  }
  
  conntect() {
    for (let a = 0; a < this.particles.length; a++) {
      let linelimit = 5;
      let count = 0;
      for (let b = a; b < this.particles.length; b++) {
        let distance = ((this.particles[a].x - this.particles[b].x)
          * (this.particles[a].x - this.particles[b].x))
          + ((this.particles[a].y - this.particles[b].y)
            * (this.particles[a].y - this.particles[b].y));
        if (distance < ((this.global.windowWidth / 10) * (this.global.windowHeight / 10))) {
          if (count < linelimit) {
            let rand = (Math.random() * 100) + 105;
            let color = 'rgb(' + rand + ',50' + ',' + rand + ')'
            this.global.ctx.strokeStyle = color;
            this.global.ctx.lineWidth = 1;
            this.global.ctx.beginPath();
            this.global.ctx.moveTo(this.particles[a].x, this.particles[a].y);
            this.global.ctx.lineTo(this.particles[b].x, this.particles[b].y);
            this.global.ctx.stroke();
          }
          count++;
        }
      }
    }
  }
}
const screen = new Screen();