window.addEventListener('load',()=>{
    
    const btnShow = document.getElementsByClassName('btnShow')
    const code = document.getElementsByClassName('jsonCode')

    for (let i = 0; i < btnShow.length; i++) {
        console.log("assdddda",btnShow[i]);;
        // aca logica mostrar/ocultar
        btnShow[i].addEventListener('click',()=>{
            if (btnShow[i].innerHTML === 'Ocultar ↑') {
                btnShow[i].innerHTML = 'Mostrar ↓'
                code[i].classList.add("ocultar")
            } else {
                btnShow[i].innerHTML = 'Ocultar ↑'
                code[i].classList.remove("ocultar")
            }
        }) 
    }

    
})