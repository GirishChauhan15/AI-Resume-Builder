import { useNavigate } from 'react-router-dom'
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover"
import { Edit3Icon, EllipsisVerticalIcon, NotebookText, PenLineIcon, Trash2 } from 'lucide-react'
import {Spinner} from './index'

function ResumeCardItem({resume, handleDelete, loading}) {

  const items = [
    {
      id: 101,
      name: "Edit",
      navigateTo : `/dashboard/resume/${resume?._id}/edit`,
      icon: <Edit3Icon className='size-4' />
    },
    {
      id: 102,
      name: "View",
      navigateTo : `/my-resume/${resume?._id}/view`,
      icon: <NotebookText className='size-4' />
    },
    {
      id: 103,
      name: "Delete",
      navigateTo : "",
      click : (...args) => {
        handleDelete(...args)
      },
      loader: true,
      icon: <Trash2 className='size-4' />
    },
  ]
  const navigate = useNavigate()
  return (
      <section aria-label={`${resume?.title} Resume`} tabIndex={0} onKeyDown={(e)=> { 
        if(e.key === "Enter" || e.key === ' ') { 
        e.preventDefault()
        navigate(`/dashboard/resume/${resume?._id}/edit`)
       }}} onClick={()=> navigate(`/dashboard/resume/${resume?._id}/edit`)} className="bg-gradient-to-b from-[#f8c5a5] to-[#ea5a4a] relative h-[240px] w-[180px] bg-secondary rounded-lg border hover:scale-[1.01] transition-transform hover:shadow-xl cursor-pointer select-none flex justify-center items-center">
      <PenLineIcon className='text-white size-10 fill-white' />
      <article onClick={(e)=> e.stopPropagation()} onKeyDown={(e)=> { e.stopPropagation() }} className='bg-zinc-800 text-white px-2 absolute min-h-10 bottom-0 w-full flex justify-between items-center rounded-b-lg'>
        <h2 className='font-bold text-xs overflow-hidden text-ellipsis w-4/5'>{resume?.title}</h2>
        <Popover>
          <PopoverTrigger><EllipsisVerticalIcon className='w-4' /></PopoverTrigger>
          <PopoverContent sideOffset={10} side={'bottom'} className={'w-fit'}>
            <ul className='w-fit flex flex-col gap-1'>
              {items?.length > 0 ? 
                items?.map((item)=>(
                  <li tabIndex={0} onKeyDown={(e)=> {
                    if(e.key === "Enter" || e.key === ' ') {
                      e.preventDefault()
                      item?.navigateTo ? navigate(item?.navigateTo) : item?.click(resume?._id)
                    }
                  }} key={item?.id}>
                  <p onClick={()=>item?.navigateTo ? navigate(item?.navigateTo) : item?.click(resume?._id)} className='cursor-pointer hover:bg-zinc-200 transition-colors duration-200 rounded-lg px-2 py-1 flex gap-2 items-center justify-between'>
                    {item?.loader ? loading ? <Spinner className={'grid'} width='w-[1rem]' /> : <> {item?.name} {item?.icon} </>  :  <> {item?.name} {item?.icon} </> }
                  </p>
                  </li>
                ))
                : <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No data!</p>
              }
            </ul>
          </PopoverContent>
        </Popover>
      </article>
      </section>
  )
}

export default ResumeCardItem