/*
  This Component is the middle ware for login route. It will get the token and status of authorization from backend.
  If auth is success it will store token in localStorage.
  If auth is failed then it will redirect to homepage.
*/
import Axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useContext } from 'react';

import * as authFunctions from '../src/api/authFunctions';
import Spinner from '../src/components/Spinner';
import UserContext from '../src/components/UserContext';

export default function loginMiddleWare() {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (router.query.status === '200') {
      // Set logged In here
      // Redirect to feed page
      console.log(router.query.token);
      localStorage.setItem('token', router.query.token);
      Axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${router.query.token}`
        }
      })
        .then((res) => {
          // store the data in the local Storage
          const user = {
            // eslint disable-next-line
            uid: res.data.data._id,
            name: res.data.data.name,
            profileImageUrl: res.data.data.profileImage
          };

          localStorage.setItem('user', authFunctions.secureToken(user));
          // Set the USer Context for the New User here
          // eslint disable-next-line
          setUser({
            uid: res.data.data._id,
            name: res.data.data.name,
            profileImageUrl: res.data.data.profileImage
          });
        })
        .catch(() => {
          authFunctions.logout();
        });
      router.replace('/feed');
    } else {
      authFunctions.logout();
    }
  }, []);
  return <Spinner />;
}
