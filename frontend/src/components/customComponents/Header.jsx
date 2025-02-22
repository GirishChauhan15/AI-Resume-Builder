import { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.svg";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlignRight } from "lucide-react";
import {UserAvatar} from "./index";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isActive, setIsActive] = useState(false);
  const navRef = useRef()
  const handleNavigate = useCallback(
    (path) => {
      if (location?.pathname !== path) {
        navigate(path);
      }
    },
    [location]
  );

  useEffect(()=>{
    const handleResize = () => {
        setIsActive(false)
    }
  window.addEventListener('resize', handleResize)

    return ()=> {
      window.removeEventListener('resize', handleResize)
    }
  },[isActive])

  return (
    <>
      <section
      tabIndex={0}
      ref={navRef}
        className={`no-print-zone ${isActive && "w-3/5 min-[480px]:w-2/5"} min-h-[700px] h-screen ${
          !isActive && "w-0"
        } transition-all ease-out fixed top-0 right-0 z-50 max-[320px]:pt-16 pt-20 min-[480px]:pt-20 bg-zinc-200 sm:hidden flex items-start gap-4 justify-center`}
      >
        {isActive ? (
          !user || !user?.accessToken ? (
            <>
              <Button
                className="text-xs text-wrap"
                onClick={() => {
                  if(isActive){
                    setIsActive(false)
                  }
                  handleNavigate("/auth")
                }}
              >
                Get Started
              </Button>
            </>
          ) :
           (
            <aside className="flex flex-col items-center gap-4 size-4/5">
              <Button
                className="text-xs"
                variant="outline"
                onClick={() => {
                  if(isActive){
                    setIsActive(false)
                  }
                  handleNavigate("/")
                }}
              >
                Dashboard
              </Button>
              <UserAvatar fallback={user?.email?.slice(0, 1)?.toUpperCase()} />
            </aside>
          )
        ) : null}
      </section>
      <section className="bg-zinc-200 header-full fixed w-full h-fit z-50 no-print-zone">
        <section className="flex justify-between w-full max-w-5xl flex-wrap gap-4 items-center px-5 py-3">
          {!user || !user?.accessToken ? (
            <img
            tabIndex={0}
              loading="eager" 
              fetchpriority="high"
              onClick={() => handleNavigate("/")}
              className="max-[380px]:w-3/5"
              src={logo}
              alt="Logo"
              onKeyDown={(e)=>{
                if(e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleNavigate("/")
                }
              }} 
            />
          ) : (
            <img tabIndex={0} loading="eager" fetchpriority="high" src={logo} className="max-[380px]:w-3/5" alt="Logo" />
          )}
          {
            <AlignRight
            tabIndex={0}
            onKeyDown={(e)=>{
              if(e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setIsActive(prev=> !prev)
                navRef?.current?.focus()
              }
            }}
              className="sm:hidden max-[380px]:size-5"
              onClick={() => setIsActive(prev=> !prev)}
            />
          }

          <aside className="hidden sm:block">
            {!user || !user?.accessToken ? (
              <>
                <Button onClick={() => handleNavigate("/auth")}>
                  Get Started
                </Button>
              </>
            ) : (
              <aside className="flex items-center gap-4 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => handleNavigate("/")}
                >
                  Dashboard
                </Button>
                <UserAvatar
                  fallback={user?.email?.slice(0, 1)?.toUpperCase()}
                  />
              </aside>
            )}
          </aside>
        </section>
      </section>
    </>
  );
}

export default Header;
