export const getCarros = async()=>{
   try {
    const response =await fetch("https://secure-track-db.vercel.app/rooms",
        {
            method:"GET",
            mode:"cors",
            headers:{
                "Content-Type":"application/json"
            },
        
        }
    )
    let data = await response.json();
    return data
   } catch (error) {
    return error
   }
}