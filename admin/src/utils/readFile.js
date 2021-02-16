export default async function readFile(file, cb) {
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    cb(JSON.parse(reader.result), file.name);
  });
  reader.readAsText(file);
}
