import Image from "next/image"

export default function Memories(){
    const memoriesArray =[
        {id: 1, name: "Memoria 1", thumb: "https://via.placeholder.com/150", description: "Descripción de la memoria 1"},
        {id: 2, name: "Memoria 2", thumb: "https://via.placeholder.com/150", description: "Descripción de la memoria 2"},
        {id: 3, name: "Memoria 3", thumb: "https://via.placeholder.com/150", description: "Descripción de la memoria 3"}
    ]

    return(
        <div className="flex direction-row justify-around">
            {memoriesArray.map((memory) => (
                <div key={memory.id}>
                    <Image src={memory.thumb} alt={memory.name} width={150} height={150} />
                    <p>{memory.description}</p>
                </div>
            ))}
        </div>
    )
}