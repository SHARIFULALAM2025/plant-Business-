import { Link } from 'react-router'

const Card = ({ item }) => {
  console.log(item);

  return (
    <Link
      to={`/plant/${item._id}`}
      className="col-span-1 cursor-pointer group shadow-xl p-3 rounded-xl"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
              aspect-square
              w-full
              relative
              overflow-hidden
              rounded-xl
            "
        >
          <img
            className="
                object-cover
                h-full
                w-full
                group-hover:scale-110
                transition
              "
            src={item.image}
            alt="Plant Image"
          />
          <div
            className="
              absolute
              top-3
              right-3
            "
          ></div>
        </div>
        <div className="font-semibold text-lg">{item.plantName}</div>
        <div className="font-semibold text-lg">Category: {item.category}</div>
        <div className="font-semibold text-lg">Quantity: {item.quantity}</div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold"> Price: {item.price}</div>
        </div>
      </div>
    </Link>
  )
}

export default Card
