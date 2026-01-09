import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import React, { useEffect, useState, createContext, useContext } from "react";
import { firebaseAuth } from "../firebase/BaseConfig";
import {
  UserFormValues,
  LoginFormValues,
  IAuth,
} from "../interfaces/interfaces";
import {
  firebaseSignIn,
  firebaseSignOut,
  firebaseSignUp,
} from "../firebase/AuthService";

export const AuthContext = createContext<IAuth | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  //Sign up
  const signUp = (creds: UserFormValues) => {
    setIsLoading(true);
    firebaseSignUp(creds)
      .then(async (signUpResult) => {
        const { user } = signUpResult; //object destructuring
        if (user) setCurrentUser(user);
        //redirect the user on the targeted route
        else {
          //do something if user is empty like an alert
        }
        setIsLoading(false);
      })
      .catch((error) => {
        //check for error
        if (error.code === "auth/email-already-in-use") {
          //show an alert or console
        } else if (error.code === "auth/too-many-requests") {
          //do something like an alert
        }
        // you can check for more error like email not valid or something
        setIsLoading(false);
      });
  };

  //Sign in
  const signIn = async (creds: LoginFormValues, onSuccess: () => void) => {
    setIsLoading(true);
    firebaseSignIn(creds)
      .then((signInResult) => {
        const { user } = signInResult;
        if (user) {
          setCurrentUser(user);
          onSuccess();
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          console.error("Invalid credentials");
        } else if (error.code === "auth/too-many-requests") {
          console.error("Too many attempts");
        }
        setIsLoading(false);
      });
  };

  //Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut();
      setCurrentUser(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Sign out error:", error);
    }
  };

  //create Auth Values
  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    signIn,
    signUp,
    signOut,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isAuthLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
