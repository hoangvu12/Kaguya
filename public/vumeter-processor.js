const SMOOTHING_FACTOR = 0.8;
const MINIMUM_VALUE = 0.00001;

// This is the way to register an AudioWorkletProcessor
// it's necessary to declare a name, in this case
// the name is "vumeter"
registerProcessor(
  "vumeter",
  class extends AudioWorkletProcessor {
    _volume;
    _updateIntervalInMS;
    _nextUpdateFrame;

    constructor() {
      super();
      this._volume = 0;
      this._updateIntervalInMS = 25;
      this._nextUpdateFrame = this._updateIntervalInMS;
      this.port.onmessage = (event) => {
        if (event.data.updateIntervalInMS)
          this._updateIntervalInMS = event.data.updateIntervalInMS;
      };
    }

    get intervalInFrames() {
      return (this._updateIntervalInMS / 1000) * sampleRate;
    }

    process(inputs) {
      const input = inputs[0];

      // Note that the input will be down-mixed to mono; however, if no inputs are
      // connected then zero channels will be passed in.
      if (input.length > 0) {
        const samples = input[0];
        let sum = 0;
        let rms = 0;

        // Calculated the squared-sum.
        for (let i = 0; i < samples.length; ++i) sum += samples[i] * samples[i];

        // Calculate the RMS level and update the volume.
        rms = Math.sqrt(sum / samples.length);
        this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);

        // Update and sync the volume property with the main thread.
        this._nextUpdateFrame -= samples.length;
        if (this._nextUpdateFrame < 0) {
          this._nextUpdateFrame += this.intervalInFrames;
          this.port.postMessage({ volume: this._volume });
        }
      }

      return true;
    }
  }
);
