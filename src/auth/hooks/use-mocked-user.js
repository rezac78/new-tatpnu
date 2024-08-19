import axios from 'axios';
import { useState, useEffect } from 'react';

import { AUTH_API } from 'src/config-global';

export function useMockedUser() {
  const [users, setUser] = useState("");
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const response = await axios.get(`${AUTH_API}v1/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: `${users?.first_name} ${users?.last_name}`,
    // email: 'demo@minimals.cc',
    // address: '90210 Broadway Blvd',
    // state: 'California',
    // city: 'San Francisco',
    // zipCode: '94116',
    // about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    // role: 'admin',
    // isPublic: true,
  };

  return { user };
}
