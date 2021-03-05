var socket = io.connect();
var theParentElement = document.getElementById("event-listener");

theParentElement.addEventListener("click", function (e) {
  /*
  The parent aliment listens to a click.
  The click is validated if toggle button was clicked.
  Then title border color is changed accordingly.
  Then the state of the switch is send to server.
  */
  if (e.target !== e.currentTarget) {
    if (e.target.type === "checkbox") {
      let switchId = e.target.id;
      let toggle_switch = document.getElementById(switchId);
      let obj = {};
      titleColorChange(switchId, true);
      if (toggle_switch.checked) {
        obj[switchId] = "on";
        socket.emit("change_state", obj);
      } else {
        obj[switchId] = "off";
        socket.emit("change_state", obj);
      }

    }
  }
  e.stopPropagation();
});

socket.on("broadcast", function (data) {
  /* 
  This socket function listen to the broadcast made by the serve.
  SO that it can  change all of the clients data.
  */
  const id_name = Object.keys(data);
  const pin_state = Object.values(data);
  titleColorChange(id_name[0], false, true, pin_state[0]);
});


socket.on("connect", function () {
  /* 
  This socket function trigger as soon as it connect to the server.
  SO that it can change all of the clients data.
   */
  
  console.log("sending.....");
  socket.send("Connection established");
  socket.on("init_pin_state", (pinData) => {
    pinData.forEach(function (data) {
      const id_name = Object.keys(data);
      const pin_state = Object.values(data);
      titleColorChange(id_name[0], false, true, pin_state[0]);
    });
  });
});

function titleColorChange(
  switchId,
  checkToggleSwitch = false,
  checkPinState = false,
  pinState = "",
) {
  var toggle_switch_id = switchId;
  var toggle_switch = document.getElementById(toggle_switch_id);
  var title_id = toggle_switch.parentElement.parentElement.children[0].id;
  var title = document.getElementById(title_id);
  if (checkToggleSwitch) {
    if (toggle_switch.checked) {
      title.style.cssText = `box-shadow: 10px 0px green, 0 0 0 1px rgb(0 0 0 / 20%)`;
    } else {
      title.style.cssText = `box-shadow: 10px 0px red, 0 0 0 1px rgb(0 0 0 / 20%)`;
    }
  } else if (checkPinState) {
    if (pinState == "off") {
      title.style.cssText = `box-shadow: 10px 0px red, 0 0 0 1px rgb(0 0 0 / 20%)`;
      toggle_switch.checked = false;
    } else {
      title.style.cssText = `box-shadow: 10px 0px green, 0 0 0 1px rgb(0 0 0 / 20%)`;
      toggle_switch.checked = true;
    }
  }
}