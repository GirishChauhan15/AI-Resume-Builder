import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Brain, Minus, Plus } from "lucide-react";
import { useResumeInfo } from "@/context/Resume.context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import aiService from "@/services/AiModel";
import useThrottle from "@/hooks/useThrottle";
import {Spinner,RTK} from "../../index";

function ExperienceForm({ enableSave }) {
  const [loading, setLoading] = useState(false);
  const [selectedInput, setSelectedInput] = useState([]); 
  const [selectedId, setSelectedId] = useState(null); 
  const [disableBtn, setDisableBtn] = useState(false); 
  const [addLoader, setAddLoader] = useState(false);
  const [removeLoader, setRemoveLoader] = useState(false);
  const { setResumeInfo, resumeInfo } = useResumeInfo();
  const axiosPrivate = useAxiosPrivate();
  const { resumeId } = useParams();
  const location = useLocation();
  const [aiGeneratedData, setAiGeneratedData] = useState(null);
  const textareaRef = useRef(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiButtonActive, setAiButtonActive] = useState(false);
  const [aiGenerateButton, setAiGenerateButton] = useState(null);

  useEffect(() => {
    if (selectedInput?.length === 0) {
      enableSave(true);
    }
  }, [selectedInput]);

  let addSelectedInput = [];

  const handleSubmit = async (e, experienceId) => {
    setLoading(true);
    setSelectedId(experienceId);
    setSelectedInput(
      [...selectedInput]?.filter((item) => item !== experienceId)
    );
    e.preventDefault();
    try {
      let experience = resumeInfo?.experience?.find(
        (experience) => experience?._id === experienceId
      );
      if (
        experience !== undefined ||
        (experience !== null && experience?._id === experienceId)
      ) {
        const res = await axiosPrivate.patch(
          `/resume/update/${resumeId}`,
          { experience },
          { params: { experienceId } }
        );
        if (res?.data?.success) {
          toast({
            variant: "success",
            title: res?.data?.message || "Success.",
          });
          document.querySelector("#focus_Btn")?.focus();
        }
      } else {
        return;
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

  const removeExperience = async (experienceId) => {
    setRemoveLoader(true);
    setDisableBtn(true);
    try {
      const res = await axiosPrivate.delete(
        `/resume/delete-experience/${resumeId}/${experienceId}`
      );
      if (res?.data?.success) {
        toast({
          variant: "success",
          title: res?.data?.message || "Success.",
        });
        const experienceList = resumeInfo?.experience?.filter(
          (experience) => experience?._id !== experienceId
        );
        setResumeInfo({ ...resumeInfo, experience: experienceList });
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
      setRemoveLoader(false);
      setDisableBtn(false);
    }
  };

  const addExperience = async () => {
    setAddLoader(true);
    setDisableBtn(true);
    try {
      const response = await axiosPrivate.post(
        `/resume/create-experience/${resumeId}`
      );
      if (response?.data?.success) {
        toast({
          variant: "success",
          title: response?.data?.message || "Success.",
        });
        const experienceList = [
          ...resumeInfo?.experience,
          response?.data?.data,
        ];
        setResumeInfo({ ...resumeInfo, experience: experienceList });
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
      setAddLoader(false);
      setDisableBtn(false);
    }
  };
  const handleInputChange = (e, experienceId) => {
    if (enableSave) {
      enableSave(false);
    }

    addSelectedInput?.push(experienceId);

    addSelectedInput?.forEach((inputVal) => {
      if (!selectedInput?.includes(inputVal)) {
        setSelectedInput([...selectedInput, inputVal]);
      }
    });
    const resumeExperienceList = resumeInfo?.experience;
    const { name, value } = e.target;
    let updatedResumeList = resumeExperienceList.map((exp) =>
      exp?._id === experienceId ? { ...exp, [name]: value } : exp
    );
    setResumeInfo({ ...resumeInfo, experience: updatedResumeList });
  };

  const handleRTKInputs = (e, experienceId, name) => {
    if (enableSave) {
      enableSave(false);
    }
    addSelectedInput?.push(experienceId);

    addSelectedInput?.forEach((inputVal) => {
      if (!selectedInput?.includes(inputVal)) {
        setSelectedInput([...selectedInput, inputVal]);
      }
    });
    const resumeExperienceList = resumeInfo?.experience;
    const { value } = e.target;
      let updatedResumeList = resumeExperienceList.map((exp) =>
        exp?._id === experienceId ? { ...exp, [name]: value?.slice(0, 400) } : exp
      );
      setResumeInfo({ ...resumeInfo, experience: updatedResumeList });
  };
  const generateSummary = async ({_id, companyName, title }) => {
    if(title === "Job Title" || companyName === "Company Name") {
      toast({
        variant: "destructive",
        description:
          "Error! Job title or Company name is not valid.",
      });
      return
    }
    setAiGenerateButton(_id)
    setAiLoading(true)
    setAiButtonActive(true)
    let prompt = 'Generate a dynamic and professional work summary for '+title+' in '+companyName+'. In only 3 lines, highlight key responsibilities, major achievements, and essential skills. The summary should reflect the individual’s expertise and contributions in a clear, concise manner, emphasizing impactful results and core strengths. Incorporate relevant keywords, technology stacks, and industry terms to ensure ATS compatibility and increase visibility in applicant tracking systems. Use action-oriented language, quantifiable results, and focus on transferable skills that align with job descriptions. Format the output as {experienceInfo: data}, ensuring it is compelling, results-driven, and applicable to any role. The output should only be 3 lines max 390 characters.'
    try {
      if (
        title !== undefined ||
        title !== null ||
        !prompt?.includes("undefine")
      ) {
        let res = await aiService.getResult(prompt);
        if (res?.experienceInfo) {
          setAiGeneratedData(res);
        } else {
          setAiGeneratedData(null);
          toast({
            variant: "destructive",
            description:
              "Error! Experience info is not generated or is not available at this time, Please try again later.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description:
            "Error! Experience info is not generated or is not available at this time, Please try again later.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error: Unable to Process Request",
        description:
          "It seems the AI is temporarily unavailable. Please try again later.",
      });
    }finally{
      setAiLoading(false)
      setAiButtonActive(false)
    }
  };

  const throttledGenerateSummary = useThrottle(generateSummary, 90000);

  const handleAiExperience = (experience) => {
    if (aiGeneratedData?.experienceInfo?.length <= 400) {
      handleRTKInputs(
        {
          target: {
            value: aiGeneratedData?.experienceInfo,
          },
        },
        experience?._id,
        "workSummary"
      );
    } else if (
      aiGeneratedData?.experienceInfo?.length >= 400
    ) {
      handleRTKInputs(
        {
          target: {
            value: aiGeneratedData?.experienceInfo?.slice(
              0,
              400
            ),
          },
        },
        experience?._id,
        "workSummary"
      );
      toast({
        variant: "destructive",
        description: "max length 400 characters only!",
      });
    }
    addSelectedInput?.push(experience?._id);

    addSelectedInput?.forEach((inputVal) => {
      if (!selectedInput?.includes(inputVal)) {
        setSelectedInput([...selectedInput, inputVal]);
      }
    });
    textareaRef?.current?.focus();
  }

  return (
    <article className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 select-none">
      <h2 className="font-bold text-lg">Professional experience</h2>
      <p>Highlight your career journey and key accomplishments.</p>
      <ul className="mt-2 flex flex-col gap-4">
        {resumeInfo?.experience?.length > 0 ?
          resumeInfo?.experience?.map((experience) => (
            <li className="border-2 rounded-lg p-4" key={experience?._id}>
              <div>
                <form
                  onSubmit={(e) => {
                    handleSubmit(e, experience?._id);
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="text-sm block pb-2"
                        htmlFor="position-title"
                      >
                        Position Title
                      </label>
                      <Input
                        maxLength="100"
                        name="title"
                        id="position-title"
                        required
                        onChange={(e) => handleInputChange(e, experience?._id)}
                        defaultValue={experience?.title}
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm block pb-2"
                        htmlFor="company-name"
                      >
                        Company Name
                      </label>
                      <Input
                        maxLength="100"
                        name="companyName"
                        id="company-name"
                        required
                        onChange={(e) => handleInputChange(e, experience?._id)}
                        defaultValue={experience?.companyName}
                      />
                    </div>

                    <div>
                      <label className="text-sm block pb-2" htmlFor="city">
                        City
                      </label>
                      <Input
                        maxLength="35"
                        name="city"
                        id="city"
                        required
                        onChange={(e) => handleInputChange(e, experience?._id)}
                        defaultValue={experience?.city}
                      />
                    </div>
                    <div>
                      <label className="text-sm block pb-2" htmlFor="state">
                        State
                      </label>
                      <Input
                        maxLength="35"
                        name="state"
                        id="state"
                        required
                        onChange={(e) => handleInputChange(e, experience?._id)}
                        defaultValue={experience?.state}
                      />
                    </div>

                    <div>
                      <label
                        className="text-sm block pb-2"
                        htmlFor="start-date"
                      >
                        Start Date
                      </label>
                      <Input
                        maxLength="10"
                        name="startDate"
                        id="start-date"
                        required
                        type="date"
                        onChange={(e) => handleInputChange(e, experience?._id)}
                        defaultValue={experience?.startDate}
                      />
                    </div>
                    <div>
                      <label className="text-sm block pb-2" htmlFor="end-date">
                        End Date
                      </label>
                      <Input
                        maxLength="10"
                        name="endDate"
                        id="end-date"
                        required
                        type="date"
                        onChange={(e) => handleInputChange(e, experience?._id)}
                        defaultValue={experience?.endDate}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="my-4 flex justify-between items-end gap-2 flex-wrap text-sm">
                        <p>Add Summary</p>
                        <Button
                          variant="outline"
                          className="border-2 text-primary font-bold text-xs"
                          size="sm"
                          type="button"
                          disabled={aiButtonActive}
                          onClick={() => throttledGenerateSummary({ ...experience })}
                        >
                          Create using AI <Brain />
                        </Button>
                      </div>
                      <RTK
                        ref={textareaRef}
                        id="summary-textarea"
                        handleRTK={(e) =>
                          handleRTKInputs(e, experience?._id, "workSummary")
                        }
                        info={experience?.workSummary}
                      />
                    </div>
                    <div className="flex col-span-2 justify-between items-center">
                      <div className="flex gap-2 items-center flex-wrap">
                        {resumeInfo?.experience?.length < 2 && (
                          <Button
                            className="border-2"
                            onClick={addExperience}
                            type="button"
                            disabled={disableBtn}
                          >
                            {addLoader ? (
                              <Spinner width="w-[1.6rem]" />
                            ) : (
                              <>
                                <Plus />
                                Add More Experience
                              </>
                            )}
                          </Button>
                        )}
                        {resumeInfo?.experience?.length > 1 &&
                          resumeInfo?.experience[0]._id !== experience?._id && (
                            <Button
                              className="border-2"
                              onClick={() => removeExperience(experience?._id)}
                              type="button"
                              disabled={disableBtn}
                              variant="outline"
                            >
                              {removeLoader ? (
                                <Spinner width="w-[1.6rem]" />
                              ) : (
                                <>
                                  <Minus />
                                  Remove Experience
                                </>
                              )}
                            </Button>
                          )}
                      </div>
                      <Button
                        type="submit"
                        disabled={
                          selectedInput?.includes(experience?._id)
                            ? false
                            : true
                        }
                      >
                        {loading && selectedId === experience?._id ? (
                          <Spinner width="w-[1.6rem]" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              <section className="mt-5">
                <ul className="flex flex-col gap-2">
                  {aiLoading && experience?._id === aiGenerateButton ? (
                    <article className="grid w-full place-items-center">
                      <Spinner width="w-[2rem]" />
                    </article>
                  ) : (
                    aiGeneratedData?.experienceInfo && experience?._id === aiGenerateButton && (
                      <li
                      tabIndex={0}
                      onKeyDown={(e)=>{
                        if(e.key === "Enter" || e.key === ' '){
                          e.preventDefault()
                          handleAiExperience(experience)
                        }
                      }}
                        onClick={() => {
                          handleAiExperience(experience)
                        }}
                        className="rounded-lg bg-zinc-100 p-4 cursor-pointer"
                      >
                        <h3 className="text-sm font-bold mb-2">
                          Experience Info
                        </h3>
                        <p className="text-xs mt-2">
                          {aiGeneratedData?.experienceInfo}
                        </p>
                      </li>
                    )
                  )}
                </ul>
              </section>
            </li>
          )): <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Experience Available! Check internet.</p>}
      </ul>
    </article>
  );
}

export default ExperienceForm;
