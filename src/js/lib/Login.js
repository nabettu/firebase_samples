export default class Login {
    constructor(opts = {}) {
        this.btnSetup();
        this.loginCheck();

        this.$infoDom = $('.js-userInfo');
    }
    btnSetup() {
        $('.js-loginBtn').on('click', e => {
            const oauthType = e.target.dataset.type;
            console.log(oauthType);
            let provider = '';
            switch (oauthType) {
                case 'facebook':
                    provider = new firebase.auth.FacebookAuthProvider();
                    break;
                case 'twitter':
                    provider = new firebase.auth.TwitterAuthProvider();
                    break;
                case 'github':
                    provider = new firebase.auth.GithubAuthProvider();
                    break;
                case 'google':
                    provider = new firebase.auth.GoogleAuthProvider();
                    break;
            }

            if (provider) {
                if ($('.js-popup').prop('checked')) {
                    firebase.auth().signInWithPopup(provider).then((result) => {
                        this.setUserInfo(result);
                    });
                } else {
                    firebase.auth().signInWithRedirect(provider).then((result) => {
                        this.setUserInfo(result);
                    });
                }
            }
        });
        $('.js-logoutBtn').on('click', e => {
            firebase.auth().signOut().then(() => {
                this.deleteUserInfo();
            });
        });
    }
    loginCheck() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("is login");
                this.setUserInfo(user);
            } else {
                console.log("is not login");
                $('.js-loginParts').show();
            }
        });
    }
    setUserInfo(user) {
        console.log(user);
        if (!user.providerData) {
            return false;
        }
        $('.js-logoutBtn').show();
        const $userInfo = $(`<div>
            <p>displayName: ${user.displayName}</p>
            <p>email: ${user.email}</p>
            <p>phoneNumber: ${user.phoneNumber}</p>
            <p>photoURL: ${user.photoURL}</p>
            <img src="${user.photoURL}" style="width: 100px; height: 100px;">
            <p>Login with ${user.providerData[0].providerId}</p>
            <p>your user page is
            <a href="../user/?id=${user.uid}">here</a>.
            </p>
            </div>`)
        $('.js-userInfo').empty().append($userInfo);
        $('.js-loginParts').hide();

        const firebaseDB = firebase.database().ref(`users/${user.uid}`)

        firebaseDB
            .once('value')
            .then((res)=>{
                console.log(res.val());
                if(!res.val()){
                    firebaseDB.set({
                        name: user.displayName,
                        photoURL: user.photoURL,
                        description: 'this is initial description.'
                    })
                }
            })
    }
    deleteUserInfo() {
        this.$infoDom.empty().text('logouted');
        $('.js-logoutBtn').hide();
        $('.js-loginParts').show();
    }
};
