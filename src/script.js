import * as THREE from 'three';
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
//import testTexture from '../static/sky1.jpg';
import gsap from 'gsap'
import dat from 'dat-gui'



export default class Sketch{
    constructor(options){
        this.scene = new THREE.Scene();

        this.container = options.domElement;
        this.width=this.container.offsetWidth;
        this.height=this.container.offsetHeight;
       

        this.renderer = new THREE.WebGLRenderer( { 
            antialias: true,
           alpha: true
         } );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding
        //this.renderer.setClearColor(0x212121, 1)
        this.renderer.setPixelRatio(Math.min(devicePixelRatio),2);
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera( 70, this.width/this.height, 0.01, 10 );
        this.camera.position.z = 1;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true

        
        this.time = 0;
        // METHODS
        this.resize()
        this.addObjects()
        this.render();
        this.setupResize()
        //this.addlights()
        //this.settings()
        this.materials = []
        this.meshes = []
        this.groups = []
        
        this.handleImages()

    }

    handleImages(){
        let images = [...document.querySelectorAll('img')]
        
        images.forEach((img, i)=> {
            let m = this.material.clone()
            this.materials.push(m)
            let group = new THREE.Group()
            m.uniforms.uTexture.value = new THREE.Texture(img)
            m.uniforms.uTexture.value.needsUpdate = true

            let geo = new THREE.PlaneBufferGeometry(0.85,0.80,20,20)
            let mesh = new THREE.Mesh(geo, m)
            group.add(mesh)
            this.groups.push(group)
            this.scene.add(group)
            this.meshes.push(mesh)
            group.position.y += i*0.09
            group.position.x = 0.25
            group.position.z = -.25
            group.rotation.y = -0.45
        })
    }

    resize(){
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = this.width/this.height;
        this.camera.updateProjectionMatrix();

    }

    setupResize(){
        window.addEventListener('resize',this.resize.bind(this));
    }

    addObjects(){
        this.geometry = new THREE.PlaneBufferGeometry( 1, 1,100,100);
          //f  this.geometry = new THREE.SphereBufferGeometry( 0.5, 12,10);
        console.log(this.geometry)
        this.material = new THREE.ShaderMaterial({
            // wireframe: true,
            transparent: true,
            uniforms: {
                time: { value: 1.0 },
                uTexture: {value: null /* new THREE.TextureLoader().load(testTexture) */},
                distanceFromCenter : {value: 0},
                resolution: { value: new THREE.Vector2() }
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            side: THREE.DoubleSide
        })

        this.plane = new THREE.Mesh( this.geometry, this.material );
        //this.scene.add( this.plane ); 
    }

    addlights(){
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        this.scene.add(directionalLight)
    }

    render(){
        this.time += 0.05;
        
        if(this.materials){
            this.materials.forEach(m => {
                m.uniforms.time.value = this.time
            })
        }


        this.material.uniforms.time.value = this.time;
        
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render( this.scene, this.camera );
        // console.log(this.time);
        
    }

}


// guardo sketch en variable para poder utilizar data en evento de mouse
let sketch = new Sketch({
    domElement: document.getElementById('container')
});





let attractMode = false
let attractTo = 0

let speed = 0
let position = 0
let rounded = 0
let block = document.getElementById('block')
let wrap = document.getElementById('wrap')

let elems = [...document.querySelectorAll('.n')];

window.addEventListener('wheel', (e) => {
    speed += e.deltaY*0.0003
})

let objs = Array(4).fill({dist: 0})

function raf(){
    position += speed
    speed *= 0.8 

    objs.forEach((o,i) => {
        o.dist = Math.min(Math.abs(position - i),1)
        o.dist = 1 - o.dist**2 
        elems[i].style.transform = `scale(${1 + 0.4*o.dist})`

        let scale = 1 + 0.5*o.dist

        sketch.meshes[i].position.y = i*1.2 - position*1.2
        sketch.meshes[i].scale.set(scale,scale,scale)
        sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist

    })

    rounded = Math.round(position)

    let diff = (rounded - position)

    if(attractMode){
        position += -(position - attractTo)*0.03
    } else {
        position += Math.sign(diff)*Math.pow(Math.abs(diff),0.7)*0.015
    
        //block.style.transform = `translate(0,${position*100}px)` 
       wrap.style.transform = `translate(0,${- position*100 + 50}px)`
       
    }
   
   
   
    window.requestAnimationFrame(raf)
}

raf()
// termino de ejecutar funcion de animacion 


// arranca interactividad con el nav

let navs = [...document.querySelectorAll('li')]
let nav = document.querySelector('.nav')
let rots = sketch.groups.map((e) => e.rotation)
console.log(rots);

nav.addEventListener('mouseenter', () => {
    attractMode = true
    gsap.to(rots,{
        duration: 0.3,
        x: 0,
        y: 0,
        z: 0
    })
    
}) 

nav.addEventListener('mouseleave', () => {
    attractMode = false
    gsap.to(rots,{
        duration: 0.3,
        x: 0,
        y: -0.45,
        z: 0
    })
})

navs.forEach((el) => {
   
    el.addEventListener('mouseover', (e) => {
            
    attractTo = Number(e.target.getAttribute('data-nav'))
    console.log(attractTo);
    })
})




