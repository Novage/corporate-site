if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

function init() {
    const email = window.atob("bWFpbA==") + window.atob("dG86Y29udGFjdA==") + window.atob("QG5vdmFnZS5jb20udWE=");
    const emailElement = document.getElementById("email");
    emailElement.href = email;
    emailElement.innerHTML = "<span>".concat(email.replace("mailto:", ""), "</span>");

    document.querySelector('#navbar .navbar-toggle').addEventListener('click', function () {
        const menu = document.querySelector('#navbar .menu');
        menu.classList.toggle('show');
        const html=document.querySelector('html');
        html.classList.toggle('show');
    });

    document.querySelectorAll('#navbar .menu-item').forEach(item => item.addEventListener('click', function () {
        const subMenu = this.querySelector('.sub-menu');
        subMenu.classList.toggle('show');
        this.classList.toggle('switch');
    }));
}
