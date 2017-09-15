import Login from './lib/Login';

const bodyClassName = $('body').attr('id');
console.log(bodyClassName);

switch (bodyClassName) {
    case 'login':
        new Login;
        break;
    default:

}
