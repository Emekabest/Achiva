

const extractFirstname = (name)=>{

   return name?.trim().split(/\s+/)[0] || "";
}


const getFirstLetter = (name)=>{

  if (!name) return "";
  return name.trim().charAt(0).toUpperCase();
}



export {extractFirstname, getFirstLetter};