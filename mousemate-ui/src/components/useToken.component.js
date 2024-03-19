import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const userToken = sessionStorage.getItem('token');
    return userToken
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken, userName, userPermissions) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    sessionStorage.setItem('user', userName);
    sessionStorage.setItem('permissions', userPermissions)
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  }
}