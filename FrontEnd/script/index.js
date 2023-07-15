//let back_uri = "http://127.0.0.1:8080";
let back_uri = "https://kunal-urlmicroservice.cyclic.app";

let subButton_1 = document.getElementById("submit-btn-1");
let subButton_2 = document.getElementById("submit-btn-2");

let inputField_1 = document.getElementById("urlInput-1");
let inputField_2 = document.getElementById("urlInput-2");

/*For POST of new */
subButton_1.onclick = function () {
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
        // window.alert(
        //   "URL '" + data.actualUrl + "' already found on code: " + data.newUrl
        // );

        swal({
          title: "Woah!!",
          text: `The '${data.actualUrl}' is already shortened as ${data.newUrl}`,
          icon: "info",
          button: "Okay",
        });
      } else {
        // window.alert(
        //   "URL '" + data.actualUrl + "' saved on code: " + data.newUrl
        // );

        swal({
          title: "Success",
          text: `The '${data.actualUrl}' is shortened as ${data.newUrl}`,
          icon: "success",
          button: "Okay",
        });
      }
      //alert("Website: " + inputField_1.value + "\nNew Url: " + data.new_Url);
    });
};

/*For POST of fetch*/
subButton_2.onclick = function () {
  console.log(inputField_2.value);
  fetch(back_uri + "/url-direct", {
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
        // window.alert("No such short URL found");
        swal({
          title: "Oops!",
          text: "The URL couldn't be found, please try again!",
          icon: "info",
          button: "Okay",
        });
      } else return res.json();
    })
    .then((data) => {
      //console.log(data[0].actualUrl);
      swal({
        title: "Yayy!",
        text: `Redirecting to '${data[0].actualUrl}'`,
        icon: "success",        
      });

      // Function to execute after the delay
      function delayedFunction() {
        window.open("https://" + data[0].actualUrl);
      }

      // Delay of 2 seconds (2000 milliseconds)
      setTimeout(delayedFunction, 3000);
    });
};
