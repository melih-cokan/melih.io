const typed =  new Typed('.multiple-text',{
    strings: ['Backend','Frontend','FullStack.. (Maybe ?)'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000, 
    loop: true
})

const asd =  setTimeout(() => {
    new Typed('.tetris-text',{
        strings: ['What about some...          Tetris ?'],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000, 
    })
}, 2500);