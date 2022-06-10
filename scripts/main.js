const ENABLE_LOG = false
const THROTTLE_DELAY = 100

const note_ = document.querySelector('.note')
const storage = window.localStorage

const log = (message) => {
  if (ENABLE_LOG) {
    console.log('FastNote: ', message)
  }
}

const restore = _ => {
  const saved = storage.getItem('note')

  if (note_ && typeof saved == 'string') {
    note_.value = saved
    log('Restored or synced')
  }
}

const save = text => {
  storage.setItem('note', text)
}

const handleInput = event => {
  save(event.target.value)
}

// Throttle and run at the end
// See https://towardsdev.com/debouncing-and-throttling-in-javascript-8862efe2b563
const throttle = (func, limit) => {
  let lastFunc
  let lastRan

  return function(...args) {
    const context = this

    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args)
            lastRan = Date.now()
          }
       }, limit - (Date.now() - lastRan))
    }
  }
}


note_.addEventListener('input', throttle(handleInput, THROTTLE_DELAY))

// Detect changes from another tab
window.addEventListener('storage', throttle(restore, THROTTLE_DELAY))

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