const lenis = new Lenis();
lenis.on("scroll",ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time*1000);
    // console.log(time);
})
gsap.ticker.lagSmoothing(0);



//THREE.js

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfefdfd);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});

renderer.setClearColor(0xffffff,1);
renderer.setSize(window.innerWidth / window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.tonMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
document.querySelector('.model').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xfffff,3);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xfffff,1);
mainLight.position.set(5,10,7.5);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xfffff,3);
fillLight.position.set(-5,0,-5);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0xfffff,0xfffff,2);
hemiLight.position.set(0,25,0);
scene.add(hemiLight);

function basicAnimate(){
    renderer.render(scene,camera);
    requestAnimationFrame(basicAnimate);
}

basicAnimate();

let model;
const loader = new THREE.GLTFLoader();
loader.load("./jostaｖ",function(gltf){
    model = gltf.scene;
    model.traverse((node)=>{
        if(node.isMesh){
            if(node.material){
                node.material.metalness = 0.3;
                node.material.roughness = 0.4;
                node.material.envMapIntensity = 1.5;
            }
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x,size.y,size.z);
    camera.position.z= maxDim * 1.5;

    model.scale.set(0,0,0);
    playInitialAnimation();

    cancelAnimationFrame(basicAnimate);
    animate();
});

const floatAmplitude = 0.2;
const floatSpeed = 1.5;
const rotationSpeed = 0.3;
let isFloating = true;
let currentScroll = 0;

const stickyHeight = window.innerHeight;
const scannerSection = document.querySelector('.scanner-section');
const scannerPosition = scannerSection.offsetTop;
const scanContainer = document.querySelector('.scan-container');
gsap.set(scanContainer,{
    scale:0
});

function playInitialAnimation() {
    if(model){
        gsap.to(model.scale,{
            x:1,
            y:1,
            z:1,
            duration:1,
            ease:"power2.out",
        });
    }
    gsap.to(scanContainer,{
        scale:1,
        duration:1,
        ease:"power2.out",
    });
}