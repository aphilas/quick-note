
const note_ = document.querySelector('.note')

const storage = window.localStorage

const restore = _ => {
  const saved = storage.getItem('note')
  if (note_ && saved) note_.value = saved
}

const save = text => {
  storage.setItem('note', text)
  console.log('Saved')
}

const handleInput = event => {
  save(event.target.value)
}

const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

note_.addEventListener('input', throttle(handleInput, 500))

/*
 * TODO:
 * support Escape to blur() text area
 * insert spaces instead - https://jsfiddle.net/joaocolombo/wWk4x/
 */

const handleKeydown = event => {
  if (event.key == 'Tab') {
    event.preventDefault()

    el = event.target
    const start = el.selectionStart
    el.value = el.value.substring(0, el.selectionStart) 
      + '\t' + el.value.substring(el.selectionEnd)
    el.selectionEnd = start + 1
  }
}

note_.addEventListener('keydown', handleKeydown)

// init - run on start
;(_ => {
  restore()
})()