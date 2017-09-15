import Login from './lib/Login';
import User from './lib/User';

const bodyClassName = $('body').attr('id');

switch (bodyClassName) {
    case 'login':
        new Login;
        break;
    case 'user':
        new User;
        break;
    default:
}
