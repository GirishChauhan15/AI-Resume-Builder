import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useResumeInfo } from "@/context/Resume.context";
import {Spinner} from "../../index";

function PersonalDetailForm({ enableSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [disableSave, setDisableSave] = useState(true);

  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const axiosPrivate = useAxiosPrivate();
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setResumeInfo({ ...resumeInfo, [name]: value });
    if (enableSave) {
      enableSave(false);
    }
    setDisableSave(false);
  };
  const handleSubmit = async () => {
    setDisableSave(true);
    let userData = {
      firstName: resumeInfo?.firstName,
      lastName: resumeInfo?.lastName,
      jobTitle: resumeInfo?.jobTitle,
      address: resumeInfo?.address,
      phone: resumeInfo?.phone,
      email: resumeInfo?.email,
    };
    setLoading(true);
    try {
      let res = await axiosPrivate.patch(`/resume/update/${resumeId}`, {
        ...userData,
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
  return (
    <article className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 select-none">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Get started with basic information.</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 mt-5 gap-4">
          <div>
            <label className="text-sm block pb-2" htmlFor="first-name">
              First Name
            </label>
            <Input
              maxLength="25"
              name="firstName"
              id="first-name"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.firstName}
            />
          </div>
          <div>
            <label className="text-sm block pb-2" htmlFor="last-name">
              Last Name
            </label>
            <Input
              maxLength="25"
              name="lastName"
              id="last-name"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.lastName}
            />
          </div>
          <div className="col-span-full">
            <label className="text-sm block pb-2" htmlFor="job-title">
              Job Title
            </label>
            <Input
              maxLength="80"
              name="jobTitle"
              id="job-title"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.jobTitle}
            />
          </div>
          <div className="col-span-full">
            <label className="text-sm block pb-2" htmlFor="address">
              Address
            </label>
            <Input
              maxLength="80"
              name="address"
              id="address"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.address}
            />
          </div>
          <div>
            <label className="text-sm block pb-2" htmlFor="phone">
              Phone
            </label>
            <Input
              maxLength="15"
              name="phone"
              id="phone"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.phone}
            />
          </div>
          <div>
            <label className="text-sm block pb-2" htmlFor="email">
              Email
            </label>
            <Input
              maxLength="100"
              name="email"
              id="email"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.email}
            />
          </div>
          <div className="mt-2 text-end col-span-full">
            <Button onClick={handleSubmit} disabled={disableSave} type="submit">
              {loading ? <Spinner width="w-[1.6rem]" /> : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </article>
  );
}

export default PersonalDetailForm;
