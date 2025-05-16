document.getElementById('subjectSelect').addEventListener('change', function() {
    var selectedValue = this.value;
    var startTestButton = document.getElementById('startTestButton');
    if (selectedValue) {
        startTestButton.disabled = false;
        startTestButton.setAttribute('data-url', selectedValue);
    } else {
        startTestButton.disabled = true;
        startTestButton.removeAttribute('data-url');
    }
});

document.getElementById('startTestButton').addEventListener('click', function() {
    var url = this.getAttribute('data-url');
    if (url) {
        window.location.href = url;
    } else {
        alert('Please select a subject.');
    }
});
