import prisma from "../config/db.config.js";

class MessagesController {
    // Define the createMessage method here

    static async getMessages(req, res) {
        console.log("Reached here");
        console.log("req.body", req.body);

        const user1Id = req.user.id;
        const user2Id = req.body.id;
        
        try {    
          if (!user1Id || !user2Id ) {
            return res.status(400).json({ error: "Bad request", message: "Both user ids are required" });
          }
    
          const messages = await prisma.message.findMany({
            where: {
              OR: [
                { senderId: user1Id, recipientId: user2Id },
                { senderId: user2Id, recipientId: user1Id },
              ],
            },
            orderBy: {
              timestamp: 'asc', // or 'desc' for descending order
            },
          });
    
          console.log("messages", messages);
        
          return res.status(200).json({messages});
        } catch (error) {
          console.error("Error fetching Messages:", error);
          res.status(500).json({ error: "Failed to fetch contacts" });
        }
      }
}

export default MessagesController;