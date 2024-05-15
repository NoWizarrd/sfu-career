import { jwtDecode } from 'jwt-decode';

interface JWT {
    _id: string,
    exp: number,
    iat: number  
}

function isTokenExpired(token:string) {
    const decodedToken = jwtDecode<JWT>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}

function checkAuth() { 
    console.log('log')
    const token = localStorage.getItem('token');
    if (token) {
        if (isTokenExpired(token)) {
            localStorage.removeItem('token');
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}

export default checkAuth