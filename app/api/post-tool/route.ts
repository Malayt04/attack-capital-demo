export async function POST(request: Request) {
    const callData = await request.json()
    console.log("Call ended to ", callData.from_number, " with bot id ", callData.bot_id)
}

// app.post('/api/post-call', (req, res) => {
//     const callData = req.body;
//     // Process/store/summarize callData here
//     console.log('Received post-call webhook:', callData);
  
//     // Always respond with 200 OK within 10 seconds
//     res.sendStatus(200);
//   });
  