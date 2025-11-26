import Card from './Card'
import Container from '../Shared/Container'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
const Plants = () => {
    const { data: plants = [] } = useQuery({
      queryKey: ['plant'],
      queryFn: async () => {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/data/allPlant`
        )
        return res.data
      },
    })
  return (
    <Container>
      {plants && plants.length > 0 ? (
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {plants.map((item) => (
            <Card key={item._id} item={item} />
          ))}
        </div>
      ) : null}
    </Container>
  )
}

export default Plants
