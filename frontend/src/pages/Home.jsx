import { Button } from "@/components/ui/button";
import heroImage from "../assets/hero.jpg";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";
import {Spinner} from "@/components/customComponents/index";

const howItWorks = [
  {
    id: 1,
    bg: "bg-[#355070]",
    title: "Input Your Details",
    description:
      "Provide your personal details, skills, and experience. Our AI will guide you step-by-step, ensuring a smooth and quick process.",
  },
  {
    id: 2,
    bg: "bg-[#6d597a]",
    title: "AI-Driven Insights & Summary",
    description:
      "Our AI generates a tailored professional summary and content, crafted to highlight your skills and attract recruiters.",
  },
  {
    id: 3,
    bg: "bg-[#b56576]",
    title: "Tailor & Personalize",
    description:
      "Choose from the pre-designed template, then adjust and personalize it to highlight your unique strengths and qualifications.",
  },
  {
    id: 4,
    bg: "bg-[#e56b6f]",
    title: "Download & Apply",
    description:
      "Once your resume is ready, download it as a PDF and start sharing it with employers to take your career to the next level!",
  },
];
const features = [
  {
    id: 1,
    bg: "bg-[#355070]",
    title: "AI-Powered Enhancements",
    description:
      "Leverage AI to automatically generate personalized content, including a professional summary and tailored job descriptions. It’s designed to help you highlight your strengths and build a resume that reflects your goals.",
  },
  {
    id: 2,
    bg: "bg-[#6d597a]",
    title: "Industry-Specific Template",
    description:
      "Choose from a clean, professional template designed to suit a variety of fields. Whether you’re just starting out or switching careers, this template provides a solid foundation to build upon.",
  },
  {
    id: 3,
    bg: "bg-[#82404e]",
    title: "Simple & User-Friendly",
    description:
      "Easily input your information into a simple form. The interface is designed to be straightforward and easy to navigate, so you can focus on creating a resume that gets you noticed.",
  },
  {
    id: 4,
    bg: "bg-[#c55149]",
    title: "ATS-Friendly",
    description:
      "Your resume is created with an understanding of how it will be viewed by hiring managers. While the format is clear, readable, and structured to make a positive impact.",
  },
];
const faqList = [
  {
    id:1,
    title: "How does the AI resume builder work?",
    description:
      "Our AI-powered resume builder helps you create a professional resume by automatically generating a tailored summary and content based on the details you provide. Simply enter your personal information, skills, and experience, and the AI will suggest the best structure and wording for your resume.",
  },
  {
    id:2,
    title: "Can I customize my resume?",
    description:
      "Yes! After the AI generates your resume, you can freely adjust the content to better fit your style or specific job applications. You have complete control over what’s included in your resume.",
  },

  {
    id:3,
    title: "Are the resumes optimized for ATS?",
    description:
      "Yes! Our resumes are crafted with ATS-friendly formatting in mind. The AI ensures that your resume is structured with clear headings, relevant keywords, and a clean layout, making it easier for Applicant Tracking Systems (ATS) to read and evaluate. This increases your chances of getting noticed by hiring managers and passing through the initial screening process.",
  },

  {
    id:4,
    title: "Is the resume builder free to use?",
    description:
      "Yes! You can start building your resume for free. Once you're satisfied with your resume, you can download it in PDF format at no cost.",
  },

  {
    id:5,
    title: "Can I use the resume for different job applications?",
    description:
      "Absolutely! The AI-generated resume is fully customizable, so you can tailor it for various job roles or industries. Just update your experience, skills, or summary to fit each application.",
  },
];
function Home() {
  const [active, setActive] = useState('');
  const navigate = useNavigate()
  let {user, status} = useSelector(state=>state?.auth)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setTimeout(() => {
      setLoading(false)
    }, 100);
  },[])

  return (
    <>
     {loading && 
        <div className="flex justify-center items-center w-full h-screen min-h-[200px]">
            <Spinner className={'grid m-auto'} width='w-[3rem]' />
        </div> }

    {(!loading && !user) && status === false ?
    <section className="pt-10 min-[380px]:pt-20">
      <article className="grid grid-cols-1 sm:grid-cols-2 min-h-[600px] max-[450px]:p-2">
        <aside className=" flex justify-center items-center flex-col px-4 py-8">
          <h1 className="max-[200px]:text-2xl max-[400px]:text-4xl text-5xl tracking-wider font-extrabold">
            Build Your Perfect Resume with
            <span className="text-red-400"> AI</span> in Minutes
          </h1>
          <p className="max-[200px]:text-sm max-[400px]:text-base py-4 text-lg">
            Effortlessly create a standout resume tailored to your skills and
            career goals with the power of AI.
          </p>
          <Button
            className={"max-[400px]:text-xs place-self-start"}
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
        </aside>
        <figure className="relative">
        <img
          className="w-full h-96 sm:h-full place-self-center object-cover"
          src={heroImage}
          alt="A person thinking about their resume."
          loading="eager"
          fetchpriority="high"
          />
        <a target="_blank" href="https://www.freepik.com/free-vector/design-inspiration-concept-illustration_10791980.htm#fromView=author&page=2&position=6&uuid=89d129cd-5e98-4766-87bc-20a4d41098ca" className="text-red-600 hover:text-red-900 absolute -bottom-1 sm:bottom-1 right-0 sm:right-1 text-xs z-10 underline">Designed by Freepik</a>
          </figure>
      </article>

      <article className="max-[450px]:p-2 max-[640px]:px-20 p-10 bg-zinc-50 feature_full">
        <h2 className="max-[200px]:text-xl max-[400px]:text-2xl text-3xl tracking-wider font-extrabold text-center">
          Features
        </h2>
        <ul className="grid gap-10 lg:gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          {features?.length > 0 ?
            features?.map((item) => (
              <li
              tabIndex={0}
                key={item?.id}
                className="bg-zinc-200 p-4 rounded-lg min-[450px]:p-8 lg:p-6 relative hover:bg-zinc-300 hover:scale-[1.01]"
              >
                <div
                aria-hidden="true"
                  className={`${item?.bg ? "text-white" : "text-black"} ${
                    item?.bg || "bg-white"
                  } size-10 ring-4 ring-zinc-100 rounded-full absolute -top-5 left-3 flex justify-center items-center`}
                >
                  <p className="font-extrabold">{item?.id}</p>
                </div>
                <h3 className="mt-2 sm:mt-0 text-xl font-bold">
                  {item?.title}
                </h3>
                <p className="text-xs py-2">{item?.description}</p>
              </li>
            )) : <p className="grid col-span-full text-center tracking-widest font-mono font-semibold">No Features Available!</p>}
        </ul>
      </article>
      <article className="max-[450px]:px-4 max-[640px]:px-20 py-10 px-10 bg-red-400 w-full cta-full flex flex-col justify-between items-center sm:w-3/5 sm:m-auto">
        <h2 className="my-4 font-bold text-center max-[200px]:text-base max-[400px]:text-lg text-xl min-[400px]:px-4 text-zinc-900">
          Create a polished, professional resume in just a few clicks.
        </h2>
        <Button
          className={"text-wrap h-fit max-[400px]:text-xs"}
          onClick={() => navigate("/auth")}
        >
          Get Started
        </Button>
      </article>

      <article className="max-[450px]:p-2 max-[640px]:px-20 px-10 py-10">
        <h2 className="max-[200px]:text-xl max-[400px]:text-2xl text-3xl tracking-wider font-extrabold text-center">
          How It Works
        </h2>
        <ul className="grid gap-10 lg:gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          {howItWorks?.length > 0 ?
            howItWorks?.map((item) => (
              <li
              tabIndex={0}
                key={item?.id}
                className="bg-zinc-100 p-4 rounded-lg min-[450px]:p-8 lg:p-6 relative shadow-lg hover:bg-zinc-50 hover:scale-[1.01]"
              >
                <h3 className="mt-2 sm:mt-0 text-xl font-bold">
                  {item?.title}
                </h3>
                <p className="text-xs py-2">{item?.description}</p>
              </li>
            )): <p className="grid col-span-full text-center tracking-widest font-mono font-semibold">No data Available!</p>}
        </ul>
      </article>

      <article className="max-[450px]:p-2 max-[640px]:px-20 px-10 pb-10 bg-zinc-50 feature_full">
        <p className="py-4 text-sm text-center font-extralight">
          Need Help?
        </p>
        <h2 className="max-[200px]:text-xl max-[400px]:text-2xl text-3xl tracking-wider font-extrabold text-center">
        Find Your Answers Below.
        </h2>

        <ul className="mt-12 grid gap-2">
          {faqList?.length > 0
          ? faqList?.map(faq=>(
             <li
             role="button"
             aria-expanded={`${active === faq?.id ? true : false}`}
             tabIndex={0}
             onKeyDown={(e)=>{
              if(e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if(active === faq?.id) {
                  setActive('')
                  
                } else {
                  setActive(faq?.id)
                }
              }
             }}
             onClick={() => {
              if(active === faq?.id) {
                setActive('')
                
              } else {
                setActive(faq?.id)
              }
            }
            }
              key={faq?.id} className={`border-2 border-zinc-300 w-full rounded-lg p-4 md:w-3/4 m-auto select-none bg-white ${active !== faq?.id && 'hover:bg-zinc-300'}`}>
            <div
              className={`flex flex-wrap justify-between items-center ${
                active === faq?.id && "mb-1"
              }`}
            >
              <h3 aria-controls={`accordion-panel-'${faq?.id}`} className="font-semibold text-sm w-[80%]">
                {faq?.title}
              </h3>
              <span
              aria-hidden="true"
                className="hover:text-zinc-500"
              >
                { <Plus className={`${active === faq?.id ? 'rotate-45 transition-transform' : 'rotate-90 transition-transform'}`} /> }
              </span>
            </div>
            {active === faq?.id && (
              <p className="text-xs" id={`accordion-panel-'${faq?.id}`}>
                {faq?.description}
              </p>
            )}
          </li> 
          )): <p className="grid col-span-full text-center tracking-widest font-mono font-semibold">No FAQs Available!</p>}
        </ul>
      </article>
      <footer className="max-[450px]:px-4 max-[640px]:px-20 py-10 px-10 bg-red-400 w-full cta-full flex flex-col justify-between items-center">
      <p className="text-sm text-zinc-900">© {new Date().getFullYear()} Ai Resume Builder. All Rights Reserved.</p>
      </footer>
    </section>
    : <Dashboard />
    }
    </>
  );
}

export default Home;