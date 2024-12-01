import prisma from "../config/db.config.js";

class ChannelController {
    static async createChannel(req, res) {
        try {
          const { name, members } = req.body.data;

          console.log("req.body", req.body);

          console.log("name", name);
          console.log("members", members);
          if (!name || !members || !Array.isArray(members)) {
            return res
              .status(400)
              .json({ error: "Bad request", message: "Invalid channel data" });
          }

          const userId = req.user.id;

          console.log("userId", userId);
          
          const admin = await prisma.user.findUnique({
            where: {
              id: userId,
            },
          });

          console.log("admin", admin);

          if (!admin) {
            return res
              .status(404)
              .json({ error: "User not found", message: "User not found" });
          }

          const validMembers = await prisma.user.findMany({
            where: {
              id: {
                in: members,
              },
            },
          });

          console.log("validMembers", validMembers);

          if (validMembers.length !== members.length) {
            return res
              .status(400)
              .json({ error: "Invalid members", message: "Invalid members" });
          }

          //create new channel with name, members and admin:userId
        //   const channel = await prisma.channel.create({
        //     data: {
        //       name,
        //       members: {
        //         connect: validMembers.map((member) => ({
        //           id: member.id,
        //         })),
        //       },
        //       admin: {
        //         connect: {
        //           id: userId,
        //         },
        //       },
        //     },
        //   })

        const channel = await prisma.channel.create({
            data: {
              name,
              admin: {
                connect: { id: userId }, // Connect the admin to the channel
              },
              members: {
                create: members.map((memberId) => ({
                  user: { connect: { id: memberId } }, // Connect each member to the channel
                })),
              },
            },
            include: {
              members: { include: { user: true } }, // Optionally include member details
            },
          });

          console.log("channel", channel);
          
          res.status(201).json({
            message: "Channel created successfully",
            channel,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      }

      static async getChannels(req, res) {
        try {
          const userId = req.user.id;

          console.log("userId.............", userId);

          const channels = await prisma.channel.findMany({
            where: {
              OR: [
                {
                  members: {
                    some: {
                      userId,
                    },
                  },
                },
                {
                  adminId: userId,
                },
              ],
            },
            orderBy: {
              updatedAt: "desc",
            },
            include: {
              members: { include: { user: true } }, // Include member details
            },
          });
          

          console.log("channels........", channels);
          
          res.status(200).json({
            // message: "Channel created successfully",
            channels,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
}

export default ChannelController