export default async function ApiMain() {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entries`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  const listItems = data.map((item) => (
    <li key={item.id}>
      <div>{item.id}</div>
      <div>Name = {item.name}</div>
      <div>Cost = {item.cost}</div>
    </li>
  ));

  return <div>{listItems}</div>;
}
