import { createContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import socketIo from 'socket.io-client';
import { setUser } from '../actions/users';

export const SocketContext = createContext();

export const SocketProvider = (props) => {
  const [socket, setSocket] = useState();
  const dispatch = useDispatch();
  let loggedUser = useSelector((state) => state.user.user);

  useEffect(() => {
    // socket = socketIo.connect('https://mern-chat-project.herokuapp.com', {
    const newSocket = socketIo.connect('localhost:5000', {
      transports: ['websocket'],
    });

    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', function () {
      console.log(`Hurrah Socket ${socket.id} Connected`);
      // console.clear();
    });
  }, [socket]);
  useEffect(() => {
    if (!socket) return;

    socket.on('new_notification', (data) => {
      console.log(`data`, data);

      console.log(`loggedUser`, loggedUser);

      if (
        JSON.stringify(data.userId) !== JSON.stringify(loggedUser._id)
      )
        return;

      let newUser = {
        ...loggedUser,
        notifications: loggedUser.notifications
          ? [...loggedUser.notifications, data.notification]
          : [data.notification],
      };

      console.log(`newUser`, newUser);

      dispatch(setUser({ user: newUser }));
    });
  }, [socket, loggedUser]);

  // useEffect(() => {
  //   setCurrentUser(loggedUser);
  //   console.log(`loggedUser`, loggedUser);
  // }, [loggedUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
