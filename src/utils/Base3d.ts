import * as THREE from 'three'
import { Clock, PerspectiveCamera, Scene, WebGLRenderer, AnimationMixer } from 'three'
import Stats from 'stats.js'
// 导入控制器，轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入模型解析器
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { geometries } from './geometries'
import GUI from 'lil-gui';

class Base3d {
  public geometryId: number
  public container: HTMLElement
  public camera: PerspectiveCamera
  public scene: Scene
  public stats
  public clock: Clock
  public renderer: WebGLRenderer
  public controls: OrbitControls
  public mixer: AnimationMixer | null
  public extrudingSettingsDepth: number
  public shape: THREE.Shape
  public extrudeSettings: any
  public material: any
  public mesh: any
  public meshParameters: THREE.MeshPhongMaterialParameters

  constructor(selector: string, geometryId: number) {
    this.geometryId = geometryId
    this.container = document.querySelector(selector) as HTMLElement
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100)
    this.scene = new THREE.Scene()
    this.stats = new Stats()
    this.clock = new THREE.Clock()
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.mixer = null
    this.shape = new THREE.Shape()
    this.extrudingSettingsDepth = 20
    this.meshParameters = {color: 135447, wireframe: false}
    this.init()
  }

  init() {
    this.initStats()
    // 初始化渲染器
    this.initRenderer()
    // 初始化场景
    this.initScene()
    // 初始化相机
    this.initCamera()
    // 控制器
    this.initControls()
    // init GUI
    this.initGUI()
    // 添加物体
    this.setModel()
    // build mesh
    this.builMesh()
    // 监听场景大小改变，调整渲染尺寸
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  initStats() {
    this.container.appendChild(this.stats.dom)
  }

  initScene() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    this.scene.background = new THREE.Color(0xbfe3dd)
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
  }

  initCamera() {
    this.camera.position.set(10, 10, 90)
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0.5, 0)
    this.controls.update()
    this.controls.enablePan = false
    this.controls.enableDamping = true
  }

  initGUI() {
    const gui = new GUI();
    gui.add( this, 'extrudingSettingsDepth', 0, 100, 1 )
      .name( 'Depth' )
      .onChange( (value: number) => {
        this.scene.remove(this.mesh)
        this.builMesh()
      });

    gui.add( this.meshParameters, 'wireframe' )
      .name( 'Wireframe' )
      .onChange( (value: boolean) => {
        this.scene.remove(this.mesh)
        this.builMesh()
      });
      
    gui.addColor( this.meshParameters, 'color' )
      .name( 'Color' )
      .onChange( (value: number) => {
        this.scene.remove(this.mesh)
        this.builMesh()
      })
  }  

  initRenderer() {
    // 设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // 渲染的尺寸大小
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.container.appendChild(this.renderer.domElement)
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this))
    const delta = this.clock.getDelta()
    this.mixer?.update(delta)
    this.controls.update()
    this.stats.update()
    this.renderer.render(this.scene, this.camera)
  }

  setModel() {
    const xy = geometries.find(item => item.id == this.geometryId)
    if (!xy) {
      return;
    }    
    const points: THREE.Vector2[] = xy?.data.map(item => new THREE.Vector2(item[0], item[1]))

    if (points[0].x !== 0 || points[0].y !== 0 )  {
      points.unshift(new THREE.Vector2(0, 0))
    }
    if (points[points.length-1].x !== 0 || points[points.length-1].y !== 0 )  {
      points.push(new THREE.Vector2(0, 0))
    }

    this.shape.setFromPoints(points)
  }

  builMesh() {
    this.extrudeSettings = {
      bevelEnabled: false,
      depth: this.extrudingSettingsDepth
    };
    
    const geometry = new THREE.ExtrudeGeometry( this.shape, this.extrudeSettings );
    this.material = new THREE.MeshStandardMaterial( this.meshParameters )
    this.mesh = new THREE.Mesh( geometry, this.material ) ;
    this.scene.add(this.mesh)
    this.animate()    
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

export default Base3d
