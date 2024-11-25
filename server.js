import express from 'express';
import routes from './src/routes/postsRoutes.js';


const app = express();
routes(app)
app.use(express.static("uploads"));

app.listen(3000 , () => {
    console.log("Servidor em QAP");
});
