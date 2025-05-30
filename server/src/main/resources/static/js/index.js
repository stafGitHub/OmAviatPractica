window.onload = function () {
    if (localStorage.getItem("isAdminLoggedIn") === "true") {
        showAdminPanelButton();
    } else {
        hideAdminPanelButton();
    }

    if (localStorage.getItem("authToken") !== null) {
        showProfileButton();
    } else {
        hideProfileButton();
    }
};

function showAdminPanelButton() {
    document.getElementById("adminPanelButton").style.display = "block";
}

function hideAdminPanelButton() {
    document.getElementById("adminPanelButton").style.display = "none";
}

function showProfileButton() {
    document.getElementById("profileButton").style.display = "block";
}

function hideProfileButton() {
    document.getElementById("profileButton").style.display = "none";
}
