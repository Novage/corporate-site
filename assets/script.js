function main() {
    const email = window.atob("bWFpbA==") + window.atob("dG86Y29udGFjdA==") + window.atob("QG5vdmFnZS5jb20udWE=");
    const emailElement = document.getElementById("email");
    emailElement.href = email;
    emailElement.innerHTML = email.replace("mailto:", "");
}
