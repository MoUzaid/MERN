const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
require('dotenv').config();
const userRoutes=require('./routes/userRoutes');
const categoryRoutes=require('./routes/categoryRoutes');
const productRoutes=require('./routes/productRoutes');
const upload=require('./routes/upload')
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',  // or your frontend domain
  credentials: true
}));



const port=process.env.PORT||4000;
app.use(express.json());
app.use('/user',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',upload);


app.post('/create-checkout-session',async(req,res)=>{
  const {amount}=req.body;
  const rupeeAmount = amount;
const paiseAmount = rupeeAmount * 100
  try{
    const session=await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[
        {
          price_data:{
            currency:'inr',
            product_data:{
              name:'Test Product',
            },
            unit_amount:paiseAmount,
          },
          quantity:1,
        },
      ],
      mode:'payment',
      success_url:'http://localhost:3000/success',
      cancel_url:'http://localhost:3000/cancel',
    })
    res.json({id:session.id});
  }
  catch(error){
    res.status(500).json({error:error.message});
  }
});
//webhook handler (stripe sends POST request here)
app.post('/webhook',bodyParser.raw({type:
  'application/json'
}),(request,response)=>{
  const endpointSecret=process.env.STRIPE_WEBHOOK_SECRET;
  const sig=request.headers['stripe-signature'];
  let event;
  try{
    event=stripe.webhooks.constructEvent(request.body,sig,endpointSecret);
  }
  catch(err){
    return response.status(400).send(`webhook Error:${err.message}`);
  }
   // Handle checkout.session.completed
if(event.type===`checkout.session.completed`){
  const session=event.data.object;
  console.log('Payment Successful for session:',session.id);
}
  response.status(200).end();
})


app.listen(port,()=>{
    console.log(`Server is listening on ${port}`);
})
const URI=process.env.MONGODB_URL;
mongoose.connect(URI)
.then(()=>console.log('connected'))
.catch((err)=>console.log("MongoDB error:-"+err))

