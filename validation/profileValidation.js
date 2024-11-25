// const vine = require("@vinejs/vine");
// import vine, { rules } from "@vinejs/vine";
import vine from "@vinejs/vine";

const fileSizeRule = (maxSizeInBytes) => {
  return rules.custom((value, _, options) => {
    if (!value || !value.size) {
      options.report("File size is missing or invalid");
      return;
    }
    if (value.size > maxSizeInBytes) {
      options.report(`File size exceeds ${maxSizeInBytes / 1024 / 1024}MB`);
    }
  });
};

export const updateProfileSchema = vine.object({
  firstName: vine.string(),
  lastName: vine.string(),
  image: vine.string().optional(),
  color: vine.number(),
});

// Schema to validate the profile image
// export const addProfileImageSchema = vine.object({
//   fileName: vine.string(), // Expect the filename as a string
//   mimeType: vine.enum([
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "image/svg+xml",
//     "image/webp",
//   ]), // Validate MIME type
// });

// export const addProfileImageSchema = vine.object({
//   file: vine
//     .object({
//       fileName: vine.string(), // Expect the filename as a string
//       mimetype: vine
//         .string()
//         .in(["image/jpeg", "image/png", "image/jpg", "image/svg+xml"]),
//       size: vine.number().use(fileSizeRule(2 * 1024 * 1024)), // Max size 2MB
//     })
//     .required(),
// });
