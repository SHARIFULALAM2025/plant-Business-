require('dotenv').config()
const stripe = require('stripe')(process.env.VITE_PAYMENT_API)
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const admin = require('firebase-admin')
const port = process.env.PORT || 3000
const decoded = Buffer.from(process.env.VITE_service_key, 'base64').toString(
  'utf-8'
)
const serviceAccount = JSON.parse(decoded)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const app = express()
// middleware
app.use(
  cors({
    // origin: [process.env.VITE_CLIENT_DOMAIN_KEY],
    credentials: true,
    optionSuccessStatus: 200,
  })
)
app.use(express.json())

//jwt middlewares
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1]
  console.log(token)
  if (!token) return res.status(401).send({ message: 'Unauthorized Access!' })
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.tokenEmail = decoded.email
    console.log(decoded)
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).send({ message: 'Unauthorized Access!', err })
  }
}
const uri = `mongodb+srv://${process.env.VITE_URI_USER}:${process.env.VITE_URI_PASS}@cluster0.sxgnyhx.mongodb.net/?appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    const database = client.db("plantDB");
    const AllPlant = database.collection('plant');
    const orderCollection=database.collection('order')
    // plant post api ....................
    app.post('/plant/info', async (req, res) => {
      const plantData = req.body;
      const result = await AllPlant.insertOne(plantData);
      res.send(result)
    })
    //payment
    app.post('/create-checkout-session', async (req, res) => {
      const paymentInfo = req.body;



      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "USD",
              unit_amount: paymentInfo?.price * 100,
              product_data: {
                name: paymentInfo?.plantName,
                images: [paymentInfo.image],
                description: paymentInfo?.description
              },
            },

            quantity: paymentInfo?.quantity,
          },
        ],
        mode: 'payment',
        metadata: {
          plantId: paymentInfo?.plantID,

          name: paymentInfo?.customer?.Name,
          email: paymentInfo?.customer?.Email

        },

        customer_email: paymentInfo.customer?.Email,
        success_url: `${process.env.VITE_CLIENT_DOMAIN_KEY}/success_url?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.VITE_CLIENT_DOMAIN_KEY}/plant/${paymentInfo.plantID}`


      })
      res.send({ url: session.url })
    })
    //
    app.post('/payment-success', async (req, res) => {
      const { sessionId } = req.body;
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      console.log(session);
      const plant = await AllPlant.findOne({ _id: new ObjectId(session.metadata.plantId)})

      const order = await orderCollection.findOne({ transitionId: session.payment_intent })
      if (session.status === "complete" && plant && !order) {
        const orderInfo = {
          plantId: session.metadata.plantId,
          transitionId: session.payment_intent,
          customer: session.metadata.name,
          customerEmail: session.metadata.email,
          status: 'pending',
          seller: plant.seller,
          name: plant.plantName,
          category: plant.category,
          quantity: 1,
          price: session.amount_total / 100,
        }

        const result = await orderCollection.insertOne(orderInfo);
        await AllPlant.updateOne({ _id: new ObjectId(session.metadata.plantId) }, { $inc: { quantity: -1 } })
        return res.send({ transitionId: session.payment_intent, orderId: result.insertedId})


      }
      res.send({ transitionId: session.payment_intent, orderId: order._id })

    })
    app.get("/data/allPlant", async (req, res) => {
      const result = await AllPlant.find().toArray();
      res.send(result)
    })
    // single plant
    app.get("/data/allPlant/:id", async (req, res) => {
      const id = req.params.id
      const result = await AllPlant.findOne({ _id: new ObjectId(id) })
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from Server..')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
