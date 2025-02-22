import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { RWebShare } from "react-web-share";
import { useSelector } from "react-redux";
import config from "@/config";
import {Spinner, ResumePreview} from "./index";

const Pdf = () => {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
const {user} = useSelector(state=>state.auth)
  const fetchUserResumeInfo = async (signal) => {
    setLoading(true);
    try {
      let response = await axiosPrivate.get(`/resume/${resumeId}`, { signal });
      if (response?.data?.success) {
        if (response?.data?.data) {
          setResumeInfo(response?.data?.data);
        }
      }
    } catch (err) {
      if (err?.message === "Invalid resume id.") {
        toast({
          variant: "destructive",
          title: err?.message,
        });
        navigate("/");
      }
      if (
        err?.message === "Access token is missing." ||
        err?.message === "Forbidden access."
      ) {
        navigate("/auth");
      }
      toast({
        variant: "destructive",
        title: err?.message,
      });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    let controller = new AbortController()
    fetchUserResumeInfo(controller?.signal)
      return()=>{
        controller.abort()
          setResumeInfo(null)
      }
  }, []);

  const handleDownload = () => {
    window.print()
  };

  return (
    <section className="max-w-3xl mx-auto px-6 pt-16 min-[380px]:pt-20 min-w-[280px]">
      <article className="pb-10">
        {
          user && user?._id &&
          <aside className="no-print-zone">
          <h2 className="text-center text-xl font-bold pb-2">
          <span aria-hidden="true">🎉</span> Congratulations! Your Ultimate AI-Generated Resume is Ready! <span aria-hidden="true">🎉</span>
        </h2>
        <p className="text-center text-sm text-gray-400 mb-10">
          You've just taken a huge step toward unlocking new career
          opportunities, and your resume is now ready to shine! <span aria-hidden="true">🌟</span>
        </p>
          </aside>
        }

        <section className=" max-w-5xl mx-auto shadow-lg">
          {loading && <Spinner className={"grid mx-auto"} />}
          {resumeInfo?._id === resumeId && !loading ? (
            <article id="print-screen" className="w-full h-full">
              <ResumePreview shadow={false} resumeInfo={resumeInfo} />
            </article>
          ) : null}
        </section>

        <aside className="flex justify-end gap-2 items-center flex-wrap mt-10 no-print-zone">
          <Button
            onClick={handleDownload}
            disabled={resumeInfo && resumeInfo?._id ? false : true}
            className="px-3 py-2 text-sm bg-blue-500 text-white transition-colors ease-in-out rounded-lg shadow-md hover:bg-blue-600"
          >
            Download
          </Button>
          <RWebShare
            data={{
              text: "Take a look at my professional resume!",
              url: `${
                config?.frontEndUrl
              }/resume/${resumeId}/view`,
              title: "My Resume",
            }}
          >
            <Button
              disabled={resumeInfo && resumeInfo?._id ? false : true}
              className="px-3 py-2 text-sm bg-teal-600 text-white transition-colors ease-in-out rounded-lg shadow-md hover:bg-teal-700"
            >
              Share
            </Button>
          </RWebShare>
        </aside>
      </article>
    </section>
  );
};

export default Pdf;