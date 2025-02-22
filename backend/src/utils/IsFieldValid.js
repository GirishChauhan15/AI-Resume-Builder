const IsFieldValid = (...fields) => {
    if([...fields].some(field=> !field?.trim())) return false
    return true
}

export default IsFieldValid