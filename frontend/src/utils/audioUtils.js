export async function normalizeAudio(file) {
  const audioContext = new AudioContext();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Find peak amplitude
  let peak = 0;
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const data = audioBuffer.getChannelData(i);
    for (let j = 0; j < data.length; j++) {
      peak = Math.max(peak, Math.abs(data[j]));
    }
  }

  // Normalize to -1 to 1 range
  const gain = 1 / peak;

  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const data = audioBuffer.getChannelData(i);
    for (let j = 0; j < data.length; j++) {
      data[j] *= gain;
    }
  }

  return audioBuffer;
}