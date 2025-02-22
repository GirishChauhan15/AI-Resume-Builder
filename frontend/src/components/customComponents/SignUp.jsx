import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import {Spinner} from "./index";
import authService from "@/services/AuthService";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/AuthSlice";

function SignUp({ setLogin }) {
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const dispatch = useDispatch()
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;


  useEffect(() => {
    if (password !== "") {
      if (passwordRegex.test(password)) {
        setPasswordError("");
        setPasswordValid(true);
      } else if (!passwordRegex.test(password)) {
        setPasswordError(
          "Password must be 8+ characters, with at least one uppercase, one lowercase, one number, and one special character."
        );
        setPasswordValid(false);
      }
    } else {
      setPasswordError("");
      setPasswordValid(false);
    }
  }, [password]);

  useEffect(() => {
    if (email !== "") {
      if (emailRegex.test(email)) {
        setEmailError("");
        setEmailValid(true);
      } else if (!emailRegex.test(email)) {
        setEmailError("Oops! That doesn’t look like a valid email.");
        setEmailValid(false);
      }
    } else {
      setEmailError("");
      setEmailValid(false);
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSpinner(true);
    try {
      const response = await authService.createUser( email, password );
      if (response?.success) {
        dispatch(login({...response?.data}));
        toast({
                variant: "success",
                title: "Login successfully.",
              });
        setEmail("");
        setPassword("");
      }
    } catch (err) {
        if(err?.response?.data?.message || err?.message !== 'canceled') {
            dispatch(logout());
            toast({
              variant: "destructive",
              title: err?.response?.data?.message || err?.message,
            });
          } 
    } finally {
      setLoadingSpinner(false);
    }
  };
  return (
    <section className="h-full max-[280px]:w-[95%] max-[280px]:p-5 w-[80%] p-8 sm:w-[65%] md:w-[50%] rounded-lg drop-shadow-md bg-zinc-50 shadow-xl">
      <h2 className="text-3xl pb-5">Sign up</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label htmlFor="email" className="text-sm lg:text-base">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          className="text-xs lg:text-sm h-9 sm:h-12"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        {!emailValid && emailError !== "" && (
          <p className="pl-1 text-xs text-red-500">* {emailError}</p>
        )}

          <label htmlFor="password" className="text-sm lg:text-base">
            Password
          </label>
        <div className="relative">
          <Input
            id="password"
            className="text-xs lg:text-sm h-9 sm:h-12"
            type={`${isPassVisible ? "text" : "password"}`}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={'off'}
            value={password}
          />
          <span
          tabIndex={0}
          onKeyDown={(e)=>{
            if(e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsPassVisible((prev) => !prev)
            }
          }}
            onClick={() => setIsPassVisible((prev) => !prev)}
            className="absolute top-1/2 opacity-50 right-5 -translate-y-1/2 text-xs sm:text-sm"
          >
            {isPassVisible ? "Hide" : "Show"}
          </span>
        </div>
        {!passwordValid && passwordError !== "" && (
          <p className="pl-1 text-xs sm:text-sm text-red-500">
            * {passwordError}
          </p>
        )}

        <Button
          className="bg-red-400 hover:bg-red-500 text-zinc-900 lg:text-sm my-2"
          disabled={!emailValid || !passwordValid}
        >
          {loadingSpinner ? <Spinner width="w-[1.8rem]" /> : "Sign Up"}
        </Button>
      </form>

      <article className="relative my-10">
        <hr className="border-black" />
        <span className="absolute top-1/2 -translate-y-1/2 bg-zinc-50 px-5 left-1/2 -translate-x-1/2">
          or
        </span>
      </article>
      <p className="text-xs text-center sm:text-sm md:text-base text-zinc-700 pl-1">
        Already have an account?{" "}
        <span
        tabIndex={0}
        onKeyDown={(e)=>{
          if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setLogin(true)
          }
        }}
          onClick={() => setLogin(true)}
          className="text-red-600 hover:text-red-900 underline cursor-pointer"
        >
          Sign in
        </span>
      </p>
    </section>
  );
}

export default SignUp;
