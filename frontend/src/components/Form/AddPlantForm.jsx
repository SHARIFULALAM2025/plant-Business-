import { useForm } from 'react-hook-form'
import { imageUpload } from '../../Utils'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const AddPlantForm = () => {
  const { user } = useAuth()
  // use mutation useCase
  const {isPending,mutateAsync} = useMutation({
    mutationFn: async (payload) =>
      await axios.post(`${import.meta.env.VITE_SERVER}/plant/info`, payload),
    onSuccess: data => {
      console.log(data);
      toast.success("successful add plant !")

    },
    onError: error => {
      console.log(error);

    },
    onMutate: payload => {
      console.log('post the data', payload)

    }
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  console.log(errors)

  const SignUpFormHandel = async (data) => {
    const { plantName, category, description, price, quantity } = data

    const imageFile = data.Image[0]

    try {
      const imageURL = await imageUpload(imageFile)
      const plantData = {
        image: imageURL,
        plantName,
        category,
        description,
        price,
        quantity,
        seller: {
          name: user?.displayName,
          image: user?.photoURL,
          email: user?.email,
        },
      }
      await mutateAsync(plantData)
      reset()
    } catch (error) {
      console.log(error)
    }
  }
if (isPending) return <p>loading.......</p>
  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit(SignUpFormHandel)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                id="name"
                type="text"
                placeholder="Plant Name"
                {...register('plantName', { required: true })}
              />
            </div>
            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600 ">
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                {...register('category', { required: true })}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Succulent">Succulent</option>
                <option value="Flowering">Flowering</option>
              </select>
            </div>
            {/* Description */}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Write plant description here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 "
                {...register('description')}
              ></textarea>
            </div>
          </div>
          <div className="space-y-6 flex flex-col">
            {/* Price & Quantity */}
            <div className="flex justify-between gap-2">
              {/* Price */}
              <div className="space-y-1 text-sm">
                <label htmlFor="price" className="block text-gray-600 ">
                  Price
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  {...register('price', { valueAsNumber: true })}
                  id="price"
                  type="number"
                  placeholder="Price per unit"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="quantity" className="block text-gray-600">
                  Quantity
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  {...register('quantity', { valueAsNumber: true })}
                  id="quantity"
                  type="number"
                  placeholder="Available quantity"
                />
              </div>
            </div>
            {/* Image */}
            <div className=" p-4  w-full  m-auto rounded-lg grow">
              <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  <label>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      id="image"
                      accept="image/*"
                      {...register('Image', { required: true })}
                    />
                    <div className="bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500">
                      Upload
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 "
            >
              Save & Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddPlantForm
