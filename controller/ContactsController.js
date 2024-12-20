import prisma from "../config/db.config.js"; // import prisma from "../config/db.config";

class ContactsController {
  static async searchContacts(req, res) {
    // console.log("Reached here");

    // console.log("req.body", req.body);

    try {
      const searchTerm = req.body.data;

      // console.log("searchTerm", searchTerm);

      if (searchTerm === undefined || searchTerm === null) {
        res
          .status(400)
          .send({ error: "Bad request", message: "Search term is required" });
        return;
      }

      //Remove all special characters
      const sanitizedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(sanitizedSearchTerm, "i");

      const contacts = await prisma.user.findMany({
        where: {
          AND: [
            {
              id: {
                not: req.user.id, // Ensure `req.user.id` is a valid string or ObjectId
              },
            },
            {
              OR: [
                {
                  firstName: {
                    contains: searchTerm, // Partial match
                    mode: "insensitive", // Case insensitive
                  },
                },
                {
                  lastName: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        },
      });

      // const contacts1 = await User.find({
      //   $and: [
      //     {_id: {$ne: req.user._id}},
      //     {$or: [
      //       {firstName: regex},
      //       {lastName: regex},
      //       {email: regex}
      //     ]}
      //   ]
      // })

      // console.log("contacts", contacts);

      return res.status(200).json({ contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  }

  static async getContactsForDmList(req, res) {
    // console.log("Reached here");

    // console.log("req.body", req.body);

    try {
      let userId = req.user.id;
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId }, // Messages where the user is the sender.
            { recipientId: userId }, // Messages where the user is the recipient.
          ],
        },
        orderBy: {
          timestamp: "desc", // Sort by most recent timestamp.
        },
        distinct: ["senderId", "recipientId"], // Remove duplicate conversations.
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              color: true,
            },
          },
          recipient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              color: true,
            },
          },
        },
      });

      // console.log("messages", messages);

      // Post-process the messages to group by contact and select the last message.
      const contactsObj = messages.reduce((acc, message) => {
        const contactId =
          message.senderId === userId ? message.recipientId : message.senderId;
        const contactDetails =
          message.senderId === userId ? message.recipient : message.sender;

        // if (!acc[contactId]) {
        //   acc[contactId] = {
        //     id: contactId,
        //     lastMessageTime: message.timestamp,
        //     ...contactDetails,
        //   };
        // }
        if (!acc[contactId]) {
          acc[contactId] = {
            id: contactId,
            lastMessageTime: message.timestamp,
            ...contactDetails,
          };
        }
        return acc;
      }, {});

      // console.log("contactsObj", contactsObj);

      const contacts = Object.values(contactsObj);

      // console.log("contacts", contacts);
      return res.status(200).json({ contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  }

  static async getAllContacts(req, res) {
    // console.log("Reached here");

    // console.log("req.body", req.body);

    try {
      const userId = req.user.id;

      //how to only get the name and lastname from the user
      const users = await prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          // email: true,
          // image: true,
          // color: true,
        },
      });

      //map the users to an array of objects having label = firstname lastname/email. also check if user has firstname
      const contacts = users.map((user) => ({
        label: user.firstName
          ? `${user.firstName} ${user.lastName}`
          : user.email,
        value: user.id,
      }));

      return res.status(200).json({ contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  }
}

export default ContactsController;
