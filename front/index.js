const imageForm = document.querySelector("#imageForm");
const imageInput = document.querySelector("#imageInput");

imageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = imageInput.files[0];

  // get secure url from our server
  const { url } = await fetch("/s3Url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sec-fetch-mode": "no-cors",
    },
    body: JSON.stringify({ file_name: file.name }),
  }).then((res) => res.json());

  // post the image direclty to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: file,
  });

  const imageUrl = url.split("?")[0];
  console.log(imageUrl);

  // post requst to my server to store any extra data

  const img = document.createElement("img");
  img.src = imageUrl;
  document.body.appendChild(img);
  
  function uploadFile() {
  var file = _("file1").files[0];
  // alert(file.name+" | "+file.size+" | "+file.type);
  var formdata = new FormData();
  formdata.append("file1", file);
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", "file_upload_parser.php"); // http://www.developphp.com/video/JavaScript/File-Upload-Progress-Bar-Meter-Tutorial-Ajax-PHP
  //use file_upload_parser.php from above url
  ajax.send(formdata);
}

  function progressHandler(event) {
    _("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
    var percent = (event.loaded / event.total) * 100;
    _("progressBar").value = Math.round(percent);
    _("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
  }

  function completeHandler(event) {
    _("status").innerHTML = event.target.responseText;
    _("progressBar").value = 0; //wil clear progress bar after successful upload
  }

  function errorHandler(event) {
    _("status").innerHTML = "Upload Failed";
  }

  function abortHandler(event) {
    _("status").innerHTML = "Upload Aborted";
}
});
