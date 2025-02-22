import parse from 'html-react-parser';
import dayjs from 'dayjs';

function ExperiencePreview({resumeInfo}) {
  return (
   <article className="w-full overflow-hidden">
    <hr className={`border-2 mt-4 my-2 ${resumeInfo?.themeBorder || 'border-black'}`} />
    <h2 className={`text-center font-bold text-sm my-2 ${resumeInfo?.themeColor || 'text-black'}`}>Professional experience</h2>
    <ul>
        { resumeInfo?.experience?.length > 0 ?
        resumeInfo?.experience?.map((expe)=>(
            <li key={expe?._id} className='my-2'>
                <h3 className={`text-sm font-bold ${resumeInfo?.themeColor || 'text-black'}`}>{expe?.title}</h3>
                <div className='flex items-center justify-between text-xs gap-2 flex-wrap'>
                <p>{expe?.companyName}, {expe?.city}, {expe?.state}</p>
                <p>{expe?.startDate} to {dayjs(expe?.endDate).format("YYYY/MM/DD") === dayjs().format("YYYY/MM/DD") ? "Present" : expe?.endDate}</p>
                </div>
                <ul className='rsw-ce text-xs'>{parse(expe?.workSummary || '')}</ul>
            </li>
        )): <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Experience Available!</p>}
    </ul>
   </article>
  )
}

export default ExperiencePreview