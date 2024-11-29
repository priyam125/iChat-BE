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

      return res.status(200).json({contacts});
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  }
}

export default ContactsController;
