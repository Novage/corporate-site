function main() {
    const email = window.atob("bWFpbA==") + window.atob("dG86Y29udGFjdA==") + window.atob("QG5vdmFnZS5jb20udWE=");
    const emailElement = document.getElementById("email");
    emailElement.href = email;
    emailElement.innerHTML = email.replace("mailto:", "");

    document.querySelector('#navbar .navbar-toggle').addEventListener('click', menuToggle);

    subMenuToggle();
}

function menuToggle() {
    const menu = document.querySelector('#navbar .menu');
    menu.classList.toggle('show');
}

function subMenuToggle() {
    const menuItem = document.querySelectorAll('#navbar .menu-item');
    menuItem.forEach(item => item.addEventListener('click', menuItemToggle));
}

function menuItemToggle () {
    const subMenu = this.querySelector('.sub-menu');
    subMenu.classList.toggle('show');
    this.classList.toggle('switch');
}
