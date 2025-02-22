import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { LucideUserCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/AuthSlice";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {Spinner} from "./index";

function UserAvatar({
  // imageUrl = "https://avatar.iran.liara.run/public/36",
  fallback = "UA",
}) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const axiosPrivate = useAxiosPrivate();
  const [openDialog, setOpenDialog] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      const res = await axiosPrivate.get("/user/logout");
      if (res?.data?.success) {
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      if (
        error?.message === "Access token is missing." ||
        error?.message === "Forbidden access."
      ) {
        navigate("/auth", { state: { from: location }, replace: true });
      }
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || error?.message,
      });
    } finally {
      setLoading(false)
    }
  };
  return (
    <Popover open={openDialog}>
        <PopoverTrigger asChild tabIndex={0} aria-label='user-profile' role="button"
         onKeyDown={(e)=>{
          if(e.key === "Enter"|| e.key === ' ' || e.key === 'Esc') {
            e.preventDefault()
            setOpenDialog(prev=>!prev)
          }
        }}
        onClick={()=>setOpenDialog(prev=>!prev)}
        >
          <Avatar >
            <AvatarFallback className="select-none cursor-pointer">
              <LucideUserCircle className="size-full text-zinc-700" />
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className={'w-full'}>
          <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="flex gap-2 w-full p-2 rounded-md select-none">
                <LucideUserCircle /> {user?.email}
            </h2>
            <button onKeyDown={(e)=>{ if(e.key === 'Escape'){
              e.stopPropagation()
              setOpenDialog(prev=>!prev)
            } }} 
            className="self-end text-xs sm:text-sm border-[1px] px-4 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100" onClick={handleLogout}>
              {loading ? <Spinner className={'grid'} width="w-[1rem]" /> :"Logout"}
            </button>
          </div>
        </PopoverContent>
    </Popover> 
  );
}

export default UserAvatar;
