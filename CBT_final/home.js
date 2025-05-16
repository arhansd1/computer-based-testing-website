document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("popup");
    var btn = document.getElementById("about-link");
    var span = document.getElementsByClassName("close")[0];

    if (modal && btn && span) {
        modal.style.display = "none";
        // When the user clicks on the button, open the modal
        btn.onclick = function() {
            modal.style.display = "flex";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    var loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'admin1.html';
        });
    }
});
