(function() {
  "use strict";

  class App {
    constructor() {
      this.setEvents();
    }

    setEvents() {
      document
        .getElementById("enable_app")
        .addEventListener("click", () => this.turnOn());
    }

    turnOn() {
      heartRateSensor
        .connect()
        .then(this.handleDeviceConnection)
        .then(() => {
          heartRateSensor
            .startNotificationsHeartRateMeasurement()
            .then(this.handleHRData);
        });
    }

    handleDeviceConnection() {
      document.querySelector(".app").classList.add("active");
      document.querySelector(".device").innerHTML = heartRateSensor.device.name;

      heartRateSensor.getBatteryLevel().then(value => {
        document.querySelector(".battery").innerHTML = value;
      });
      heartRateSensor
        .getBodySensorLocation()
        .then(
          position => (document.querySelector(".position").innerHTML = position)
        );
    }

    handleHRData(hrData) {
      hrData.addEventListener("characteristicvaluechanged", event => {
        var data = heartRateSensor.parseHeartRate(event.target.value);
        document
          .querySelector(".app .vis")
          .setAttribute(
            "style",
            `animation-duration: ${60 / data.heartRate}s;`
          );
        document.querySelector(".hear_rate").innerHTML = data.heartRate;
      });
    }
  }

  new App();
})();
