let src = ''
let img = null
let name = ''

function handleUpload (files) {
  const reader = new FileReader()

  reader.onload = function load () {
    src = reader.result
    img = new Image()
    img.src = src
    img.onload = function loadImage () {
      render()
    }
  }

  name = files[0].name
  reader.readAsDataURL(files[0])
}

function createFileName (n) {
  if (n < 10) {
    return '000' + n
  } else if (n < 100) {
    return '00' + n
  } else if (n < 1000) {
    return '0' + n
  } else {
    return n
  }
}

function generate () {
  if (!img) {
    alert('Please provide an image!')
    return
  }

  const cellWidth = parseInt(document.getElementById('cell-width').value, 10)
  const cellHeight = parseInt(document.getElementById('cell-height').value, 10)

  if (!cellWidth || !cellHeight || cellWidth < 1 || cellHeight < 1) {
    alert('Cell size must be at least 1x1!')
    return
  }

  if (img.width % cellWidth !== 0 || img.height % cellHeight !== 0) {
    alert('Cell size must be a divisor of the spritesheet size.')
    return
  }

  window.location.hash = cellWidth + 'x' + cellHeight

  const result = {
    frames: {},
  	meta: {
  		app: 'http://gustavgb.github.io/spritesheet-json',
  		version: '1.0',
  		image: name,
  		format: 'RGBA8888',
  		size: {
  			w: img.width,
  			h: img.height
  		},
  		scale: 1
  	}
  }

  const width = img.width / cellWidth
  const height = img.height / cellHeight

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const n = x + y * width
      const fileName = createFileName(n)

      result.frames[fileName] = {
        frame: {
          x: x * cellWidth,
          y: y * cellHeight,
          w: cellWidth,
          h: cellHeight
        },
        rotated: false,
        trimmed: false,
  			spriteSourceSize: {
  				x: 0,
  				y: 0,
  				w: 128,
  				h: 128
  			},
  			sourceSize: {
  				w: 128,
  				h: 128
  			}
      }
    }
  }

  document.getElementById('result').value = JSON.stringify(result)
  document.getElementById('msg').innerText = 'Save the text above as "' + name.replace(/.\w*$/, '.json') + '" alongside the spritesheet image file.'
}

function render () {
  const canvas = document.getElementById('can')
  const ctx = canvas.getContext('2d')

  canvas.width = 800
  canvas.height = (img.height / img.width) * 800

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  document.getElementById('result').value = ''
  document.getElementById('msg').innerText = ''
}

window.addEventListener('load', function () {
  if (window.location.hash && window.location.hash.length > 1) {
    const size = window.location.hash.replace('#', '')
    document.getElementById('cell-width').value = size.split('x')[0]
    document.getElementById('cell-height').value = size.split('x')[1]
  }
})
