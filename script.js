// Add more of the folder names here.
const folders = [ 'Raines','Axford', 'Solomon', 'Axford2']
let currentFolderIndex = 0 

// Add folder name as key and images inside as values in an array of strings
// in the order you want it to be rendered from background to foreground.
const imageSets = { 
    Axford : [
        'bg.webp',
        'Monitors.webp',
        'LineShips.webp',
        'Container.webp',
        'Axford.webp',
    ],
    Solomon : [
        'bg.webp',
        'CorvetteBack.webp',
        'VauxMid.webp',
        'SolFront.webp',
    ],
    Raines: [
        'bg.webp',
        'RainesBack.webp',
        'RainesFront.webp',
    ],
    Axford2: [
        'bg.webp',
        'Axford.webp',
    ]
}

function changeImage() { 
    const folderName = folders[currentFolderIndex]
    const folderPath = `./assets/${folderName}/`
    const images = imageSets[folderName]

    const innerDiv = document.querySelector('.inner')
    innerDiv.innerHTML = '' //clear current img tag

    //Add new images
    images.forEach((file, index) => { 
        const imageElement = document.createElement('img')
        imageElement.src = `${folderPath}${file}`
        imageElement.className = 'layer'
        imageElement.id = `layer-${index+1}`
        imageElement.alt = ''
        innerDiv.appendChild(imageElement)
    })
    initParallax()
    currentFolderIndex = (currentFolderIndex + 1) % folders.length
}

function initParallax() { 
    const layersArray = Array.from(document.getElementsByClassName('layer'))

    const layers = layersArray.map((el, index) => ({
                        el: el,
                        strength: index < layersArray.length-2
                                ? (index + 0.5) * ((3 ** 2 ) - (index + 1)) 
                                : (index + 1) * ((3 ** 2 ))
                    })).filter(obj => obj.el)
    console.log(layersArray)
    console.log(layers)

    if(!layers.length) console.error('Error, no layers.')
    if(!layers.length) return

    //like this : 
    // const layers = [
    //     { el: document.getElementById('layer-1'), strength: 12 }, // far/back (moves least)
    //     { el: document.getElementById('layer-2'), strength: 16 },
    //     { el: document.getElementById('layer-3'), strength: 20 },
    // ].filter(obj => obj.el) 

    layers.forEach(( { el } ) => { 
        gsap.set(el, { xPercent: -50, yPercent: -50, force3D : true})
    })
    const movers = layers.map(({ el }) => ({
        x: gsap.quickTo(el, "x", { duration: 0.2, ease: "power3.out"}),
        y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" })
    }))
    function onMove(e) { 
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const relX = (e.clientX - centerX) / centerX // -1 (left)  .. 0 (center) .. 1 (right)
        const relY = (e.clientY - centerY) / centerY 

        layers.forEach(({ strength }, i ) => { 
            //Invert Mouse 
            const moveX = -relX * strength
            const moveY = -relY * strength
            movers[i].x(moveX) 
            movers[i].y(moveY)
        })
    }
    //Not used
    function onLeave() {
        movers.forEach(m => {
        m.x(0);
        m.y(0);
        });
    }
    const container = document.querySelector('.inner') || window;
    container.addEventListener('pointermove', onMove);
//  container.addEventListener('pointerleave', onLeave);    

}

changeImage() 