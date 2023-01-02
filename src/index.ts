import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import { mockMessages } from './assets/mockMessages';
import { mockUserDetails } from './assets/mockUserDetails';
import bodyParser from 'body-parser';


const port = 3001;
const app: Express = express();
app.use(cors());

app.get('/', (req: Request,res: Response)=>{
    res.send(mockMessages);
});

app.get('/messages',(req,res)=>{
    const mockMessagesWithNames = mockMessages.map((message)=>{
        const author = mockUserDetails.find(user => user.id === message.authorId);
        const authorName = author && author.name;
        return { ...message, authorName };
    });
    res.send(mockMessagesWithNames);
})

app.get('/users',(req,res)=>{
    const mockFullListOfUsers = mockUserDetails.map((user)=>{
         const {id, name}= user;
         return {id, name}
    });
    res.send(mockFullListOfUsers);
})

app.get('/users/:id',(req,res)=>{
    const { id } = req.params;
    const userDetailsById = mockUserDetails.find(user=> user.id === +id );
    res.send(userDetailsById);
})

app.post('/newmessage',bodyParser.json(), (req,res)=>{
    const message = req.body;
//The message contains: id, body, timestamp, authorId
    // console.log(data);
    const author = mockUserDetails.find(user=>user.id === message.authorId);
    const authorName = author && author.name;
    const likes: number[] = []; 
    
    const newMessage = {...message, authorName, likes}
    mockMessages.push(newMessage);
    
})

app.post('/setlike',bodyParser.json(), (req,res)=>{
    const data = req.body;
    const messageId = data.messageId;
    const userId:number = data.userId;
    const like = data.like; 
    // console.log(messageId);
    // console.log(userId);
    // console.log(like);
    
    const msg = mockMessages.filter(msg=>msg.id===messageId)
    // console.log(msg[0]?.likes);

        if (msg[0]?.likes.includes(userId)){
            let index = msg[0]?.likes.indexOf(userId);
            msg[0]?.likes.splice(index,1);
        }else{
           msg[0]?.likes.push(userId) 
        }
        
    // console.log(msg[0]?.likes);
    
})

app.listen(port,()=>{
    console.log(`now listening on ${port}`)
})

