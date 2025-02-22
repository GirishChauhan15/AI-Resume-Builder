import { PlusIcon } from "lucide-react";
import { useId, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {Spinner} from "./index";
import { toast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

function AddResume() {
  let axiosPrivate = useAxiosPrivate();
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const id = useId();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = async () => {
    if(title?.length > 50) {
      toast({
        variant: "destructive",
        title: "Title exceeds maximum length.",
      });
      return null
    }
    if(title?.length <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Title.",
      });
      return null
    }

    setLoading(true);
    try {
      let res = await axiosPrivate.post("/resume/create-resume", {
        title,
      });
      if(res?.data?.success) {
        navigate(`/dashboard/resume/${res?.data?.data}/edit`)
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
        title: error?.message,
      });
      setOpenDialog(false)
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-label="add resume" tabIndex={0} onKeyDown={(e)=> {
      if(e.key === "Enter" || e.key === ' ') {
        setOpenDialog(true)
      } 
      if(e.key === 'Escape') {
        if(openDialog) {
          setOpenDialog(false)
        }
      }
      }}>
      <article
        onClick={() => setOpenDialog(true)}
        className="h-[240px] w-[180px] bg-secondary rounded-lg border flex items-center justify-center hover:scale-[1.01] transition-transform hover:shadow-lg cursor-pointer hover:border-dashed"
      >
        <PlusIcon />
      </article>

      <Dialog open={openDialog}>
        <DialogContent hideclose="true">
          <DialogHeader className="text-start">
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription asChild>
              <aside className="flex flex-col gap-2">
                <label htmlFor={id}>Add a title for your new resume.</label>
                <Input
                  onChange={(e) => setTitle(e.target.value)}
                  id={id}
                  className="h-9 sm:h-10 placeholder:text-sm"
                  placeholder="Ex. Full stack developer"
                  maxLength="50"
                  value={title}
                />
              </aside>
            </DialogDescription>
            <aside className="flex flex-wrap min-[280px]:justify-end gap-4 pt-5">
              <Button variant="outline"
                onClick={() => setOpenDialog(prev=>!prev)}
                >
                Cancel
              </Button>
              <Button 
                onClick={() => handleSubmit()}
                className="bg-red-400 hover:bg-red-500 text-zinc-900"
              >
                {loading ? <Spinner width="w-[1.6rem]" /> : "Create"}
              </Button>
            </aside>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default AddResume;
