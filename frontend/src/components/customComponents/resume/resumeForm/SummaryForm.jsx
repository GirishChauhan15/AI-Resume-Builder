import { Button } from "@/components/ui/button";
import { useResumeInfo } from "@/context/Resume.context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Brain } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {Spinner} from "../../index";
import { toast } from "@/hooks/use-toast";
import aiService from "@/services/AiModel";
import useThrottle from "@/hooks/useThrottle";

function SummaryForm({ enableSave }) {
  const [disableSave, setDisableSave] = useState(true);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiButtonActive, setAiButtonActive] = useState(false);
  const [aiGeneratedList, setAiGeneratedList] = useState([]);

  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const axiosPrivate = useAxiosPrivate();
  const { resumeId } = useParams();
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setDisableSave(false);
    if (enableSave) {
      enableSave(false);
    }
    setResumeInfo({ ...resumeInfo, summary: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDisableSave(true);
    try {
      let res = await axiosPrivate.patch(`/resume/update/${resumeId}`, {
        summary: resumeInfo?.summary,
      });
      if (res?.data?.success) {
        enableSave(true);
        toast({
          variant: "success",
          title: res?.data?.message || "Success.",
        });
        document.querySelector("#focus_Btn")?.focus();
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
      setLoading(false);
    }
  };

  const generateSummary = async (jobTitle) => {
    if (jobTitle === "Your Job Title") {
      toast({
        variant: "destructive",
        description: "Error! Job title is not valid.",
      });
      return;
    }
    setAiButtonActive(true);
    setAiLoading(true);
    let prompt =
      "For the job title:" +
      jobTitle +
      ', generate a summary for the resume with the following structure. The output should be an array with three objects based on experience level in 3 lines only: "Fresher", "Mid-Level", and "Experienced". Each section should include the following fields: "experienceLevel" and "summary". The summaries should describe the experience level for the ' +
      jobTitle +
      " role. The summaries should be written in a professional, concise manner with clear keywords that align with industry standards and increase ATS compatibility. Use the following structure as a guide, but adapt the summaries to the " +
      jobTitle +
      " role: Fresher: A highly motivated individual eager to learn and contribute to challenging projects, possessing foundational knowledge and key skills for success in the " +
      jobTitle +
      " role. Proficient in relevant tools and technologies, with a strong focus on growth and development in the field. Demonstrates a strong willingness to contribute to team goals and adapt to new environments. Mid-Level: A results-oriented individual with proven experience in the field, skilled in key aspects of the " +
      jobTitle +
      " role. Demonstrates a track record of delivering results, implementing solutions, and driving projects to completion. Strong communication and collaboration skills, able to work independently and within cross-functional teams.  Experienced: A seasoned professional with extensive experience in developing complex, scalable solutions and leading teams within the " +
      jobTitle +
      ' role. Expertise in strategic planning, project management, and stakeholder communication. Consistently delivers high-impact results, leveraging in-depth technical knowledge and leadership skills to drive innovation and growth.Ensure that the response is a simple array of objects without any code block formatting, like the following: [{ "experienceLevel": "Fresher", "summary": "..." }, { "experienceLevel": "Mid-Level", "summary": "..." }, { "experienceLevel": "Experienced", "summary": "..." }]. Please avoid adding any additional text or formatting like json or . The summaries should be crafted to align with ATS criteria for maximum visibility and increased chances of securing job interviews.';

    try {
      if (jobTitle !== undefined || jobTitle !== null) {
        let res = await aiService.getResult(prompt);
        if (Array.isArray(res)) {
          setAiGeneratedList(res);
        } else {
          setAiGeneratedList([]);
          toast({
            variant: "destructive",
            description:
              "Error! Summary is not generated or is not available at this time, Please try again later.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description:
            "Error! Summary is not generated or is not available at this time, Please try again later.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error: Unable to Process Request",
        description:
          "It seems the AI is temporarily unavailable. Please try again later.",
      });
    } finally {
      setAiLoading(false);
      setAiButtonActive(false);
    }
  };

  const throttledGenerateSummary = useThrottle(generateSummary, 90000);

  const handleAiSummary = (item) => {
    if (item?.summary?.length <= 400) {
      setResumeInfo({ ...resumeInfo, summary: item?.summary });
    } else if (item?.summary?.length >= 400) {
      let summary = item?.summary?.slice(0, 400);
      setResumeInfo({ ...resumeInfo, summary: summary });
      toast({
        variant: "destructive",
        description: "max length 400 characters only!",
      });
    }
    setDisableSave(false);
    textareaRef?.current?.focus();
  };

  return (
    <article className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 select-none">
      <h2 className="font-bold text-lg">Summary</h2>
      <p>Offer a summary for your current role.</p>

      <div className="mt-2 flex justify-between items-end gap-2 flex-wrap text-sm">
        <label htmlFor="summary-textarea">Add Summary</label>
        <Button
          variant="outline"
          className="border-2 text-primary font-bold text-xs"
          onClick={() => throttledGenerateSummary(resumeInfo?.jobTitle)}
          size="sm"
          disabled={aiButtonActive}
        >
          Create using AI <Brain />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          name="summary"
          value={resumeInfo?.summary}
          maxLength={400}
          ref={textareaRef}
          required
          onChange={(e) => handleChange(e)}
          className="border-[1px] rounded-sm resize-none min-h-16 focus:outline-offset-4 px-2 py-1 text-sm w-full focus:outline-black"
          id="summary-textarea"
        />
        <div className="flex justify-end">
          <Button
            disabled={disableSave}
            className="mt-2"
            size="sm"
            type="submit"
          >
            {loading ? <Spinner width="w-[1.6rem]" /> : "Save"}
          </Button>
        </div>
      </form>

      <section className="mt-5">
        {aiLoading ? (
          <article className="grid w-full place-items-center">
            <Spinner width="w-[2rem]" />
          </article>
        ) : (
          <ul className="flex flex-col gap-2">
            {Array?.isArray(aiGeneratedList) &&
              aiGeneratedList?.length > 0 &&
              aiGeneratedList?.map((item) => (
                <li
                  aria-labelledby={`summary-${item?.experienceLevel}`}
                  aria-describedby={`summary-desc-${item?.experienceLevel}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAiSummary(item);
                    }
                  }}
                  onClick={() => {
                    handleAiSummary(item);
                  }}
                  key={item?.experienceLevel}
                  className="rounded-lg bg-zinc-100 p-4 cursor-pointer"
                >
                  <h3
                    className="text-sm font-bold mb-2"
                    id={`summary-${item?.experienceLevel}`}
                  >
                    {item?.experienceLevel}
                  </h3>
                  <p
                    className="text-xs mt-2"
                    id={`summary-desc-${item?.experienceLevel}`}
                  >
                    {item?.summary}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </section>
    </article>
  );
}

export default SummaryForm;
