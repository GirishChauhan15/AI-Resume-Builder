function Spinner({width='w-8', className}) {
  return (
    <span className={`${width} aspect-square border-4 border-t-4 border-l-red-500 rounded-full animate-spin ${className}`}>
    </span>
  )
}

export default Spinner