import { jwtDecode } from 'jwt-decode';

interface JWT {
    _id: string,
    exp: number,
    user: "student" | "company"
    iat: number  
}

function isTokenExpired(token:string) {
    const decodedToken = jwtDecode<JWT>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}

function checkAuth() { 
    const token = localStorage.getItem('token');
    if (token) {
        if (isTokenExpired(token)) {
            localStorage.removeItem('token');
            return false;
        } else {
            const decodedToken = jwtDecode<JWT>(token);
            if(decodedToken.user === 'student'){
                return "student"
            } else {
                return "company"
            }
        }
    } else {
        return false;
    }
}
export default checkAuth;