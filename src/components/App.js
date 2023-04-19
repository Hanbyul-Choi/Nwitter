import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { auth } from "fbase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if(user.displayName === null){
          const name = user.email.split('@')[0];
          user.displayName = name;
        }
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile : (args) => updateProfile(user,{displayName:user.displayName}),
        });
      }else{
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = auth.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile : (args) => updateProfile(user,{displayName:user.displayName}),
    });
  }
  return (
    <>
      {init ? (
        <AppRouter refreshUser={refreshUser} userObj={userObj} isLoggedIn={Boolean(userObj)} />
      ) : (
        "Initailizing..."
      )}
    </>
  );
}

export default App;
