import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
const currentModuleFile = new URL(import.meta.url);
const currentModulePath = fileURLToPath(currentModuleFile);
const currentModuleDir = path.dirname(currentModulePath);

const destinationFolder = path.join(currentModuleDir, "../uploads/Images");

// Ensure the destination folder exists, create it if not
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    console.log(file, "skdjfhaklsjdfhkajhdfkjashdfkjahdfkjh");
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
