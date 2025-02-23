document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    const profileMessage = document.getElementById('profile-message');
    const facebookLinkInput = document.getElementById('facebookLink');
    const twitterLinkInput = document.getElementById('twitterLink');
    const instagramLinkInput = document.getElementById('instagramLink');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');

     const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline-block';
        profileLink.style.display = 'inline-block';
    } else {
        loginLink.textContent = 'Login';
        loginLink.style.display = 'inline-block';
        logoutLink.style.display = 'none';
        profileLink.style.display = 'none';
        window.location.href = 'social_login.html';
    }

    logoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });


    const userSocialData = JSON.parse(localStorage.getItem('userSocialData'));
    if (userSocialData) {
        facebookLinkInput.value = userSocialData.facebookLink || '';
        twitterLinkInput.value = userSocialData.twitterLink || '';
        instagramLinkInput.value = userSocialData.instagramLink || '';
    }


    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);


        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                profileMessage.textContent = data.message;
                profileMessage.style.color = "green";

                 setTimeout(() => {
                     window.location.href = 'social_media.html';
                 }, 1500);

            } else {
                profileMessage.textContent = data.message;
                profileMessage.style.color = "red";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            profileMessage.textContent = 'An error occurred while saving profile.';
            profileMessage.style.color = "red";
        });


    });
});