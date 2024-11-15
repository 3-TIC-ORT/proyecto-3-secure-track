export const getCarros = async()=>{
    let status = sessionStorage.getItem("status")
    if (status != "En proceso" && status!= "Retirada" && status!= "En proceso devolucion") {
        console.log(">normal")
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
    } else if (status === "Retirada") {
        console.log(">COn slots habilitados")
        try {
            const response =await fetch("https://secure-track-db.vercel.app/rooms/habilitadas",
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
}