function Skeleton({count=2, animate=true, bg='bg-zinc-300'}) {
  return (
    <>
        {Array.from(Array(count).keys())?.map(skeleton=>(
            <aside key={skeleton} className={`h-[240px] w-[180px] ${bg} rounded-lg ${animate ? 'animate-pulse duration-1000 ease-in-out' : null} cursor-not-allowed`}>
            </aside>
        ))}
    </>
  )
}

export default Skeleton