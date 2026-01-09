import { User as FirebaseUser } from "firebase/auth";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  name?: string;
}

export interface IAuth {
  user: FirebaseUser | null;
  loading: boolean;
  signIn: (creds: LoginFormValues, onSuccess: () => void) => Promise<void>;
  signUp: (creds: UserFormValues) => void;
  signOut: () => Promise<void>;
}
