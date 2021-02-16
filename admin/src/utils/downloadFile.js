export default function downloadFile(file, fileName) {
  var json = file;

  var data =
    "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
  var a = document.createElement("a");
  a.href = "data:" + data;
  a.download = `${fileName}.json`;
  a.innerHTML = "download JSON";

  var container = document.getElementById("download");
  container.appendChild(a);
  a.click();

  a.remove();
}
