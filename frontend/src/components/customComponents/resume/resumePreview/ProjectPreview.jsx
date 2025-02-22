import parse from 'html-react-parser'

  const regex = /^(https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?)$/;
function ProjectPreview({resumeInfo}) {
 
  return (
    <article className='w-full overflow-hidden'>
      <hr className={`border-2 my-2 ${resumeInfo?.themeBorder || 'border-black'}`} />
      <h2 className={`text-center font-bold text-sm my-2 ${resumeInfo?.themeColor || 'text-black'}`}>
        Projects
      </h2>

      <ul>
        {resumeInfo?.projects?.length > 0 ?
          resumeInfo?.projects?.map((project) => (
            <li
              key={project?._id}
              className="my-2"
            >
               <h3 className={`text-sm font-bold ${resumeInfo?.themeColor || 'text-black'}`}><span>{project?.projectName}</span></h3>
               {regex?.test(project?.gitHubLink) && <a target="_blank" href={project?.gitHubLink}><p className="text-xs font-bold text-black hover:text-zinc-500 cursor-pointer">Github link</p></a>}
                <ul className='rsw-ce text-xs'>{parse(project?.projectDesc || '')}</ul>
            </li>
          )) : <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Project Available!</p>}
      </ul>
    </article>
  );
}

export default ProjectPreview;
