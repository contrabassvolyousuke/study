

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// カメラ設定
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1, 5);

// レンダラー設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("container").appendChild(renderer.domElement);

// 環境光と方向光を追加
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// GLTFLoaderを使ってGLBモデルをロード
let model;
const loader = new THREE.GLTFLoader();

gsap.registerPlugin(ScrollTrigger);
loader.load("./josta.glb", (gltf) => {
    model = gltf.scene;
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    // モデルをシーンに追加
    scene.add(model);

    // モデルのアニメーション設定
    ScrollTrigger.refresh();

    gsap.to(model.rotation, {
        y: Math.PI * 2, // 1回転
        scrollTrigger: {
            trigger: "#container",
            start: "top top",
            end: "bottom bottom",
            scrub: true, // スクロール量に応じて動く
        },
    });
}, undefined, (error) => {
    console.error("An error occurred while loading the model:", error);
});

// アニメーションループ
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// リサイズ対応
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
