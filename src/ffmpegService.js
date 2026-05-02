import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
const ffmpeg = new FFmpeg();

export async function loadFFmpeg(setStatus) {
  if (ffmpeg.loaded) return;

  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });

  setStatus('Loading FFmpeg (~20MB from CDN)...');
  await ffmpeg.load({
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
  });
  setStatus('FFmpeg Ready');
}

export async function convertToMp4(file, setProgress, setStatus) {
  let progressHandler;

  try {
    await loadFFmpeg(setStatus);

    progressHandler = ({ progress }) => {
      setProgress(Number((progress * 100).toFixed(2)));
    };
    ffmpeg.on('progress', progressHandler);

    setStatus('Converting video...');
    
    // Cleanup previous files
    try {
      await ffmpeg.deleteFile('input');
      await ffmpeg.deleteFile('output.mp4');
    } catch (e) {}

    await ffmpeg.writeFile('input', await fetchFile(file));

    await ffmpeg.exec([
      '-i', 'input',
      '-c', 'copy',
      'output.mp4'
    ]);

    const data = await ffmpeg.readFile('output.mp4');
    setStatus('Done');
    return { name: 'converted.mp4', data };
  } catch (error) {
    console.error(error);
    setStatus(`Error: ${error?.message || 'Failed to convert video'}`);
    throw error;
  } finally {
    if (progressHandler) {
      ffmpeg.off('progress', progressHandler);
    }
  }
}

export async function splitVideo(file, segmentTime, setProgress, setStatus) {
  let progressHandler;

  try {
    await loadFFmpeg(setStatus);

    progressHandler = ({ progress }) => {
      setProgress(Number((progress * 100).toFixed(2)));
    };
    ffmpeg.on('progress', progressHandler);

    setStatus('Processing video...');

    const existingFiles = await ffmpeg.listDir('/');
    for (const f of existingFiles) {
      if (f.name.startsWith('chunk_') || f.name === 'input.mp4') {
        try {
          await ffmpeg.deleteFile(f.name);
        } catch {
          // Ignore cleanup failures; they should not block the new split.
        }
      }
    }

    await ffmpeg.writeFile('input.mp4', await fetchFile(file));

    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-c', 'copy',
      '-map', '0',
      '-segment_time', String(segmentTime),
      '-f', 'segment',
      'chunk_%03d.mp4'
    ]);

    const files = await ffmpeg.listDir('/');
    const chunkFiles = files.filter((entry) => !entry.isDir && entry.name.startsWith('chunk_'));

    const chunks = [];
    for (const chunk of chunkFiles) {
      const data = await ffmpeg.readFile(chunk.name);
      chunks.push({ name: chunk.name, data });
    }

    setStatus('Done');
    return chunks;
  } catch (error) {
    console.error(error);
    setStatus(`Error: ${error?.message || 'Failed to split video'}`);
    throw error;
  } finally {
    if (progressHandler) {
      ffmpeg.off('progress', progressHandler);
    }
  }
}
