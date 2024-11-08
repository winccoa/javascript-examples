# Weather Information Example

This is a simple example showing how to integrate information from a online wheater service into WinCC OA using JavaScript.

## Installation

1. Copy this directory to the drive where your WinCC OA projects are residing.

2. Integrate this directory as a sub-project of a WinCC OA project.

3. Use the ASCII manager to import `dplist/weatherInfo.dpl` (contains a DPT and two DPs).

4. Open a command prompt in the directory `javascript/weather-info`

5. Call the following command to install required modules

   ```
   > npm install
   ```

6. Add a __JavaScript Manager__ with `weather-info/index.js` as its only parameter. Set Start mode to __manual__.

7. Start the manager added in the last step. If everything works as expected, you should see new
   log lines starting with `0/javascript, Updated:` every five seconds.

8. Open the panel `weatherInfo.pnl` to see up-to-date weather data for Vienna and Eisenstadt

## Adding locations

To add locations, create new DPs of type `WeatherInfo` and set the location DPE
(e.g. "San Francisco, CA"). When the new DP is saved, the manager receives an update
and will set all other DPEs in that DP. To see data in the panel, change the dollar
parameter of one of the panel reference to the name of the DP you created (or add
a new panel reference to `weatherDetails.pnl` and set its dollar parameter).