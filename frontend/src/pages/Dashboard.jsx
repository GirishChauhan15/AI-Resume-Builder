import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useSelector } from "react-redux";
import {AddResume, ResumeCardItem, Skeleton} from "../components/customComponents/index";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumeList, setResumeList] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true)
  const [loader, setLoader] = useState(false)

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();

    user?._id && fetchAllResume(controller.signal);

    return () => {
      controller.abort();
      setLoading(false)
    };
  }, [user]);

  const fetchAllResume = 
  useCallback(
    async (signal) => {
      setLoading(true)
      try {
        const res = await axiosPrivate.get("/resume/all-resume", { signal });
        if (res?.data?.data?.length) {
          setResumeList(res?.data?.data);
        }
      } catch (error) {
        if (
          error?.message === "Access token is missing." ||
          error?.message === "Forbidden access."
        ) {
          navigate("/auth", { state: { from: location }, replace: true });
        }
        if(error?.message !== 'canceled'){
          toast({
            variant: "destructive",
            title: error?.message,
          });
        }
      } finally {
          setLoading(false);
      }
    },
    [user]
  );

  const handleDelete = async (...args) => {
    let resumeId = [...args];
    setLoader(true)
    if(resumeId[0] !== null && resumeId[0] !== undefined) {
      try {
        const res = await axiosPrivate.delete(
          `/resume/delete-resume/${resumeId[0]}`
        );
        if (res?.data?.success) {
          let updatedList = resumeList?.filter(resume=> resume?._id !== resumeId[0])
          setResumeList(updatedList)
          toast({
          variant: "success",
          title: res?.data?.message || 'Success.',
        });
        }
        else {return}
      } 
    catch (error) {
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
    } finally {
        setLoader(false);
    }
    } else {
      toast({
        variant: "destructive",
        title: "Invalid resume id.",
      });  
    }
  }

return (
  <main aria-labelledby="dashboard_header" className="px-6 md:px-12 pt-16 min-[380px]:pt-20 min-w-[280px]">
      <h2 id="dashboard_header" className="font-bold text-2xl sm:text-3xl">My resume</h2>
      <p>Start creating AI resume to get your next job role.</p>
      <section className="grid place-items-center max-[480px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        <AddResume />
        {loading && <Skeleton /> }
        {!loading ?
          resumeList?.length > 0 ? resumeList?.map(resume=>(
            <ResumeCardItem resume={resume} handleDelete={handleDelete} loading={loader} key={resume?._id} />
          ))
          : null
          : null
        }
      </section>
    </main>
  );
}

export default Dashboard;
