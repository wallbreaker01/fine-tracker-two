import {
  Bell,
  Calendar,
  FileText,
  Home,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SignInInput, SignUpInput } from "./formValidation";

export const navItems: { title: string; href: string }[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Fines", href: "/fines" },
  { title: "Calender", href: "/calender" },
  { title: "Party", href: "/party" },
  { title: "Notifications", href: "/notifications" },
  { title: "Profile", href: "/profile" },
];

export const iconMap: Record<string, LucideIcon> = {
  "/": Home,
  "/calender": Calendar,
  "/fines": FileText,
  "/notifications": Bell,
  "/party": Users,
  "/profile": User,
};

export const authRoutes = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
} as const;

export const authValidationMessages = {
  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email address",
  passwordRequired: "Password is required",
  nameRequired: "Name is required",
  confirmPasswordRequired: "Confirm password is required",
  passwordMismatch: "Passwords do not match",
} as const;

export const partyFundGoalAmount = 10000;


export const signInInitialState: SignInInput = {
    email: "",
    password: "",
}

export const signUpInitialState: SignUpInput = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
});


export const FormLabels = {
    "sign-in": {
        title: "Sign In",
        subtitle: "Sign in to continue to Fine Tracker",
        submitLabel: "Sign In",
        altPrompt: "Don't have an account? ",
        altLinkLabel: "Sign Up",
    },
    "sign-up": {
        title: "Create Account",
        subtitle: "Create an account to start tracking fines",
        submitLabel: "Create Account",
        altPrompt: "Already have an account? ",
        altLinkLabel: "Sign In",
    },
}