import qs from 'query-string';
const params = qs.parse(location.search);
console.log(params);

export default class User {
    constructor(opts = {}) {
        this.btnSetup();
        this.idCheck();
    }
    btnSetup() {
        $('.js-logoutBtn').on('click', e => {
            firebase.auth().signOut().then(() => {
                this.deleteUserInfo();
            });
        });
        $('.js-submit').on('click', e => {
            const firebaseDB = firebase.database().ref(`users/${params.id}`)
            firebaseDB.set({
                name: $('.js-nameinput').val(),
                photoURL: $('.js-photo').attr('src'),
                description: $('.js-descinput').val()
            })
        })
    }
    idCheck() {
        const firebaseDB = firebase.database().ref(`users/${params.id}`)
        firebaseDB.once('value').then((res) => {
            console.log(res.val());
            if (res.val()) {
                $('.js-isNotUser').hide();
                $('.js-isUser').show();
                this.loginCheck();
                // this.setUserInfo(res.val());
                firebaseDB.on('value', (res) => {
                    this.setUserInfo(res.val());
                })
            } else {
                $('.js-isUser').hide();
                $('.js-isNotUser').show();
            }
        })

    }
    loginCheck() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user && user.uid == params.id) {
                console.log("is login and currentUser");
                $('.js-isLogin').show();
            } else {
                console.log("is not login or not currnet user");
                $('.js-isNotLogin').show();
            }
        });
    }
    setUserInfo(user) {
        console.log(user);
        $('.js-name').text(user.name);
        $('.js-desc').text(user.description);
        $('.js-photo').attr('src', user.photoURL);

        $('.js-nameinput').val(user.name);
        $('.js-descinput').val(user.description);
    }
    deleteUserInfo() {
        $('.js-isNotLogin').show();
        $('.js-isLogin').hide();
    }
};
