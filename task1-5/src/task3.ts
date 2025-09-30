import * as fs from "fs";
import { promisify } from "util";

// Convert callback-based methods to promise-based
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const appendFileAsync = promisify(fs.appendFile);
const unlinkAsync = promisify(fs.unlink);

const FILE_PATH = "example.txt";

/**
 * -------------------------------
 * 1. SYNCHRONOUS FILE OPERATIONS
 * -------------------------------
 */
export function syncFileOperations() {
  try {
    // Create / Write
    fs.writeFileSync(FILE_PATH, "Hello (Sync) World!\n");
    console.log("✅ File created synchronously");

    // Read
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    console.log("📖 Sync Read:", data);

    // Update (append)
    fs.appendFileSync(FILE_PATH, "Appended line (Sync)\n");
    console.log("✏️ Sync Update done");

    // Delete
    // fs.unlinkSync(FILE_PATH);
    // console.log("🗑️ File deleted synchronously");
  } catch (err) {
    console.error("❌ Sync Error:", err);
  }
}

/**
 * --------------------------------
 * 2. ASYNCHRONOUS FILE OPERATIONS
 * --------------------------------
 */
export async function asyncFileOperations() {
  try {
    // Create / Write
    await writeFileAsync(FILE_PATH, "Hello (Async) World!\n");
    console.log("✅ File created asynchronously");

    // Read
    const data = await readFileAsync(FILE_PATH, "utf-8");
    console.log("📖 Async Read:", data);

    // Update (append)
    await appendFileAsync(FILE_PATH, "Appended line (Async)\n");
    console.log("✏️ Async Update done");

    // Delete
    // await unlinkAsync(FILE_PATH);
    // console.log("🗑️ File deleted asynchronously");
  } catch (err) {
    console.error("❌ Async Error:", err);
  }
}

/**
 * ----------------------------
 * 3. STREAM FILE OPERATIONS
 * ----------------------------
 */
export function streamFileOperations() {
  try {
    // Create / Write using stream
    const writeStream = fs.createWriteStream(FILE_PATH);
    writeStream.write("Hello (Stream) World!\n");
    writeStream.write("Another line via stream\n");
    writeStream.end(() => console.log("✅ Stream write finished"));

    writeStream.on("finish", () => {
      // Read using stream
      const readStream = fs.createReadStream(FILE_PATH, { encoding: "utf-8" });
      console.log("📖 Stream Read:");
      readStream.on("data", (chunk) => {
        console.log("Chunk:", chunk);
      });

      readStream.on("end", () => {
        // Update using stream (append mode)
        const appendStream = fs.createWriteStream(FILE_PATH, { flags: "a" });
        appendStream.write("Appended via Stream\n");
        appendStream.end(() => console.log("✏️ Stream Update done"));

        // appendStream.on("finish", () => {
        //   // Delete after short delay
        //   setTimeout(() => {
        //     fs.unlink(FILE_PATH, (err) => {
        //       if (err) console.error("❌ Stream Delete Error:", err);
        //       else console.log("🗑️ File deleted via Stream");
        //     });
        //   }, 500);
        // });
      });
    });
  } catch (err) {
    console.error("❌ Stream Error:", err);
  }
}

// Run examples (uncomment to test one by one)
syncFileOperations();
asyncFileOperations();
streamFileOperations();
