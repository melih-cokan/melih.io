const myNav = document.querySelector('.header');
let isScrolled = false;
window.onscroll = function (e) {
    if (document.documentElement.scrollTop >= 1 && document.documentElement.scrollTop < 700) {
        myNav.classList.add("nav-colored");
        myNav.classList.remove("nav-transparent");
        myNav.classList.remove("nav-colored-2");
        if (!isScrolled) {
            console.log('started')
            StartTheGame()
            const asd = new Typed('.tetris-text', {
                strings: ['What about some...          Tetris ?'],
                typeSpeed: 100,
                backSpeed: 100,
                backDelay: 1000,
            })
            isScrolled = true
        }
    }
    else if (document.documentElement.scrollTop >= 700) {
        myNav.classList.add("nav-colored-2");
        myNav.classList.remove("nav-colored");
    }
    else {
        myNav.classList.add("nav-transparent");
        myNav.classList.remove("nav-colored");
        myNav.classList.remove("nav-colored-2");
    }
};

const typed = new Typed('.multiple-text', {
    strings: ['Backend', 'Frontend', 'FullStack.. (Maybe ?)'],
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 1000,
    loop: true
})

