#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <NewPing.h>

// Replace with your network credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server URL
const char* serverURL = "http://localhost:3001/nivel";

// HC-SR04 pins
const int trigPin = D1; // GPIO5
const int echoPin = D2; // GPIO4

// HC-SR04 parameters
const int maxDistance = 200; // Maximum distance to measure (in centimeters)
const int triggerInterval = 2000; // Time interval between measurements (in milliseconds)

// Create a NewPing object with the HC-SR04 pins and maximum distance
NewPing sonar(trigPin, echoPin, maxDistance);

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");
}

void loop() {
  // Get the distance from the HC-SR04 sensor
  int distance = sonar.ping_cm();

  if (distance > 0) {
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    // Send the distance to the server
    sendDataToServer(distance);
  } else {
    Serial.println("Error: Measurement failed!");
  }

  delay(triggerInterval);
}

void sendDataToServer(int distance) {
  // Start the server communication library
  WiFiClient client;
  if (!client.connect("localhost", 3001)) {
    Serial.println("Connection to server failed!");
    return;
  }

  // Prepare the JSON data to send to the server
  String data = "{\"nivel\": " + String(distance) + "}";

  // Send a POST request to the server with the JSON data
  HTTPClient http;
  http.begin(client, serverURL);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(data);
  http.end();

  if (httpCode == HTTP_CODE_OK) {
    Serial.println("Data sent successfully!");
  } else {
    Serial.println("Failed to send data to server!");
  }
}
