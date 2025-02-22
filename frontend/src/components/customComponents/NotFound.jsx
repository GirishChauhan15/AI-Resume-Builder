import notFound from "../../assets/not_found.jpg";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col-reverse items-center justify-center sm:flex-row gap-10 px-10  pt-16 min-[380px]:pt-20 min-w-[280px] sm:h-screen min-h-[400px]">
      <figure className="flex justify-center items-center w-full relative">
        <img
          className="w-3/4 object-cover"
          src={notFound}
          alt="404 page not found."
          loading="lazy"
        />
        <a
          target="_blank"
          href="https://www.freepik.com/free-vector/404-error-with-people-holding-numbers-concept-illustration_20602743.htm#fromView=keyword&page=2&position=49&uuid=91d26349-98c6-4892-876b-b4eec9e93a64&query=Error"
          className="text-red-600 hover:text-red-900 absolute -bottom-1 -translate-x-1/2 left-1/2 text-xs z-10 underline"
        >
          Designed by Freepik
        </a>
      </figure>
      <aside className="min-h-[250px] min-w-[300px] flex justify-center items-start flex-col w-full p-8">
        <h2 className="text-5xl mb-4 font-bold">Oops! Page Not Found</h2>
        <p className="text-sm mb-4 pr-4 font-extrabold text-zinc-600">
          It looks like the page you're looking for doesn't exist. Don't worry
          let's get you back on track!{" "}
        </p>
        <Button
          onClick={() => navigate("/")}
          className="flex justify-between gap-2 rounded-full bg-black hover:bg-zinc-800 text-xs py-0"
        >
          <ArrowLeft /> Go home
        </Button>
      </aside>
    </section>
  );
}

export default NotFound;
