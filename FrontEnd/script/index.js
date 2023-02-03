console.log("Heey");

let subButton_1 = document.getElementById("submit-btn-1");
let subButton_2 = document.getElementById("submit-btn-2");

let inputField_1 = document.getElementById("urlInput-1");
let inputField_2 = document.getElementById("urlInput-2");

/*For POST */
subButton_1.onclick = function () {
  //console.log("Clicked:- " + inputField_1);
  //inputField_1.value = "Jingle";
  fetch("http://127.0.0.1:8080/url-fetch", {
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
      alert("Website: " + inputField_1.value + "\nNew Url: " + data.new_Url);
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
      return res.json();
    })
    .then((data) => {
      if (data.length == 2) {
        console.log(data[1].actualUrl);
        let newPage = data[1].actualUrl;
        //location.replace();
        window.open(newPage);
      } else if (data.actualUrl == 1.1) {
        alert("No such short URL found!");
      } else {
        console.log(data[0].actualUrl);

        let newPage = data[0].actualUrl;
        console.log(newPage);
        //location.replace();
        location.href(newPage, "__blank");
      }
    });
};

/*For GET */
// subButton_2.onclick = function () {
//   console.log("Clicked!!");

//   fetch("http://127.0.0.1:8080/url-direct")
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// };
