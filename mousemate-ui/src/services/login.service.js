import http from "../http-common";

const checkUser = (user) => {
    return http.get(`/login/${user}`)
}

const LoginService = {
    checkUser
};

export default LoginService;