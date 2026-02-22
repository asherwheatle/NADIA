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

  // Normalize
  const gain = 1 / peak;
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const data = audioBuffer.getChannelData(i);
    for (let j = 0; j < data.length; j++) {
      data[j] *= gain;
    }
  }

  // Convert back to WAV Blob
  const wavBlob = audioBufferToWavBlob(audioBuffer);

  return wavBlob;
}

// Helper: AudioBuffer → WAV Blob
function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;

  let samples;
  if (numChannels === 2) {
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    samples = interleave(left, right);
  } else {
    samples = buffer.getChannelData(0);
  }

  const wavBuffer = encodeWAV(samples, numChannels, sampleRate, bitDepth);
  return new Blob([wavBuffer], { type: "audio/wav" });
}

function interleave(left, right) {
  const length = left.length + right.length;
  const result = new Float32Array(length);

  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    result[index++] = left[inputIndex];
    result[index++] = right[inputIndex];
    inputIndex++;
  }
  return result;
}

function encodeWAV(samples, numChannels, sampleRate, bitDepth) {
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);

  floatTo16BitPCM(view, 44, samples);

  return buffer;
}

function floatTo16BitPCM(view, offset, samples) {
  for (let i = 0; i < samples.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}