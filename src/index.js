import { connectToDB } from './utils/mongoose.js'
import app from './app.js'

async function main(){

    // DB connection
    await connectToDB();
    app.listen(3000, () => console.log("Server running in 3000 port - http://localhost:3000"));
}

main()
