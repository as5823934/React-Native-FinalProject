import firebase from 'firebase';

export const GOOGLE_API_KEY = 'AIzaSyDJ5qmWbAlu1uxzag2EN3DoVtYVQMVa50o';
export const initAuthApp = () => {
  firebase.initializeApp({
    apiKey: 'AIzaSyDw-Ov_v_OgUVFmEkr8QibrbFPvqc83Gms',
    authDomain: 'auth-7c8a5.firebaseapp.com',
    databaseURL: 'https://auth-7c8a5.firebaseio.com',
    projectId: 'auth-7c8a5',
    storageBucket: '',
    messagingSenderId: '446596109906',
  });
  console.log('firebase init');
};

export const getUserInfo = async uid => {
  //   await firebase.database().ref('users/').once('value').then((ref) => {
  //     // const myemail = (data.val() && data.val().email) || 'Anonymous';
  //     // console.log(email);
  //     const data = await ref.toJSON();
  //     data.map((x) => {
  //       console.log(x);
  //     });
  //   });
  const data = await firebase
    .database()
    .ref('users/')
    .child(uid)
    .once('value');
  const result = await data.toJSON();
  return result;
};
