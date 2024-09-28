// "use client";

// export default function CategoryItem({ index, item, mainUrl }) {
//   const handleDelete = async (id) => {
//     await fetch(`${mainUrl}/${id}`, { method: "DELETE" });
//     // Optionally, refetch data or update state here if needed
//   };
//   return (
//     <div className="flex">
//       <div>{index + 1}</div>
//       <div>{item.name}</div>
//       <button onClick={() => handleDelete(item.id)}>DELETE</button>
//     </div>
//   );
// }
