let back_uri = "http://127.0.0.1:8080";

let subButton_1 = document.getElementById("submit-btn-1");
let subButton_2 = document.getElementById("submit-btn-2");

let inputField_1 = document.getElementById("urlInput-1");
let inputField_2 = document.getElementById("urlInput-2");

/*For POST */
subButton_1.onclick = function () {
  //console.log("Clicked:- " + inputField_1);
  //inputField_1.value = "Jingle";
  fetch(back_uri + "/url-fetch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      actualUrl: inputField_1.value,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.status == "duplication error") {
        window.alert(
          "URL '" + data.actualUrl + "' already found on code: " + data.newUrl
        );
      } else {
        window.alert(
          "URL '" + data.actualUrl + "' saved on code: " + data.newUrl
        );
      }
      //alert("Website: " + inputField_1.value + "\nNew Url: " + data.new_Url);
    });
};

/*For POST */
subButton_2.onclick = function () {
  console.log(inputField_2.value);
  fetch("http://127.0.0.1:8080/url-direct", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newUrl: inputField_2.value,
    }),
  })
    .then((res) => {
      if (res.status == 404) {
        window.alert("No such short URL found");
      } else return res.json();
    })
    .then((data) => {
      console.log(data[0].actualUrl);
      window.open("https://" + data[0].actualUrl);
    });
};
